"use client";

import React, { FC, useEffect, useState } from "react";
import { TaxonomyType, StayDataType } from "@/data/types";
import CardCategory3 from "@/components/CardCategory3";
import CardCategory4 from "@/components/CardCategory4";
import CardCategory5 from "@/components/CardCategory5";
import Heading from "@/shared/Heading";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import PrevBtn from "./PrevBtn";
import NextBtn from "./NextBtn";
import { variants } from "@/utils/animationVariants";
import { useWindowSize } from "react-use";
import fetchStayListings from "@/api/stayListingsService";

export interface SectionSliderCountriesProps {
  className?: string;
  itemClassName?: string;
  heading?: string;
  subHeading?: string;
  categoryCardType?: "card3" | "card4" | "card5";
  itemPerRow?: 4 | 5;
  sliderStyle?: "style1" | "style2";
  onLocationClick?: (location: string) => void;
}

const DEMO_CATS: Omit<TaxonomyType, "count">[] = [
  {
    id: "1",
    name: "Japan",
    taxonomy: "category",
    thumbnail:
      "https://images.pexels.com/photos/1654748/pexels-photo-1654748.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
  },
  {
    id: "4",
    name: "Netherlands",
    taxonomy: "category",
    thumbnail:
      "https://images.pexels.com/photos/2901480/pexels-photo-2901480.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
  },
  {
    id: "3",
    name: "France",
    taxonomy: "category",
    thumbnail:
      "https://images.pexels.com/photos/342113/pexels-photo-342113.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    id: "2",
    name: "Romania",
    taxonomy: "category",
    thumbnail:
      "https://images.pexels.com/photos/3570038/pexels-photo-3570038.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  },
  {
    id: "5",
    name: "England",
    taxonomy: "category",
    thumbnail:
      "https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
  },
];

const SectionSliderCountries: FC<SectionSliderCountriesProps> = ({
  heading = "Discover New Places",
  subHeading = "Recommended Destinations for You",
  className = "",
  itemClassName = "",
  itemPerRow = 4,
  categoryCardType = "card3",
  sliderStyle = "style1",
  onLocationClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [categories, setCategories] = useState<TaxonomyType[]>([]);
  const windowWidth = useWindowSize().width;

  useEffect(() => {
    if (windowWidth < 320) {
      setNumberOfItems(1);
    } else if (windowWidth < 500) {
      setNumberOfItems(itemPerRow - 3);
    } else if (windowWidth < 1024) {
      setNumberOfItems(itemPerRow - 2);
    } else if (windowWidth < 1280) {
      setNumberOfItems(itemPerRow - 1);
    } else {
      setNumberOfItems(itemPerRow);
    }
  }, [itemPerRow, windowWidth]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stays = await fetchStayListings();
        const categoriesWithCounts = DEMO_CATS.map((category) => ({
          ...category,
          count: stays.filter((stay) => stay.country === category.name).length,
        }));
        setCategories(categoriesWithCounts);
      } catch (error) {
        console.error("Error fetching stays:", error);
      }
    };

    fetchData();
  }, []);

  function changeItemId(newVal: number) {
    if (newVal > currentIndex) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    setCurrentIndex(newVal);
  }

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < categories?.length - 1) {
        changeItemId(currentIndex + 1);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        changeItemId(currentIndex - 1);
      }
    },
    trackMouse: true,
  });

  const renderCard = (item: TaxonomyType) => {
    const { name, count, thumbnail } = item;
    const displayCount = count ?? "None";

    return (
      <div onClick={() => onLocationClick?.(name)} style={{ cursor: "pointer" }}>
        {categoryCardType === "card3" && <CardCategory3 taxonomy={{ ...item, count: displayCount }} />}
        {categoryCardType === "card4" && <CardCategory4 taxonomy={{ ...item, count: displayCount }} />}
        {categoryCardType === "card5" && <CardCategory5 taxonomy={{ ...item, count: displayCount }} />}
      </div>
    );
  };

  if (!numberOfItems) return null;

  return (
    <div className={`nc-SectionSliderCountries ${className}`}>
      <Heading desc={subHeading} isCenter={sliderStyle === "style2"}>
        {heading}
      </Heading>
      <MotionConfig
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 },
        }}
      >
        <div className={`relative flow-root`} {...handlers}>
          <div className={`flow-root overflow-hidden rounded-xl`}>
            <motion.ul
              initial={false}
              className="relative whitespace-nowrap -mx-2 xl:-mx-4"
            >
              <AnimatePresence initial={false} custom={direction}>
                {categories.map((item, indx) => (
                  <motion.li
                    className={`relative inline-block px-2 xl:px-4 ${itemClassName}`}
                    custom={direction}
                    initial={{
                      x: `${(currentIndex - 1) * -100}%`,
                    }}
                    animate={{
                      x: `${currentIndex * -100}%`,
                    }}
                    variants={variants(200, 1)}
                    key={indx}
                    style={{
                      width: `calc(1/${numberOfItems} * 100%)`,
                    }}
                  >
                    {renderCard(item)}
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>

          {currentIndex ? (
            <PrevBtn
              style={{ transform: "translate3d(0, 0, 0)" }}
              onClick={() => changeItemId(currentIndex - 1)}
              className="w-9 h-9 xl:w-12 xl:h-12 text-lg absolute -left-3 xl:-left-6 top-1/3 -translate-y-1/2 z-[1]"
            />
          ) : null}

          {categories.length > currentIndex + numberOfItems ? (
            <NextBtn
              style={{ transform: "translate3d(0, 0, 0)" }}
              onClick={() => changeItemId(currentIndex + 1)}
              className="w-9 h-9 xl:w-12 xl:h-12 text-lg absolute -right-3 xl:-right-6 top-1/3 -translate-y-1/2 z-[1]"
            />
          ) : null}
        </div>
      </MotionConfig>
    </div>
  );
};

export default SectionSliderCountries;