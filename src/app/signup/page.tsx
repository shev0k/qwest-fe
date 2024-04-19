'use client'
import React, { useState, FC } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { signUp } from "@/api/authService";
import { useAuth } from '@/contexts/authContext';

import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";

export interface PageSignUpProps {}

const PageSignUp: FC<PageSignUpProps> = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    country: "" 
  });
  const [error, setError] = useState<string | null>(null);
  const { loginUser } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(null);  // Clear any previous errors

    try {
      const response = await signUp({
        email: formData.email,
        password: formData.password,
      });
      loginUser({
        ...response,
        username: response.username || formData.email.split('@')[0],
        avatar: response.avatar || "",
        country: response.country || "",
        token: response.jwt
      });
      router.push('/');  // Redirect to home or dashboard
    } catch (error) {
      setError("An unexpected error occurred during sign up. Please try again.");
    }
  };
  
  return (
    <div className={`nc-PageSignUp  `}>
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-neutral-900 dark:text-neutral-100 justify-center">
          Sign Up
        </h2>
        <div className="max-w-md mx-auto space-y-6 ">
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
                Password
              </span>
              <Input
                name="password"
                type="password"
                placeholder="********"
                className="mt-1"
                value={formData.password}
                onChange={handleChange}
              />
            </label>
            <label className="block">
              <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                Confirm Password
              </span>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="********"
                className="mt-1"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </label>
            <ButtonPrimary type="submit">Continue</ButtonPrimary>
          </form>
          {error && <div className="text-red-500 text-center mt-4">{error}</div>}
          {/* ==== */}
          <span className="block text-center text-neutral-700 dark:text-neutral-300">
            Already Have an Account? {` `}
            <Link href="/login" className="font-semibold underline">
              Sign In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageSignUp;
