import React, { FC, useCallback, useEffect, useState } from "react";
import { useListingForm } from '@/contexts/ListingFormContext';

export interface PageAddListing7Props {}

const PageAddListing7: FC<PageAddListing7Props> = () => {
  const { updateListingData, uploadImage, deleteImage, listingData, setFormValid } = useListingForm();
  const [featuredImageError, setFeaturedImageError] = useState<string>('');
  const [galleryImageError, setGalleryImageError] = useState<string>('');

  const handleFileChange = useCallback(async (files: FileList | null, type: 'featured' | 'gallery') => {
    if (!files) return;

    const validFiles = Array.from(files).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file.name));
    const allowedFiles = validFiles.slice(0, 5); // Limit gallery images to 5

    try {
      if (type === 'featured' && validFiles.length === 1) {
        await uploadImage(validFiles[0], 'featured');
        setFeaturedImageError('');
      } else if (type === 'gallery') {
        await Promise.all(allowedFiles.map(file => uploadImage(file, 'gallery')));
        setGalleryImageError('');
      }
    } catch (error) {
      console.error(`Failed to upload ${type} image(s):`, error);
      if (type === 'featured') {
        setFeaturedImageError('Failed to upload featured image.');
      } else {
        setGalleryImageError('Failed to upload gallery images.');
      }
    }
  }, [uploadImage]);

  const handleDelete = useCallback(async (url: string, type: 'featured' | 'gallery') => {
    try {
      await deleteImage(url);
    } catch (error) {
      console.error(`Failed to delete ${type} image:`, error);
      // Continue with local state update regardless of cloud deletion success
    } finally {
      if (type === 'featured') {
        updateListingData({ featuredImage: '' });
      } else {
        updateListingData({ galleryImageUrls: listingData.galleryImageUrls?.filter(imageUrl => imageUrl !== url) || [] });
      }
    }
  }, [deleteImage, updateListingData, listingData.galleryImageUrls]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Necessary to allow the drop event to fire
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>, type: 'featured' | 'gallery') => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleFileChange(files, type);
  }, [handleFileChange]);

  useEffect(() => {
    const hasFeaturedImage = !!listingData.featuredImage;
    const hasGalleryImages = Array.isArray(listingData.galleryImageUrls) && listingData.galleryImageUrls.length >= 1 && listingData.galleryImageUrls.length <= 5;
    setFormValid(hasFeaturedImage && hasGalleryImages);
  }, [listingData.featuredImage, listingData.galleryImageUrls, setFormValid]);

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">Stay Imagery</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Attractive photographs can significantly enhance guests&apos; connection with your accommodation.
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      <div className="space-y-8">
        <div>
          <span className="text-lg font-semibold">Cover Image</span>
          <div className="mt-5">
            <div
              className="flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-600 border-dashed rounded-md"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'featured')}
            >
              <div className="space-y-3 text-center">
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  disabled={!!listingData.featuredImage}
                  onChange={(e) => handleFileChange(e.target.files, 'featured')}
                  accept="image/png, image/jpeg, image/gif, image/jpg"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex text-sm text-neutral-600">
                    <span>Upload file</span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    PNG, JPG, GIF up to 100MB
                  </p>
                </label>
                {listingData.featuredImage && (
                  <div className="flex gap-4 mt-4 justify-center">
                    <div className="relative inline-block">
                      <img src={listingData.featuredImage} alt="Featured" className="w-24 h-24 object-cover rounded-lg" />
                      <div
                        className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                        onClick={() => handleDelete(listingData.featuredImage, 'featured')}
                      >
                        <span className="text-white text-xl">✕</span>
                      </div>
                    </div>
                  </div>
                )}
                {featuredImageError && <div className="text-red-500 text-sm">{featuredImageError}</div>}
              </div>
            </div>
          </div>
        </div>
        <div>
          <span className="text-lg font-semibold">Images of the Property</span>
          <div className="mt-5">
            <div
              className="flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-600 border-dashed rounded-md"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'gallery')}
            >
              <div className="space-y-3 text-center">
                <input
                  id="file-upload-2"
                  name="file-upload-2"
                  type="file"
                  className="sr-only"
                  disabled={listingData.galleryImageUrls?.length >= 5}
                  onChange={(e) => handleFileChange(e.target.files, 'gallery')}
                  accept="image/png, image/jpeg, image/gif, image/jpg"
                />
                <label htmlFor="file-upload-2" className="cursor-pointer">
                  <div className="text-sm text-neutral-600">
                    <span>Upload file/s or drag and drop</span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    PNG, JPG, GIF up to 100MB
                  </p>
                </label>
                {listingData.galleryImageUrls && listingData.galleryImageUrls.length > 0 && (
                  <div className="flex gap-4 mt-4 justify-center">
                    {listingData.galleryImageUrls.map((url, index) => (
                      <div key={index} className="relative inline-block">
                        <img src={url} alt={`Gallery ${index}`} className="w-24 h-24 object-cover rounded-lg" />
                        <div
                          className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                          onClick={() => handleDelete(url, 'gallery')}
                        >
                          <span className="text-white text-xl">✕</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {galleryImageError && <div className="text-red-500 text-sm">{galleryImageError}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageAddListing7;
