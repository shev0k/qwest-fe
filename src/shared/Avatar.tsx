import React, { FC } from "react";
import Image, { StaticImageData } from "next/image";

export interface AvatarProps {
  containerClassName?: string;
  sizeClass?: string;
  radius?: string;
  imgUrl?: string | StaticImageData;
  email?: string;
  username?: string;
  hasChecked?: boolean;
  hasCheckedClass?: string;
  width?: number;
  height?: number;
}


const Avatar: FC<AvatarProps> = ({
  containerClassName = "ring-1 ring-white dark:ring-neutral-900",
  sizeClass = "h-6 w-6 text-sm",
  radius = "rounded-full",
  imgUrl,
  email,
  hasChecked,
  hasCheckedClass = "w-4 h-4 -top-0.5 -right-0.5",
  width = 100,
  height = 100,
}) => {
  const emailInitial = email ? email[0].toUpperCase() : 'U'; // Use the first letter of the email or 'U' as a fallback

  return (
    <div
      className={`wil-avatar relative flex-shrink-0 inline-flex items-center justify-center text-neutral-100 uppercase font-semibold shadow-inner ${radius} ${sizeClass} ${containerClassName}`}
      style={{ backgroundColor: imgUrl ? undefined : 'lightgray' }} // Use light gray if no image URL
    >
      {imgUrl ? (
        <Image
          className={`absolute inset-0 w-full h-full object-cover ${radius}`}
          src={imgUrl}
          alt={`Avatar of ${email || 'User'}`}
          width={width}
          height={height}
          layout="fixed"
        />
      ) : (
        // Display the first letter of the email if no image URL is provided
        <span className={`flex items-center justify-center ${radius} ${sizeClass} bg-neutral-300 text-neutral-900`}>
          {emailInitial}
        </span>
      )}

      {hasChecked && (
        <span
          className={`bg-primary-custom-2 rounded-full text-white text-xs flex items-center justify-center absolute ${hasCheckedClass}`}
        >
          <i className="las la-check"></i>
        </span>
      )}
    </div>
  );
};

export default Avatar;
