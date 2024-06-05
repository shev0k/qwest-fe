// src/utils/reservationUtils.ts
export const calculateNightsBetweenDates = (startDate: Date, endDate: Date): number => {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.floor((endDate.getTime() - startDate.getTime()) / msPerDay);
};

export const applyDiscountForLongStays = (nights: number, pricePerNight: number, discountPercentage: number = 10): number => {
    return nights >= 30 ? pricePerNight * (1 - discountPercentage / 100) : pricePerNight;
};
