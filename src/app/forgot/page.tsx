'use client';

import React, { useState, FC } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { resetPassword } from "@/api/authService";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Modal from "@/components/Modal";  // Adjust the import path as needed

export interface PageForgotProps {}

const PageForgot: FC<PageForgotProps> = () => {
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [modal, setModal] = useState({
    isOpen: false,
    type: "message" as "message" | "confirm",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.newPassword.length < 4) {
      setModal({
        isOpen: true,
        type: "message",
        message: "Password must be at least 4 characters long.",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
        onCancel: () => setModal({ ...modal, isOpen: false }),
      });
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setModal({
        isOpen: true,
        type: "message",
        message: "Passwords do not match.",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
        onCancel: () => setModal({ ...modal, isOpen: false }),
      });
      return;
    }

    try {
      await resetPassword({
        email: formData.email,
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmNewPassword
      });
      router.push('/login');
    } catch (error: any) {
      let errMsg = "An unexpected error occurred during password reset. Please try again.";
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errMsg = "Invalid credentials or user does not exist.";
            break;
          case 403:
            errMsg = "You are not authorized to perform this action.";
            break;
          case 500:
            errMsg = "Server error. The entity you are trying to access may not exist.";
            break;
        }
      }

      setModal({
        isOpen: true,
        type: "message",
        message: errMsg,
        onConfirm: () => setModal({ ...modal, isOpen: false }),
        onCancel: () => setModal({ ...modal, isOpen: false }),
      });
    }
  };

  return (
    <div className={`nc-PageForgot`}>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Reset Password
        </h2>
        <div className="max-w-md mx-auto space-y-6">
          {/* OR */}
          <div className="relative text-center">
            <span className="relative z-10 inline-block px-4 font-medium text-sm bg-white dark:text-neutral-400 dark:bg-neutral-900">
              FILL IN DETAILS
            </span>
            <div className="absolute left-0 w-full top-1/2 transform -translate-y-1/2 border border-neutral-100 dark:border-neutral-800"></div>
          </div>
          {/* FORM */}
          <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email Address
              </span>
              <Input
                name="email"
                type="email"
                placeholder="johndoe@example.com"
                className="mt-1"
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                New Password
              </span>
              <Input
                name="newPassword"
                type="password"
                placeholder="********"
                className="mt-1"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Confirm New Password
              </span>
              <Input
                name="confirmNewPassword"
                type="password"
                placeholder="********"
                className="mt-1"
                value={formData.confirmNewPassword}
                onChange={handleChange}
              />
            </label>
            <ButtonPrimary type="submit">Reset Password</ButtonPrimary>
          </form>
          {/* Modal for error messages */}
          <Modal
            type={modal.type}
            message={modal.message}
            isOpen={modal.isOpen}
            onClose={modal.onConfirm}
            onConfirm={modal.onConfirm}
            onCancel={modal.onCancel}
          />
          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Remembered your password? {` `}
            <Link href="/login" className="font-semibold underline">
              Sign In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageForgot;
