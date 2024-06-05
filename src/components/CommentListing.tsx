import React, { FC } from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import Avatar from "@/shared/Avatar";
import { ReviewDTO } from "@/data/types";
import EditButton from "@/components/EditButton";
import DeleteButton from "@/components/DeleteButton";
import { format, isValid } from 'date-fns';
import Link from "next/link";  // Import Link component from Next.js

interface CommentListingProps {
  className?: string;
  data: ReviewDTO;
  onEditReview?: (reviewId: number, updatedComment: string) => void;
  onDeleteReview?: (reviewId: number) => void;
  isUserAuthorized?: boolean;
  showStayTitle?: boolean; // Optional prop to show stay title
}

const CommentListing: FC<CommentListingProps> = ({
  className = "",
  data,
  onEditReview,
  onDeleteReview,
  isUserAuthorized = false, // Default to false
  showStayTitle = false, // Default to false
}) => {
  if (!data) return null;

  const handleEdit = () => {
    if (onEditReview) {
      const updatedComment = prompt("Edit your comment:", data.comment);
      if (updatedComment !== null) {
        onEditReview(data.id!, updatedComment);
      }
    }
  };

  const handleDelete = () => {
    if (onDeleteReview && confirm("Are you sure you want to delete this review?")) {
      onDeleteReview(data.id!);
    }
  };

  const date = new Date(data.createdAt || '');
  const formattedDate = isValid(date) ? format(date, 'MMM dd, yyyy') : 'Invalid Date';

  return (
    <div className={`nc-CommentListing flex space-x-4 ${className}`} data-nc-id="CommentListing">
      <div className="pt-0.5">
        <Avatar sizeClass="h-10 w-10 text-lg" radius="rounded-full" username={data.authorName} imgUrl={data.authorAvatar} />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between space-x-3">
          <div className="flex flex-col">
            <div className="text-sm font-semibold">
              <Link href={`/author/${data.authorId}`} passHref>
                {data.authorName}
              </Link>
              {showStayTitle && data.stayTitle && (
                <>
                  <span className="text-neutral-500 dark:text-neutral-400 font-normal">
                    {` review in `}
                  </span>
                  <Link href={`/listing-stay-detail/${data.stayListingId}`} passHref>
                    {data.stayTitle}
                  </Link>
                </>
              )}
            </div>
            <span className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              {formattedDate}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {isUserAuthorized && (
              <>
                <EditButton onClick={handleEdit} />
                <DeleteButton onClick={handleDelete} />
              </>
            )}
            <div className="flex text-yellow-500">
              {[...Array(data.rating)].map((_, i) => (
                <StarIcon key={i} className="w-4 h-4" />
              ))}
            </div>
          </div>
        </div>
        <span className="block mt-3 text-neutral-600 dark:text-neutral-300">
          {data.comment}
        </span>
      </div>
    </div>
  );
};

export default CommentListing;
