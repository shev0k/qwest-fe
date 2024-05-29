"use client";
import React from 'react';
import ButtonPrimary from '@/shared/ButtonPrimary';
import Logo from '@/shared/Logo';
import Image from 'next/image';
import { useAuth } from '@/contexts/authContext';
import { requestHostRole } from '@/api/author';
import rightImgDemo from '@/images/BecomeAnAuthorImg.png';
import "../app/globals.css"; // Your custom styles

export interface SectionBecomeAnAuthorProps {
  className?: string;
  rightImg?: string;
}

const SectionBecomeAnAuthor: React.FC<SectionBecomeAnAuthorProps> = ({
  className = '',
  rightImg = rightImgDemo,
}) => {
  const { user, isAuthenticated, setUser } = useAuth();

  const handleRequestHost = async () => {
    if (!isAuthenticated || !user) {
      alert('You need to be logged in to request becoming a host.');
      return;
    }

    if (user.role !== 'TRAVELER') {
      alert('Only users with the role TRAVELER can request to become a host.');
      return;
    }

    try {
      const confirmation = window.confirm('Are you sure you want to become a host? Your application will be processed by the administration.');
      if (confirmation) {
        await requestHostRole(user.id);
        setUser({ ...user, role: 'PENDING_HOST' }); // Update the user role locally
        alert('Your request to become a host has been submitted.');
      }
    } catch (error) {
      console.error('Failed to request host role:', error);
      alert('Failed to submit your request. Please try again later.');
    }
  };

  return (
    <div
      className={`nc-SectionBecomeAnAuthor relative flex flex-col lg:flex-row items-center ${className}`}
      data-nc-id="SectionBecomeAnAuthor"
    >
      <div className="flex-shrink-0 mb-16 lg:mb-0 lg:mr-10 lg:w-2/5">
        <Logo className="w-20" />
        <h2 className="text-3xl font-semibold mt-6 sm:mt-11 sm:text-4xl">Why Choose Us?</h2>
        <span className="mt-6 block text-neutral-500 dark:text-neutral-400">
          Journey with us for an experience-filled trip. QWEST makes reserving accommodations, from resort villas to hotels and private residences, a quick, convenient, and straightforward process.
        </span>
        {isAuthenticated && user ? (
          user.role === 'TRAVELER' ? (
            <ButtonPrimary className="mt-6 sm:mt-11" onClick={handleRequestHost}>
              Join as a Host
            </ButtonPrimary>
          ) : user.role === 'PENDING_HOST' ? (
            <p className="mt-6 sm:mt-11 text-yellow-500">
              Your request to become a host is pending approval.
            </p>
          ) : (
            <p className="mt-6 sm:mt-11 text-yellow-500">
              Thank you for becoming a host!
            </p>
          )
        ) : (
          <ButtonPrimary className="mt-6 sm:mt-11" onClick={() => alert('You need to be logged in to request becoming a host.')}>
            Join as a Host
          </ButtonPrimary>
        )}
      </div>
      <div className="flex-grow">
        <Image alt="" src={rightImg} />
      </div>
    </div>
  );
};

export default SectionBecomeAnAuthor;
