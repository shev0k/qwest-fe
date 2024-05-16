"use client";

import BackgroundSection from "@/components/BackgroundSection";
import ListingImageGallery from "@/components/listing-image-gallery/ListingImageGallery";
import SectionSliderNewCategories from "@/components/SectionSliderNewCategories";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import MobileFooterSticky from "./(components)/MobileFooterSticky";
import { ListingGalleryImage, StayDataType } from "@/data/types"; // Adjust the path as needed
import { Route } from "next";
import fetchStayListingById from "@/api/fetchStayListingById"; // Adjust the path as needed

const DetailtLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const modal = searchParams?.get("modal");

  const [images, setImages] = useState<ListingGalleryImage[]>([]);

  const handleCloseModalImageGallery = () => {
    let params = new URLSearchParams(document.location.search);
    params.delete("modal");
    router.push(`${pathname}?${params.toString()}` as unknown as Route);
  };

  const getImageGalleryListing = () => {
    if (pathname?.includes("/listing-stay-detail")) {
      return images;
    }
    return [];
  };

  useEffect(() => {
    const id = pathname.split('/').pop();
    if (id) {
      fetchStayListingById(id)
        .then((data: StayDataType) => {
          const formattedImages = data.galleryImageUrls.map((url: string, index: number) => ({
            id: index,
            url,
          }));
          setImages(formattedImages);
        })
        .catch(error => console.error(error));
    }
  }, [pathname]);

  return (
    <div className="ListingDetailPage">
      <ListingImageGallery
        isShowModal={modal === "PHOTO_TOUR_SCROLLABLE"}
        onClose={handleCloseModalImageGallery}
        images={getImageGalleryListing()}
      />

      <div className="container ListingDetailPage__content">{children}</div>

      {/* OTHER SECTION */}
      <div className="container py-24 lg:py-32">
        <div className="relative py-16">
          <BackgroundSection />
          <SectionSliderNewCategories
            heading="Explore by Types of Stays"
            subHeading="Explore Stays Based on 4 Types of Stays"
            categoryCardType="card5"
            itemPerRow={4}
            sliderStyle="style2"
          />
        </div>
      </div>

      {/* STICKY FOOTER MOBILE */}
      <MobileFooterSticky />
    </div>
  );
};

export default DetailtLayout;
