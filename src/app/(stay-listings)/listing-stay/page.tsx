"use client"
import React, { FC } from "react";
import useScrollToTop from '@/hooks/useScrollToTop';

export interface ListingStayPageProps {}

const ListingStayPage: FC<ListingStayPageProps> = () => {
  useScrollToTop();
  return <div></div>;
};

export default ListingStayPage;
