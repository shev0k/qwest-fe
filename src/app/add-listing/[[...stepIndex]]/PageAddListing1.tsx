"use client"
import React, { FC, useState, useEffect } from "react";
import { debounce } from 'lodash';
import Input from "@/shared/Input";
import Select from "@/shared/Select";
import FormItem from "../FormItem";
import Modal from "@/components/Modal"; // Adjust the import path as needed
import { useListingForm } from '@/contexts/ListingFormContext';

export interface PageAddListing1Props {}

const PageAddListing1: FC<PageAddListing1Props> = () => {
    const { listingData, updateListingData, setFormValid } = useListingForm();
    const [propertyTypeDesc, setPropertyTypeDesc] = useState("");
    const [rentalFormDesc, setRentalFormDesc] = useState("");
    const [modal, setModal] = useState({
        isOpen: false,
        type: "message" as "message" | "confirm",
        message: "",
        onConfirm: () => setModal({ ...modal, isOpen: false }),
        onCancel: () => setModal({ ...modal, isOpen: false }),
    });

    useEffect(() => {
        const isValid = Boolean(listingData.title && listingData.title.trim() !== '') &&
                        Boolean(listingData.propertyType && listingData.propertyType.trim() !== '') &&
                        Boolean(listingData.rentalFormType && listingData.rentalFormType.trim() !== '');
        setFormValid(isValid);
        console.log("Form Validation State:", isValid);

        const logData = debounce(() => {
            console.log("Current Listing Data:", listingData);
        }, 500);
        logData();
        return () => logData.cancel();
    }, [listingData, setFormValid]);

    const propertyDescriptions: { [key: string]: string } = {
        APARTMENT: "A self-contained unit in a larger building, offering urban living spaces.",
        HOTEL: "Professional hospitality businesses with a unique style or theme.",
        CONDO: "A private residence within a larger complex, owned individually.",
        CABIN: "A small, rustic dwelling in a natural setting, perfect for getaways.",
        TOWNHOUSE: "A multi-floor home that shares one or more walls with adjacent properties.",
        PENTHOUSE: "A luxury apartment on the top floor of a building, offering expansive views.",
        COTTAGE: "A charming and cozy residence, often found in rural or semi-rural locations.",
        BUNGALOW: "A single-story house, offering compact and efficient living space.",
        LOFT: "A large, adaptable open space, often converted for residential use."
    };

    const rentalFormDescriptions: { [key: string]: string } = {
        ENTIRE_PLACE: "Guests have the whole place to themselves—there's a private entrance and no shared spaces. A bedroom, bathroom, and kitchen are usually included.",
        PRIVATE_ROOM: "Guests have a private room for sleeping. Other areas could be shared.",
        HOTEL_ROOM: "Enjoy the comfort and amenities of a professional hospitality setting, with either private or shared rooms.",
        SHARED_ROOM: "Share a room or common space with other guests, offering a more communal and budget-friendly option."
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (!value) {
            setModal({
                isOpen: true,
                type: "message",
                message: "The stay's name cannot be left blank.",
                onConfirm: () => setModal({ ...modal, isOpen: false }),
                onCancel: () => setModal({ ...modal, isOpen: false }),
            });
        }
        updateListingData({ [name]: value });
    };

    const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>, setError: React.Dispatch<React.SetStateAction<string>>, dataMap: { [key: string]: string }) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        if (!value) {
            setModal({
                isOpen: true,
                type: "message",
                message: "Please select an option.",
                onConfirm: () => setModal({ ...modal, isOpen: false }),
                onCancel: () => setModal({ ...modal, isOpen: false }),
            });
            setter("");
        } else {
            setModal({ ...modal, isOpen: false });
            setter(dataMap[value] || "");
        }
        updateListingData({ [e.target.name]: value });
    };

    const handlePropertyTypeChange = handleChange(setPropertyTypeDesc, () => {}, propertyDescriptions);
    const handleRentalFormChange = handleChange(setRentalFormDesc, () => {}, rentalFormDescriptions);

    return (
        <>
            <h2 className="text-2xl font-semibold">Type of Stay</h2>
            <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
            <div className="space-y-8">
                <FormItem
                    label="Property Type"
                    desc={propertyTypeDesc || "Select the type of property to list."}
                >
                    <Select name="propertyType" value={listingData.propertyType || ''} onChange={handlePropertyTypeChange}>
                        <option value="">Select Property Type</option>
                        <option value="APARTMENT">Apartment</option>
                        <option value="HOTEL">Hotel</option>
                        <option value="CONDO">Condo</option>
                        <option value="CABIN">Cabin</option>
                        <option value="TOWNHOUSE">Townhouse</option>
                        <option value="PENTHOUSE">Penthouse</option>
                        <option value="COTTAGE">Cottage</option>
                        <option value="BUNGALOW">Bungalow</option>
                        <option value="LOFT">Loft</option>
                    </Select>
                </FormItem>
                <FormItem
                    label="Stay's Name"
                    desc="Ex. craft a memorable name by combining: Property Type + Unique Feature + Location."
                >
                    <Input name="title" value={listingData.title || ''} placeholder="Stay's Name..." onChange={handleInputChange} />
                </FormItem>
                <FormItem
                    label="Rental Form"
                    desc={rentalFormDesc || "Choose the rental form that best describes your offering."}
                >
                    <Select name="rentalFormType" value={listingData.rentalFormType || ''} onChange={handleRentalFormChange}>
                        <option value="">Select Rental Form</option>
                        <option value="ENTIRE_PLACE">Entire Place</option>
                        <option value="PRIVATE_ROOM">Private Room</option>
                        <option value="HOTEL_ROOM">Hotel Room</option>
                        <option value="SHARED_ROOM">Shared Room</option>
                    </Select>
                </FormItem>
            </div>
            {/* Modal for messages */}
            <Modal
                type={modal.type}
                message={modal.message}
                isOpen={modal.isOpen}
                onClose={modal.onConfirm}
                onConfirm={modal.onConfirm}
                onCancel={modal.onCancel}
            />
        </>
    );
};

export default PageAddListing1;
