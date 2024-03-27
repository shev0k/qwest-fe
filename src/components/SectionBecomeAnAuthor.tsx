import React, { FC } from "react";
import rightImgDemo from "@/images/BecomeAnAuthorImg.png";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Logo from "@/shared/Logo";
import Image from "next/image";

export interface SectionBecomeAnAuthorProps {
  className?: string;
  rightImg?: string;
}

const SectionBecomeAnAuthor: FC<SectionBecomeAnAuthorProps> = ({
  className = "",
  rightImg = rightImgDemo,
}) => {
  return (
  <div
    className={`nc-SectionBecomeAnAuthor relative flex flex-col lg:flex-row items-center  ${className}`}
    data-nc-id="SectionBecomeAnAuthor"
  >
    <div className="flex-shrink-0 mb-16 lg:mb-0 lg:mr-10 lg:w-2/5">
      <Logo className="w-20" />
      <h2 className="text-3xl font-semibold mt-6 sm:mt-11 sm:text-4xl">
        Why Choose Us?
      </h2>
      <span className="mt-6 block text-neutral-500 dark:text-neutral-400">
        Journey with us for an experience-filled trip. QWEST makes reserving accommodations, from resort villas to hotels and private residences, a quick, convenient, and straightforward process.
      </span>
      <ButtonPrimary className="mt-6 sm:mt-11">
        Join as an Author
      </ButtonPrimary>
    </div>
    <div className="flex-grow">
      <Image alt="" src={rightImg} />
    </div>
  </div>

  );
};

export default SectionBecomeAnAuthor;
