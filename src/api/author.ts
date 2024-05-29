import axiosInstance from '@/api/axiosConfig';

export const requestHostRole = async (authorId: number): Promise<void> => {
  try {
    await axiosInstance.post(`/authors/${authorId}/request-host`);
  } catch (error) {
    console.error("Request Host Role error:", error);
    throw error;
  }
};

export const approveHostRole = async (authorId: number): Promise<void> => {
  try {
    await axiosInstance.post(`/authors/${authorId}/approve-host`);
  } catch (error) {
    console.error("Approve Host Role error:", error);
    throw error;
  }
};

export const rejectHostRole = async (authorId: number): Promise<void> => {
  try {
    await axiosInstance.post(`/authors/${authorId}/reject-host`);
  } catch (error) {
    console.error("Reject Host Role error:", error);
    throw error;
  }
};

export const demoteToTraveler = async (authorId: number): Promise<void> => {
  try {
    await axiosInstance.post(`/authors/${authorId}/demote-traveler`);
  } catch (error) {
    console.error("Demote to Traveler error:", error);
    throw error;
  }
};
