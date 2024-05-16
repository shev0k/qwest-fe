import React from "react";

const EditButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div className="flow-root">
      <div className="flex text-neutral-700 dark:text-neutral-300 text-sm -mx-3 -my-1.5">
        <span className="py-1.5 px-5 flex rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
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
              d="M15.232 5.232a1 1 0 011.415 0l2.121 2.121a1 1 0 010 1.415l-10 10a1 1 0 01-.508.273l-4 1a1 1 0 01-1.213-1.213l1-4a1 1 0 01.273-.508l10-10zM16 7L7 16m5 1h4a1 1 0 011 1v4m-5-5v5m-1-1a1 1 0 011-1h4"
              />
          </svg>
          <span className="hidden sm:block ml-2.5">Edit</span>
        </span>
      </div>
    </div>
  );
};

export default EditButton;
