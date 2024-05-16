import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StayDataType } from "@/data/types";
import { createStayListing, updateStayListing } from "@/api/stayServices";
import axios from '@/api/axiosConfig';
import { useAuth } from './authContext';

interface ListingContextType {
  listingData: StayDataType;
  updateListingData: (fields: Partial<StayDataType>) => void;
  uploadImage: (file: File, type: 'featured' | 'gallery') => Promise<void>;
  deleteImage: (imageUrl: string) => Promise<void>;
  submitListing: () => Promise<string | null>;
  isFormValid: boolean;
  setFormValid: (isValid: boolean) => void;
  originalAuthorId: number | null;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const ListingFormContext = createContext<ListingContextType | undefined>(undefined);

const sessionStorageKey = 'listingFormData';
const sessionStorageAuthorKey = 'originalAuthorId';

export const ListingFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const getInitialListingData = (): StayDataType => {
    if (typeof window !== 'undefined') {
      const savedData = sessionStorage.getItem(sessionStorageKey);
      return savedData ? JSON.parse(savedData) : {} as StayDataType;
    }
    return {} as StayDataType;
  };

  const getInitialAuthorId = (): number | null => {
    if (typeof window !== 'undefined') {
      const savedAuthorId = sessionStorage.getItem(sessionStorageAuthorKey);
      return savedAuthorId ? Number(savedAuthorId) : null;
    }
    return null;
  };

  const [listingData, setListingData] = useState<StayDataType>(getInitialListingData);
  const [originalAuthorId, setOriginalAuthorId] = useState<number | null>(getInitialAuthorId());
  const [isFormValid, setIsFormValid] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(sessionStorageKey, JSON.stringify(listingData));
      sessionStorage.setItem(sessionStorageAuthorKey, originalAuthorId?.toString() || '');
    }
  }, [listingData, originalAuthorId]);

  const updateListingData = (fields: Partial<StayDataType>) => {
    setListingData(prev => ({ ...prev, ...fields }));
  };

  const clearSessionData = () => {
    sessionStorage.removeItem(sessionStorageKey);
    sessionStorage.removeItem(sessionStorageAuthorKey);
  };

  const submitListing = async (): Promise<string | null> => {
    if (user) {
      const authorIdToSubmit = originalAuthorId ? originalAuthorId : user.id;
      const listingToSubmit = { ...listingData, authorId: authorIdToSubmit };

      try {
        if (listingData.id) {
          const response = await updateStayListing(listingData.id.toString(), listingToSubmit);
          clearSessionData();
          return `/listing-stay-detail/${response.id.toString()}`;
        } else {
          const response = await createStayListing(listingToSubmit);
          clearSessionData();
          return `/listing-stay-detail/${response.id.toString()}`;
        }
      } catch (error) {
        console.error('Failed to submit listing:', error);
        return null;
      }
    } else {
      console.error('No user context available for authorId');
      return null;
    }
  };

  const uploadImage = async (file: File, type: 'featured' | 'gallery') => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const imageUrl = response.data;
      if (type === 'featured') {
        updateListingData({ featuredImage: imageUrl });
      } else {
        const updatedGallery = listingData.galleryImageUrls ? [...listingData.galleryImageUrls, imageUrl] : [imageUrl];
        updateListingData({ galleryImageUrls: updatedGallery });
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  };

  const deleteImage = async (imageUrl: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/delete`, { params: { imageUrl } });
      if (imageUrl === listingData.featuredImage) {
        updateListingData({ featuredImage: '' });
      } else {
        const updatedGallery = listingData.galleryImageUrls?.filter(url => url !== imageUrl);
        updateListingData({ galleryImageUrls: updatedGallery });
      }
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  return (
    <ListingFormContext.Provider value={{
      listingData,
      updateListingData,
      submitListing,
      uploadImage,
      deleteImage,
      isFormValid,
      setFormValid: setIsFormValid,
      originalAuthorId,
      isEditing,
      setIsEditing
    }}>
      {children}
    </ListingFormContext.Provider>
  );
};

export const useListingForm = () => {
  const context = useContext(ListingFormContext);
  if (!context) {
    throw new Error('useListingForm must be used within a ListingFormProvider');
  }
  return context;
};
