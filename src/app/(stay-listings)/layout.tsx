import BackgroundSection from "@/components/BackgroundSection";
import BgGlassmorphism from "@/components/BgGlassmorphism";
import SectionSliderNewCategories from "@/components/SectionSliderNewCategories";
import React, { ReactNode } from "react";
import SectionHeroArchivePage from "../(server-components)/SectionHeroArchivePage";


const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={`nc-ListingStayPage relative `}>
      <BgGlassmorphism />

      {/* SECTION HERO */}
      <div className="container pt-10 pb-24 lg:pt-16 lg:pb-28">
        <SectionHeroArchivePage currentPage="Stays" currentTab="Stays" />
      </div>

      {children}

      <div className="container overflow-hidden">
        {/* SECTION 1 */}
        <div className="relative py-16 mb-24 lg:mb-28">
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
    </div>
  );
};

export default Layout;
