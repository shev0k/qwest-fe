"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ListingFormProvider, useListingForm } from "@/contexts/ListingFormContext";
import CommonLayout from "../CommonLayout";
import PageAddListing1 from "./PageAddListing1";
import PageAddListing10 from "./PageAddListing10";
import PageAddListing2 from "./PageAddListing2";
import PageAddListing3 from "./PageAddListing3";
import PageAddListing4 from "./PageAddListing4";
import PageAddListing5 from "./PageAddListing5";
import PageAddListing6 from "./PageAddListing6";
import PageAddListing7 from "./PageAddListing7";
import PageAddListing8 from "./PageAddListing8";
import PageAddListing9 from "./PageAddListing9";
import { useAuth } from "@/contexts/authContext";

const ContentWithValidation = ({ params }: { params: { stepIndex: string } }) => {
  const { isFormValid } = useListingForm();  
  console.log("Form Valid in CommonLayout:", isFormValid); 

  const ContentComponent = (() => {
    switch (Number(params.stepIndex)) {
      case 1: return <PageAddListing1 />;
      case 2: return <PageAddListing2 />;
      case 3: return <PageAddListing3 />;
      case 4: return <PageAddListing4 />;
      case 5: return <PageAddListing5 />;
      case 6: return <PageAddListing6 />;
      case 7: return <PageAddListing7 />;
      case 8: return <PageAddListing8 />;
      case 9: return <PageAddListing9 />;
      case 10: return <PageAddListing10 />;
      default: return <PageAddListing1 />;
    }
  })();

  return (
    <CommonLayout params={params} isFormValid={isFormValid}>
      {ContentComponent}
    </CommonLayout>
  );
};

const Page = ({ params }: { params: { stepIndex: string } }) => {
  const router = useRouter();
  const { user, isAuthenticated, loginUser } = useAuth();

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
    if (user && user.role !== "FOUNDER" && user.role !== "HOST") {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  return (
    <ListingFormProvider>
      <ContentWithValidation params={params} />
    </ListingFormProvider>
  );
};

export default Page;
