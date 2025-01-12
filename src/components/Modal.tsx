"use client";

import React, { FC, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import ButtonPrimary from "@/shared/ButtonPrimary";
import ButtonFifth from "@/shared/ButtonFifth";

interface ModalProps {
  type: "confirm" | "message";
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: FC<ModalProps> = ({ type, message, onConfirm, onCancel, isOpen, onClose }) => {
  const renderConfirmButtons = () => (
    <div className="mt-4 flex justify-end space-x-4">
      <ButtonFifth onClick={onCancel || onClose}>Cancel</ButtonFifth>
      <ButtonPrimary onClick={onConfirm}>Confirm</ButtonPrimary>
    </div>
  );

  const renderMessageButton = () => (
    <div className="mt-4 flex justify-end">
      <ButtonPrimary onClick={onClose}>OK</ButtonPrimary>
    </div>
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto modal" onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-neutral-800 shadow-xl rounded-2xl">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                {type === "confirm" ? "Confirm Action" : "Message"}
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-300">{message}</p>
              </div>

              {type === "confirm" ? renderConfirmButtons() : renderMessageButton()}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
