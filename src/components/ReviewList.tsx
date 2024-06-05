import React, { FC } from 'react';
import { ReviewDTO } from '@/data/types';
import CommentListing from '@/components/CommentListing';

interface ReviewListProps {
  reviews: ReviewDTO[];
  onEditReview: (reviewId: number, updatedComment: string) => void;
  onDeleteReview: (reviewId: number) => void;
  isUserAuthorized: boolean;
}

const ReviewList: FC<ReviewListProps> = ({ reviews, onEditReview, onDeleteReview, isUserAuthorized }) => {
  return (
    <div>
      {reviews.map(review => (
        <CommentListing
          key={review.id}
          data={review}
          onEditReview={onEditReview}
          onDeleteReview={onDeleteReview}
          isUserAuthorized={isUserAuthorized}
        />
      ))}
    </div>
  );
};

export default ReviewList;
