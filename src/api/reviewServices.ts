import axiosInstance from './axiosConfig';
import { ReviewDTO } from '@/data/types';


export const fetchAllReviews = async (): Promise<ReviewDTO[]> => {
    try {
        const response = await axiosInstance.get<ReviewDTO[]>('/reviews/all');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch all reviews:", error);
        throw error;
    }
};

// Fetch reviews by stay listing
export const fetchReviewsByStayListing = async (stayListingId: number): Promise<ReviewDTO[]> => {
    try {
        const response = await axiosInstance.get<ReviewDTO[]>(`/reviews/stay/${stayListingId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch reviews by stay listing:", error);
        throw error;
    }
};

// Fetch reviews for all stay listings by author
export const fetchReviewsForAuthorStays = async (authorId: number): Promise<ReviewDTO[]> => {
    try {
        const response = await axiosInstance.get<ReviewDTO[]>(`/reviews/author-stays/${authorId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch reviews for author's stays:", error);
        throw error;
    }
};

// Create a new review
export const createReview = async (review: ReviewDTO): Promise<ReviewDTO> => {
    try {
        const response = await axiosInstance.post<ReviewDTO>('/reviews', review);
        return response.data;
    } catch (error) {
        console.error("Failed to create review:", error);
        throw error;
    }
};

// Update an existing review
export const updateReview = async (reviewId: number, review: ReviewDTO): Promise<ReviewDTO> => {
    try {
        const response = await axiosInstance.put<ReviewDTO>(`/reviews/${reviewId}`, review);
        return response.data;
    } catch (error) {
        console.error("Failed to update review:", error);
        throw error;
    }
};

// Delete a review
export const deleteReview = async (reviewId: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/reviews/${reviewId}`);
    } catch (error) {
        console.error("Failed to delete review:", error);
        throw error;
    }
};
