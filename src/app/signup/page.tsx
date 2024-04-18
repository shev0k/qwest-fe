'use client'
import React, { useState, FC } from "react";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { signUp } from "@/api/authService";
import { useAuth } from '@/contexts/authContext';

export interface PageSignUpProps {}

const PageSignUp: FC<PageSignUpProps> = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
    location: ""
  });
  const [error, setError] = useState("");
  const { loginUser } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    try {
      const response = await signUp({
        email: formData.email,
        password: formData.password,
      });
      console.log('User created:', response);
      if (response.jwt) {
        loginUser({
          displayName: formData.displayName || response.displayName || 'No Name',
          avatar: response.avatar || "",
          location: response.location || "Unknown",
          email: response.email,
          token: response.jwt  // Assuming the JWT is attached to the response
        });
        // Optionally, store the JWT in local storage or appropriate place
        localStorage.setItem('jwt', response.jwt);
        router.push('/');
      } else {
        setError("Failed to login after signup.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred during sign up.");
      }
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
