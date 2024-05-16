"use client";
import React, { FC, useState, useEffect } from "react";
import { useListingForm } from '@/contexts/ListingFormContext';
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import FormItem from "../FormItem";

export interface PageAddListing8Props {}

const PageAddListing8: FC<PageAddListing8Props> = () => {
  const { listingData, updateListingData, setFormValid } = useListingForm();
  const [currency, setCurrency] = useState<'USD' | 'EUR'>('USD');
  const [rates, setRates] = useState({ USD: 1, EUR: 0.88 }); // Example rates

  useEffect(() => {
    const isValid = 
      (listingData.weekdayPrice || 0) > 0 && 
      (listingData.weekendPrice || 0) > 0 && 
      (listingData.longTermStayDiscount || 0) >= 0;
    setFormValid(isValid);
  }, [listingData, setFormValid]);

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = event.target.value as 'USD' | 'EUR';
    if (newCurrency !== currency) {
      const conversionFactor = newCurrency === 'USD' ? 1 / rates.EUR : rates.EUR;
      updateListingData({
        weekdayPrice: parseFloat(((listingData.weekdayPrice || 0) * conversionFactor).toFixed(2)),
        weekendPrice: parseFloat(((listingData.weekendPrice || 0) * conversionFactor).toFixed(2)),
        longTermStayDiscount: parseFloat(((listingData.longTermStayDiscount || 0) * conversionFactor).toFixed(2))
      });
    }
    setCurrency(newCurrency);
  };

  const handlePriceChange = (name: keyof typeof listingData, value: string) => {
    const numValue = parseFloat(value);
    updateListingData({ [name]: isNaN(numValue) ? 0 : parseFloat(numValue.toFixed(2)) });
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold">Setting Your Rates</h2>
        <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
          Your earnings as a host are influenced by how you price your listing.
        </span>
      </div>
      <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
      <div className="space-y-8">
        <FormItem label="Currency">
          <Select value={currency} onChange={handleCurrencyChange}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </Select>
        </FormItem>
        <FormItem label="Base price (Monday - Thursday)">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{currency === 'USD' ? '$' : '€'}</span>
            </div>
            <Input 
              className="!pl-8 !pr-10" 
              value={(listingData.weekdayPrice || 0).toFixed(2)} 
              placeholder="0.00"
              onChange={(e) => handlePriceChange('weekdayPrice', e.target.value)} 
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{currency}</span>
            </div>
          </div>
        </FormItem>
        <FormItem label="Base price (Friday - Sunday)">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{currency === 'USD' ? '$' : '€'}</span>
            </div>
            <Input 
              className="!pl-8 !pr-10" 
              value={(listingData.weekendPrice || 0).toFixed(2)} 
              placeholder="0.00"
              onChange={(e) => handlePriceChange('weekendPrice', e.target.value)} 
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">{currency}</span>
            </div>
          </div>
        </FormItem>
        <FormItem label="Long term price (Monthly discount)">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">%</span>
            </div>
            <Input 
              className="!pl-8 !pr-10" 
              value={(listingData.longTermStayDiscount || 0).toFixed(2)} 
              placeholder="0.00"
              onChange={(e) => handlePriceChange('longTermStayDiscount', e.target.value)} 
            />
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
