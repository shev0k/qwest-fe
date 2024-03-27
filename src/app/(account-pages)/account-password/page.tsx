import React from "react";
import Label from "@/components/Label";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Input from "@/shared/Input";

const AccountPass = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* HEADING */}
      <h2 className="text-3xl font-semibold">Update Your Password</h2>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      <div className=" max-w-xl space-y-6">
        <div>
          <Label>Current Password</Label>
          <Input type="password" className="mt-1.5" />
        </div>
        <div>
          <Label>New Password</Label>
          <Input type="password" className="mt-1.5" />
        </div>
        <div>
          <Label>Confirm Password</Label>
          <Input type="password" className="mt-1.5" />
        </div>
        <div className="pt-2">
          <ButtonPrimary>Update Password</ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

export default AccountPass;
