"use client";

import { Tab } from "@headlessui/react";
import React, { FC, Fragment, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Avatar from "@/shared/Avatar";
import ButtonSecondary from "@/shared/ButtonSecondary";
import SocialsList from "@/shared/SocialsList";
import StartRating from "@/components/StartRating";
import StayCard from "@/components/StayCard2";
import { fetchStayListingsByAuthor } from "@/api/fetchStayListingsByAuthor";
import { fetchReviewsForAuthorStays } from "@/api/reviewServices";
import { StayDataType, ReviewDTO } from "@/data/types";
import { useAuth } from "@/contexts/authContext";
import CommentListing from "@/components/CommentListing";

export interface AuthorPageProps {}

const AuthorPage: FC<AuthorPageProps> = ({}) => {
  const [categories] = useState(["Stays"]);
  const [stayListings, setStayListings] = useState<StayDataType[]>([]);
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const { user, isAuthenticated, loginUser } = useAuth();
  const router = useRouter();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAllListings, setShowAllListings] = useState(false);

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('token');

    if (storedUserData && storedToken) {
      const userData = JSON.parse(storedUserData);
      // Simulate login to ensure user state is set
      loginUser(userData);
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchStayListingsByAuthor(user.id)
        .then((data) => setStayListings(data))
        .catch((error) => console.error("Failed to fetch stay listings:", error));
  
      fetchReviewsForAuthorStays(user.id)
        .then((data) => {
          setReviews(data);
          calculateRatingAndReviewCount(data);
        })
        .catch((error) => console.error("Failed to fetch reviews:", error));
    }
  }, [user]);

  const calculateRatingAndReviewCount = (reviews: ReviewDTO[]) => {
    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    setAverageRating(parseFloat(averageRating.toFixed(1)));
    setReviewCount(totalReviews);
  };

  const handleToggleShowAllReviews = () => {
    setShowAllReviews(!showAllReviews);
  };

  const handleToggleShowAllListings = () => {
    setShowAllListings(!showAllListings);
  };


  const renderSidebar = () => {
    if (!user) return null;

    const userName = user.firstName || user.lastName ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Name not set";

    return (
      <div className="w-full flex flex-col items-center text-center sm:rounded-2xl sm:border border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-7 px-0 sm:p-6 xl:p-8">
        <Avatar
          hasChecked
          hasCheckedClass="w-6 h-6 -top-0.5 right-2"
          sizeClass="w-28 h-28"
          imgUrl={user.avatar}
        />

        <div className="space-y-3 text-center flex flex-col items-center">
          <h2 className="text-3xl font-semibold">{userName}</h2>
          <StartRating className="!text-base" point={averageRating} reviewCount={reviewCount} />
        </div>
        {/* rating={user.starRating || 0} */}
        <p className="text-neutral-500 dark:text-neutral-400">
          {user.description || "Description not set"}
        </p>

        <SocialsList
          className="!space-x-3"
          itemClass="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xl"
        />

        <div className="border-b border-neutral-200 dark:border-neutral-700 w-14"></div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 color-yellow-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-neutral-6000 dark:text-neutral-300">
              {user.country || "Country not set"}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 color-yellow-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-neutral-6000 dark:text-neutral-300">
              Joined in March 2024
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderSection1 = () => {
    const displayedListings = showAllListings ? stayListings : stayListings.slice(0, 4);

    return (
      <div className="listingSection__wrap">
        <div>
          <h2 className="text-2xl font-semibold">{`${user?.firstName || "Author"}'s Listings`}</h2>
          <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
            {stayListings.length > 0 ? `Explore the collection of listings by ${user?.firstName || "the author"}` : "No listings available"}
          </span>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {stayListings.length > 0 ? (
          <div>
            <div className="mt-8 grid grid-cols-1 gap-6 md:gap-7 sm:grid-cols-2">
              {displayedListings.map((stay) => (
                <StayCard key={stay.id} data={stay} />
              ))}
            </div>
            {stayListings.length > 4 && (
              <div className="flex mt-11 justify-center items-center">
                <ButtonSecondary onClick={handleToggleShowAllListings}>
                  {showAllListings ? 'Hide Listings' : 'View More Listings'}
                </ButtonSecondary>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 text-center text-neutral-500 dark:text-neutral-400">
            This author currently has no listings available
          </div>
        )}
      </div>
    );
  };

  const renderSection8 = () => {
    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 4);

    return (
      <div className="listingSection__wrap">
        <h2 className="text-2xl font-semibold">
          Reviews ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
        </h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {reviews.length === 0 ? (
            <div className="text-neutral-500 dark:text-neutral-400 py-8">No reviews yet.</div>
          ) : (
            displayedReviews.map(review => (
              <CommentListing
                key={review.id}
                className="py-8"
                data={review}
                showStayTitle={true} // Always show the stay title
              />
            ))
          )}
          {reviews.length > 4 && (
            <div className="pt-8">
              <ButtonSecondary onClick={handleToggleShowAllReviews}>
                {showAllReviews ? 'Hide Reviews' : 'View More Reviews'}
              </ButtonSecondary>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`nc-AuthorPage`}>
      <main className="container mt-12 mb-24 lg:mb-32 flex flex-col lg:flex-row">
        <div className="block flex-grow mb-24 lg:mb-0">
          <div className="lg:sticky lg:top-24">{renderSidebar()}</div>
        </div>
        <div className="w-full lg:w-3/5 xl:w-2/3 space-y-8 lg:space-y-10 lg:pl-10 flex-shrink-0">
          {renderSection1()}
          {renderSection8()}
        </div>
      </main>
    </div>
  );
};

export default AuthorPage;
