import React, { useState } from "react";
import { useAuth } from "@/contexts/authContext";
import Modal from "@/components/Modal";  // Add this import

interface LikeSaveBtnsProps {
  listingId: number;
}

const LikeSaveBtns: React.FC<LikeSaveBtnsProps> = ({ listingId }) => {
  const { user, handleAddToWishlist, handleRemoveFromWishlist, isAuthenticated } = useAuth();
  const isLiked = user?.wishlistIds?.includes(listingId) || false;

  const [modal, setModal] = useState({
    isOpen: false,
    type: "message" as "message" | "confirm",
    message: "",
    onConfirm: () => setModal({ ...modal, isOpen: false }),
    onCancel: () => setModal({ ...modal, isOpen: false }),
  });

  const handleWishlistClick = async () => {
    if (isAuthenticated) {
      try {
        if (isLiked) {
          await handleRemoveFromWishlist(listingId);
        } else {
          await handleAddToWishlist(listingId);
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
      <div className="flow-root">
        <div className="flex text-neutral-700 dark:text-neutral-300 text-sm -mx-3 -my-1.5">
          <span
            className="py-1.5 px-5 flex rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            onClick={handleWishlistClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill={isLiked ? "currentColor" : "none"}
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
            <span className="hidden sm:block ml-2.5">
              {isLiked ? "Saved" : "Save"}
            </span>
          </span>
        </div>
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

export default LikeSaveBtns;
