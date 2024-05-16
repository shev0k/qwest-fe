"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import Label from "@/components/Label";
import Avatar from "@/shared/Avatar";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Textarea from "@/shared/Textarea";

const AccountPage = () => {
  const { user, updateUserDetails, updateUserAvatar } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    country: '',
    phoneNumber: '',
    description: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        country: user.country || '',
        phoneNumber: user.phoneNumber || '',
        description: user.description || '',
      });
      setAvatarPreview(null);
    }
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (/^image\/(jpeg|png|gif|jpg)$/.test(file.type)) {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
      } else {
        setAvatarFile(null);
        setAvatarPreview(null);
        setError('Please upload a valid image file (PNG, JPEG, JPG, GIF).');
      }
    } else {
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  const validateForm = () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
      setError('Phone number must be 10 digits.');
      return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!user || !user.token) {
      setError('User data is incomplete. Unable to update profile.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      if (Object.values(formData).some(value => value)) {
        await updateUserDetails({ ...user, ...formData });
      }

      if (avatarFile) {
        await updateUserAvatar(user.id, avatarFile, user.token);
      }

      alert('Profile updated successfully.');
    } catch (error) {
      console.error("Update error:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <h2 className="text-3xl font-semibold">Account Information</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      <form className="flex flex-col md:flex-row" onSubmit={handleSubmit}>
        <div className="flex-shrink-0 flex items-start">
          <div className="relative rounded-full overflow-hidden flex">
            <Avatar sizeClass="w-32 h-32" imgUrl={avatarPreview || user?.avatar} />
            <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-neutral-50 cursor-pointer">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17.5 5H7.5C6.83696 5 6.20107 5.26339 5.73223 5.73223C5.26339 6.20107 5 6.83696 5 7.5V20M5 20V22.5C5 23.163 5.26339 23.7989 5.73223 24.2678C6.20107 24.7366 6.83696 25 7.5 25H22.5C23.163 25 23.7989 24.7366 24.2678 24.2678C24.7366 23.7989 25 23.163 25 22.5V17.5M5 20L10.7325 14.2675C11.2013 13.7988 11.8371 13.5355 12.5 13.5355C13.1629 13.5355 13.7987 13.7988 14.2675 14.2675L17.5 17.5M25 12.5V17.5M25 17.5L23.0175 15.5175C22.5487 15.0488 21.9129 14.7855 21.25 14.7855C20.5871 14.7855 19.9513 15.0488 19.4825 15.5175L17.5 17.5M17.5 17.5L20 20M22.5 5H27.5M25 2.5V7.5M17.5 10H17.5125"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="mt-1 text-xs">Change Image</span>
            </div>
            <input
              id="avatar-upload"
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/gif, image/jpg"
            />
          </div>
        </div>
        <div className="flex-grow mt-10 md:mt-0 md:pl-16 max-w-3xl space-y-6">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" name="firstName" className="mt-1.5" value={formData.firstName} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" name="lastName" className="mt-1.5" value={formData.lastName} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" className="mt-1.5" value={formData.username} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" className="mt-1.5" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" className="mt-1.5" value={formData.country} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone number</Label>
            <Input id="phoneNumber" name="phoneNumber" className="mt-1.5" value={formData.phoneNumber} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="description">About you</Label>
            <Textarea id="description" name="description" className="mt-1.5" value={formData.description} onChange={handleChange} />
          </div>
          {error && <div className="text-red-500 mt-4">{error}</div>}
          <div className="pt-2">
            <ButtonPrimary>Save Changes</ButtonPrimary>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AccountPage;
