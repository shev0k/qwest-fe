import { Route } from "@/routers/types";
import { StaticImageData } from "next/image";

//  ######  CustomLink  ######## //
export interface CustomLink {
  label: string;
  href: Route<string> | string;
  targetBlank?: boolean;
}

export interface ListingGalleryImage {
  id: number;
  url: string;
}

export interface ReviewDTO {
  id?: number;
  rating: number;
  comment: string;
  stayListingId: number;
  authorId: number;
  authorName: string;
  authorAvatar?: string | StaticImageData;
  stayTitle?: string;
  createdDate?: string;
  createdAt?: string;
}

export interface ReservationDTO {
  id?: number;
  authorId: number;
  stayListingId: number;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  infants: number;
  totalPrice: number;
  bookingCode?: string;
  cancelled?: boolean;
  selectedDates: string[];
}

//  ##########  PostDataType ######## //
export interface TaxonomyType {
  id: string | number;
  name: string;
  href?: Route<string>;
  count: number;
  thumbnail?: string;
  desc?: string;
  color?: TwMainColor | string;
  taxonomy: "category" | "tag";
  listingType?: "stay" | "experiences";
}

export interface NotificationType {
  id: number;
  authorId: number;
  senderId: number;
  senderName: string;
  senderAvatar: string;
  message: string;
  timestamp: string;
  type: string;
  timestampFormatted: string | null;
  read: boolean;
  isRead: boolean;
  stayId?: number;
}



export interface AuthorType {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string | StaticImageData;
  bgImage?: string | StaticImageData;
  email?: string;
  role?: string;
  phoneNumber?: string;
  count: number;
  description: string;
  country?: string;
  jobName: string;
  href: Route<string>;
  starRating?: number;
  wishlistIds: number[];
}

export interface PostDataType {
  id: string | number;
  author: AuthorType;
  date: string;
  href: Route<string>;
  categories: TaxonomyType[];
  title: string;
  featuredImage: StaticImageData | string;
  desc?: string;
  commentCount: number;
  viewdCount: number;
  readingTime: number;
  postType?: "standard" | "video" | "gallery" | "audio";
}

export type TwMainColor =
  | "pink"
  | "green"
  | "yellow"
  | "red"
  | "indigo"
  | "blue"
  | "purple"
  | "gray";

  export interface GuestsObject {
    guestAdults: number;
    guestChildren: number;
    guestInfants: number;
  }
//
export interface StayDataType {
  id: number;
  authorId: number;
  authorDisplayName: string;
  date: string;
  title: string;
  featuredImage: string;
  galleryImageUrls: string[];
  reviewStart: number;
  reviewCount: number;
  country: string;
  street: string;
  roomNumber?: string;
  city: string;
  state: string;
  postalCode: string;
  propertyType: string;
  rentalFormType: string;
  acreage: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  kitchens: number;
  checkInHours: string;
  checkOutHours: string;
  specialRestrictions: string[];
  accommodationDescription: string;
  weekdayPrice: number;
  weekendPrice: number;
  longTermStayDiscount: number;
  minimumNights: number;
  maximumNights: number;
  lat: number;
  lng: number;
  amenityIds: number[];
  amenityNames: string[];
  availableDates: string[];
  like: boolean;
  likedByAuthorIds: number[]; // Add this field
}

export interface Amenity {
  id: number;
  name: string;
  category: string;
}

//
export interface ExperiencesDataType {
  id: string | number;
  author: AuthorType;
  date: string;
  href: Route<string>;
  title: string;
  featuredImage: StaticImageData | string;
  commentCount: number;
  viewCount: number;
  address: string;
  reviewStart: number;
  reviewCount: number;
  like: boolean;
  galleryImgs: (StaticImageData | string)[];
  price: string;
  listingCategory: TaxonomyType;
  maxGuests: number;
  saleOff?: string | null;
  isAds: boolean | null;
  map: {
    lat: number;
    lng: number;
  };
}

