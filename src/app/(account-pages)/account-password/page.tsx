"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/authContext";
import Label from "@/components/Label";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";

interface PasswordData {
  password: string;
}

const AccountPass = () => {
  const { user, updateUserDetails } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validatePassword = () => {
    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters long.');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handlePasswordUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      setError('No user data available.');
      return;
    }
    
    if (!validatePassword()) {
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const passwordData: PasswordData = {
      password: newPassword,
    };

    try {
      await updateUserDetails({ ...user, ...passwordData });
      alert('Password updated successfully.');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
    } catch (error: any) {
      setError(error.message || "Failed to update password. Please try again.");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <h2 className="text-3xl font-semibold">Update Your Password</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      <form onSubmit={handlePasswordUpdate} className="max-w-xl space-y-6">
        <div>
          <Label>New Password</Label>
          <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1.5" />
        </div>
        <div>
          <Label>Confirm Password</Label>
          <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1.5" />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="pt-2">
          <ButtonPrimary type="submit">Update Password</ButtonPrimary>
        </div>
      </form>
    </div>
  );
};

export default AccountPass;
