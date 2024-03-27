"use client";
import React, { FC, useState } from "react";
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import FormItem from "../FormItem";

export interface PageAddListing8Props {}

const PageAddListing8: FC<PageAddListing8Props> = () => {
  const [currency, setCurrency] = useState('USD');
  
  // Function to update the currency state based on selection
  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value);
  };

  // Determine currency symbol
  const currencySymbol = currency === 'USD' ? '$' : '€';
  const currencyText = currency === 'USD' ? 'USD' : 'EUR';

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">Setting Your Rates</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Your earnings as a host are influenced by how you price your listing, alongside rules regarding guest capacity, minimum stay duration, and your cancellation policy.
        </span>
      </div>

      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      {/* FORM */}
      <div className="space-y-8">
        {/* Currency Selector */}
        <FormItem label="Currency">
          <Select onChange={handleCurrencyChange}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </Select>
        </FormItem>
        {/* Base Price Monday-Thursday */}
        <FormItem label="Base price (Monday - Thursday)">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{currencySymbol}</span>
            </div>
            <Input className="!pl-8 !pr-10" placeholder="0.00" />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{currencyText}</span>
            </div>
          </div>
        </FormItem>
        {/* Base Price Friday-Sunday */}
        <FormItem label="Base price (Friday - Sunday)">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{currencySymbol}</span>
            </div>
            <Input className="!pl-8 !pr-10" placeholder="0.00" />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{currencyText}</span>
            </div>
          </div>
        </FormItem>
        {/* Long Term Price */}
        <FormItem label="Long term price (Monthly discount)">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">%</span>
            </div>
            <Input className="!pl-8 !pr-10" placeholder="0.00" />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">every month</span>
            </div>
          </div>
        </FormItem>
      </div>
    </>
  );
};

export default PageAddListing8;
