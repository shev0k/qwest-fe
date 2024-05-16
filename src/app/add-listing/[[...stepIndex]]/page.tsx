"use client";

import React from "react";
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

// ContentWithValidation component that uses the context
const ContentWithValidation = ({ params }: { params: { stepIndex: string } }) => {
  const { isFormValid } = useListingForm();  // Safe to use here as it's inside the provider
  console.log("Form Valid in CommonLayout:", isFormValid); // To ensure it's receiving the correct value

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

// Updated Page component that wraps everything in ListingFormProvider
const Page = ({ params }: { params: { stepIndex: string } }) => {
  const router = useRouter();
  const { user } = useAuth();

  if (!user || (user.role !== "FOUNDER" && user.role !== "HOST")) {
    // Redirect to index if not authenticated or not a FOUNDER or HOST
    router.push("/");
    return null;
  }

  return (
    <ListingFormProvider>
      <ContentWithValidation params={params} />
    </ListingFormProvider>
  );
};

export default Page;
