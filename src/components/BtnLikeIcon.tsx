"use client";

import React, { FC, useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import Modal from "@/components/Modal";  // Add this import

export interface BtnLikeIconProps {
  className?: string;
  colorClass?: string;
  isLiked?: boolean;
  listingId: number;
}

const BtnLikeIcon: FC<BtnLikeIconProps> = ({
  className = "",
  colorClass = "text-white bg-black bg-opacity-30 hover:bg-opacity-50",
  isLiked = false,
  listingId,
}) => {
  const { user, handleAddToWishlist, handleRemoveFromWishlist, isAuthenticated } = useAuth();
  const [likedState, setLikedState] = useState(isLiked);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "message" as "message" | "confirm",
    message: "",
    onConfirm: () => setModal({ ...modal, isOpen: false }),
    onCancel: () => setModal({ ...modal, isOpen: false }),
  });

  useEffect(() => {
    if (user && user.wishlistIds) {
      setLikedState(user.wishlistIds.includes(listingId));
    } else {
      setLikedState(isLiked);
    }
  }, [isLiked, user, listingId]);

  const handleWishlistClick = async () => {
    if (isAuthenticated) {
      try {
        if (likedState) {
          await handleRemoveFromWishlist(listingId);
          setLikedState(false);
        } else {
          await handleAddToWishlist(listingId);
          setLikedState(true);
        }
      } catch (error) {
        console.error("Error updating wishlist:", error);
      }
    } else {
      setModal({
        isOpen: true,
        type: "message",
        message: "You need to be logged in to add to wishlist",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
        onCancel: () => setModal({ ...modal, isOpen: false }),
      });
    }
  };

  return (
    <>
      <div
        className={`nc-BtnLikeIcon w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${
          likedState ? "nc-BtnLikeIcon--liked" : ""
        }  ${colorClass} ${className}`}
        data-nc-id="BtnLikeIcon"
        title="Save"
        onClick={handleWishlistClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill={likedState ? "currentColor" : "none"}
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </div>
      <Modal
        type={modal.type}
        message={modal.message}
        isOpen={modal.isOpen}
        onClose={modal.onCancel}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
      />
    </>
  );
};

export default BtnLikeIcon;
  