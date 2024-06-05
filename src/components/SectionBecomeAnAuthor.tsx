"use client";
import React, { useState } from 'react';
import ButtonPrimary from '@/shared/ButtonPrimary';
import Logo from '@/shared/Logo';
import Image from 'next/image';
import { useAuth } from '@/contexts/authContext';
import { requestHostRole } from '@/api/author';
import rightImgDemo from '@/images/BecomeAnAuthorImg.png';
import Modal from '@/components/Modal';
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

  const [modal, setModal] = useState({
    isOpen: false,
    type: "message" as "message" | "confirm",
    message: "",
    onConfirm: () => setModal({ ...modal, isOpen: false }),
    onCancel: () => setModal({ ...modal, isOpen: false }),
  });

  const handleRequestHost = async () => {
    if (!isAuthenticated || !user) {
      setModal({
        isOpen: true,
        type: "message",
        message: "You need to be logged in to request becoming a host.",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
        onCancel: () => setModal({ ...modal, isOpen: false }),
      });
      return;
    }

    if (user.role !== 'TRAVELER') {
      setModal({
        isOpen: true,
        type: "message",
        message: "Only users with the role TRAVELER can request to become a host.",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
        onCancel: () => setModal({ ...modal, isOpen: false }),
      });
      return;
    }

    setModal({
      isOpen: true,
      type: "confirm",
      message: "Are you sure you want to become a host? Your application will be processed by the administration.",
      onConfirm: async () => {
        try {
          await requestHostRole(user.id);
          setUser({ ...user, role: 'PENDING_HOST' });
          setModal({
            isOpen: true,
            type: "message",
            message: "Your request to become a host has been submitted.",
            onConfirm: () => setModal({ ...modal, isOpen: false }),
            onCancel: () => setModal({ ...modal, isOpen: false }),
          });
        } catch (error) {
          console.error('Failed to request host role:', error);
          setModal({
            isOpen: true,
            type: "message",
            message: "Failed to submit your request. Please try again later.",
            onConfirm: () => setModal({ ...modal, isOpen: false }),
            onCancel: () => setModal({ ...modal, isOpen: false }),
          });
        }
      },
      onCancel: () => setModal({ ...modal, isOpen: false }),
    });
  };

  return (
    <>
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
            <ButtonPrimary
              className="mt-6 sm:mt-11"
              onClick={() =>
                setModal({
                  isOpen: true,
                  type: "message",
                  message: "You need to be logged in to request becoming a host.",
                  onConfirm: () => setModal({ ...modal, isOpen: false }),
                  onCancel: () => setModal({ ...modal, isOpen: false }),
                })
              }
            >
              Join as a Host
            </ButtonPrimary>
          )}
        </div>
        <div className="flex-grow">
          <Image alt="" src={rightImg} />
        </div>
      </div>
      <Modal
        type={modal.type}
        message={modal.message}
        isOpen={modal.isOpen}
        onClose={modal.onCancel}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
      />
    </>
  );
};

export default SectionBecomeAnAuthor;
