import __stayListing from "./jsons/__stayListing.json";
import __experiencesListing from "./jsons/__experiencesListing.json";
import {
  DEMO_STAY_CATEGORIES,
  DEMO_EXPERIENCES_CATEGORIES,
} from "./taxonomies";
import { ExperiencesDataType, StayDataType } from "./types";
import { DEMO_AUTHORS } from "./authors";
import { Route } from "@/routers/types";


const DEMO_STAY_LISTINGS = __stayListing.map((post, index): StayDataType => {
  // Assuming DEMO_AUTHORS is an array where each object has `id` and `name` properties.
  const author = DEMO_AUTHORS.find(user => user.id === post.authorId);


  
  // Since we don't have separate address components in the provided data,
  // we'll need to add placeholders or derive them as best as possible.
  return {
    id: index, // Assuming you want the ID to be numeric
    authorId: post.authorId,
    authorDisplayName: author ? author.username : "Unknown Author", // Replace 'name' with the appropriate field from DEMO_AUTHORS
    date: post.date,
    title: post.title,
    featuredImage: post.featuredImage,
    galleryImageUrls: post.galleryImageUrls,
    reviewStart: post.reviewStart,
    reviewCount: post.reviewCount,
    country: "Not Specified", // Placeholder, adjust as needed
    street: post.street, // Using 'address' for 'street', adjust as needed
    city: "Not Specified", // Placeholder, adjust as needed
    state: "Not Specified", // Placeholder, adjust as needed
    postalCode: "Not Specified", // Placeholder, adjust as needed
    propertyType: "Not Specified", // Placeholder, adjust as needed
    rentalFormType: "Not Specified", // Placeholder, adjust as needed
    acreage: 0, // Placeholder, adjust as needed
    maxGuests: post.maxGuests,
    bedrooms: post.bedrooms,
    beds: 0, // Assuming beds data is not available; adjust as needed
    bathrooms: post.bathrooms,
    kitchens: 0, // Assuming kitchens data is not available; adjust as needed
    checkInHours: "Not Specified", // Placeholder, adjust as needed
    checkOutHours: "Not Specified", // Placeholder, adjust as needed
    specialRestrictions: [], // Placeholder, adjust as needed
    accommodationDescription: "Not Specified", // Placeholder, adjust as needed
    weekdayPrice: post.weekdayPrice,
    weekendPrice: post.weekendPrice, // Assuming the same price for simplicity; adjust as needed
    longTermStayDiscount: 0, // Placeholder, adjust as needed
    minimumNights: 0, // Placeholder, adjust as needed
    maximumNights: 0, // Placeholder, adjust as needed
    lat: post.lat,
    lng: post.lng,
    amenityIds: [], // Placeholder, adjust as needed
    amenityNames: [], // Placeholder, adjust as needed
    availableDates: [], // Placeholder, adjust as needed
    like: post.like,
  };
});

const DEMO_EXPERIENCES_LISTINGS = __experiencesListing.map(
  (post, index): ExperiencesDataType => {
    //  ##########  GET CATEGORY BY CAT ID ######## //
    const category = DEMO_EXPERIENCES_CATEGORIES.filter(
      (taxonomy) => taxonomy.id === post.listingCategoryId
    )[0];

    return {
      ...post,
      id: `experiencesListing_${index}_`,
      saleOff: !index ? "-20% today" : post.saleOff,
      author: DEMO_AUTHORS.filter((user) => user.id === post.authorId)[0],
      listingCategory: category,
      href: post.href as Route,
    };
  }
);

export { DEMO_STAY_LISTINGS, DEMO_EXPERIENCES_LISTINGS };
