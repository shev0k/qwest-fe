import React, { FC } from "react";
import SocialsList from "@/shared/SocialsList";
import BackgroundSection from "@/components/BackgroundSection";
import SectionClientSay from "@/components/SectionClientSay";

export interface PageContactProps {}

const info = [
  {
    title: "🗺 ADDRESS",
    desc: "Thomas a Kempislan 10",
  },
  {
    title: "💌 EMAIL",
    desc: "qwest@travel.com",
  },
  {
    title: "☎ PHONE",
    desc: "+31649825593",
  },
  {
    title: "🌏 SOCIALS",
    desc: <SocialsList className="mt-2" />,
  },
];

const PageContact: FC<PageContactProps> = ({}) => {
  return (
    <div className={`nc-PageContact overflow-hidden`}>
      <div className="mb-24 lg:mb-32">
        <h2 className="ml-[-70px] my-16 sm:my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Contact
        </h2>
        <div className="container mx-auto px-4 flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12">
            {info.map((item, index) => (
              <div key={index} className="space-y-8">
                <h3 className="uppercase font-semibold text-sm dark:text-neutral-200 tracking-wider">
                  {item.title}
                </h3>
                <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative py-16">
        <BackgroundSection />
        <SectionClientSay />
      </div>

      <div className="relative py-16" />
    </div>
  );
};

export default PageContact;
