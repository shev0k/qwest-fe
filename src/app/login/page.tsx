'use client';

import React, { useState, FC, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { login } from "@/api/authService";
import { useAuth } from '@/contexts/authContext';

import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Modal from "@/components/Modal";  // Adjust the import path as needed

export interface PageLoginProps {}

const PageLogin: FC<PageLoginProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modal, setModal] = useState({
    isOpen: false,
    type: "message" as "message" | "confirm",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });
  const { loginUser, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await login({ email, password });
      if (response.jwt) {
        loginUser({
          ...response,
          username: response.username || email.split('@')[0],
          avatar: response.avatar || "",
          country: response.country || "",
          wishlistIds: response.wishlistIds || [],
          token: response.jwt
        });
        router.push('/');
      } else {
        setModal({
          isOpen: true,
          type: "message",
          message: "Authentication token not received.",
          onConfirm: () => setModal({ ...modal, isOpen: false }),
          onCancel: () => setModal({ ...modal, isOpen: false }),
        });
      }
    } catch (error: any) {
      let errMsg = "Login failed due to an unexpected issue.";
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
    <div className={`nc-PageLogin`}>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Log In
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
          <form className="grid grid-cols-1 gap-6" onSubmit={handleLogin}>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Email Address
              </span>
              <Input
                type="email"
                placeholder="johndoe@example.com"
                className="mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Password
                <Link href="/forgot" className="text-sm underline font-medium">
                  Forgot Password?
                </Link>
              </span>
              <Input
                type="password"
                placeholder="********"
                className="mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <ButtonPrimary type="submit">Continue</ButtonPrimary>
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
            New User? {` `}
            <Link href="/signup" className="font-semibold underline">
              Create an Account
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
