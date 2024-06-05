"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/authContext";
import Label from "@/components/Label";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";
import Modal from "@/components/Modal"; // Adjust the import path as needed
import { useRouter } from 'next/navigation';

interface PasswordData {
  password: string;
}

const AccountPass = () => {
  const { user, updateUserDetails, loginUser, isAuthenticated } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modal, setModal] = useState({
    isOpen: false,
    type: "message" as "message" | "confirm",
    message: "",
    onConfirm: () => setModal({ ...modal, isOpen: false }),
    onCancel: () => setModal({ ...modal, isOpen: false }),
  });
  const router = useRouter();

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('token');

    if (storedUserData && storedToken) {
      const userData = JSON.parse(storedUserData);
      loginUser(userData);
    } else {
      router.push('/login');
    }
  }, [router]);

  const validatePassword = () => {
    if (newPassword.length < 4) {
      setModal({
        isOpen: true,
        type: "message",
        message: "Password must be at least 4 characters long.",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
        onCancel: () => setModal({ ...modal, isOpen: false }),
      });
      return false;
    }
    if (newPassword !== confirmPassword) {
      setModal({
        isOpen: true,
        type: "message",
        message: "Passwords do not match.",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
        onCancel: () => setModal({ ...modal, isOpen: false }),
      });
      return false;
    }
    return true;
  };

  const handlePasswordUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      setModal({
        isOpen: true,
        type: "message",
        message: "No user data available.",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
        onCancel: () => setModal({ ...modal, isOpen: false }),
      });
      return;
    }

    if (!validatePassword()) {
      return;
    }

    const passwordData: PasswordData = {
      password: newPassword,
    };

    try {
      await updateUserDetails({ ...user, ...passwordData });
      setModal({
        isOpen: true,
        type: "message",
        message: "Password updated successfully.",
        onConfirm: () => {
          setModal({ ...modal, isOpen: false });
          setNewPassword('');
          setConfirmPassword('');
        },
        onCancel: () => setModal({ ...modal, isOpen: false }),
      });
    } catch (error: any) {
      setModal({
        isOpen: true,
        type: "message",
        message: error.message || "Failed to update password. Please try again.",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
        onCancel: () => setModal({ ...modal, isOpen: false }),
      });
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
        <div className="pt-2">
          <ButtonPrimary type="submit">Update Password</ButtonPrimary>
        </div>
      </form>
      {/* Modal for messages */}
      <Modal
        type={modal.type}
        message={modal.message}
        isOpen={modal.isOpen}
        onClose={modal.onConfirm}
        onConfirm={modal.onConfirm}
        onCancel={modal.onCancel}
      />
    </div>
  );
};

export default AccountPass;
