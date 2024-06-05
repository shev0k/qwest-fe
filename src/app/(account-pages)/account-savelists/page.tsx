"use client";
import React, { useEffect, useState } from 'react';
import { Tab } from "@headlessui/react";
import StayCard from "@/components/StayCard";
import ButtonSecondary from "@/shared/ButtonSecondary";
import { useAuth } from '@/contexts/authContext';
import { StayDataType } from "@/data/types";
import { useRouter } from 'next/navigation';

const AccountSavelists = () => {
  const { user, wishlist, fetchUserWishlist, isAuthenticated, loginUser } = useAuth();
  const [categories] = useState(["Stays"]);
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

  useEffect(() => {
    if (user) {
      fetchUserWishlist(user.id);
    }
  }, [user, fetchUserWishlist]);

  const renderSection1 = () => {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h2 className="text-3xl font-semibold">Save Lists</h2>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>

        {wishlist.length > 0 ? (
        <div>
          <Tab.Group>
            <Tab.List className="flex space-x-1 overflow-x-auto">
              {categories.map((item) => (
                <Tab key={item} as={React.Fragment}>
                  {({ selected }) => (
                    <button
                      className={`flex-shrink-0 block !leading-none font-medium px-5 py-2.5 text-sm sm:text-base sm:px-6 sm:py-3 capitalize rounded-full focus:outline-none ${
                        selected
                          ? "bg-primary-6000 hover:bg-primary-700 text-neutral-50"
                          : "text-neutral-500 dark:text-neutral-400 dark:hover:text-neutral-100 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      } `}
                    >
                      {item}
                    </button>
                  )}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel className="mt-8">
                <div className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {wishlist.map((stay: StayDataType) => (
                    <StayCard key={stay.id} data={stay} />
                  ))}
                </div>
                <div className="flex mt-11 justify-center items-center">
                  <ButtonSecondary>Show More</ButtonSecondary>
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>        ) : (
          <div className="mt-8 text-center text-neutral-500 dark:text-neutral-400">
            Stays will appear here once you save them
          </div>
        )}
      </div>
    );
  };

  return renderSection1();
};

export default AccountSavelists;
