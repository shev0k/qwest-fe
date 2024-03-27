import React, { useState } from "react";
import Label from "@/components/Label";
import Input from "@/shared/Input";

const ExpirationDateInput = () => {
  const [value, setValue] = useState("");

  const handleInputChange = (e: { target: { value: string; }; }) => {
    const input = e.target.value.replace(/[^\d]/g, '');
    // Allow only digits and limit the length to 4 (2 for month and 2 for year)
    let formattedInput = input.slice(0, 4);

    // Insert '/' after MM (2 digits)
    if (formattedInput.length > 2) {
      formattedInput = formattedInput.slice(0, 2) + '/' + formattedInput.slice(2);
    }

    setValue(formattedInput);
  };

  return (
    <div className="flex-1 space-y-1">
      <Label>Expiration Date</Label>
      <Input 
        type="text" 
        value={value} 
        onChange={handleInputChange} 
        placeholder="MM/YY" 
        maxLength={5}
      />
    </div>
  );
};

export default ExpirationDateInput;
