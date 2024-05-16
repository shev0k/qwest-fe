import React from "react";

const DeleteButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div className="flow-root">
      <div className="flex text-neutral-700 dark:text-neutral-300 text-sm -mx-3 -my-1.5">
        <span className="py-1.5 px-4 flex rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
        onClick={onClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"/>
          </svg>
          <span className="hidden sm:block ml-2.5">Delete</span>
        </span>
      </div>
    </div>
  );
};

export default DeleteButton;
