"use client";
import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";

const PakistanPhoneInput = ({ value = "", onChange, className = "" }: { value?: string; onChange: (phone: string) => void; className?: string }) => {
  const [inputValue, setInputValue] = useState(value);
  const [isValid, setIsValid] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Validate Pakistan phone number format
  useEffect(() => {
    const pakistanRegex = /^(\+92|0)?3\d{9}$/;
    setIsValid(pakistanRegex.test(inputValue.replace(/\D/g, "")));
  }, [inputValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let phone = e.target.value;

    // Auto-format as user types
    if (phone.startsWith("+92")) {
      phone = `+92 ${phone.slice(3).replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3")}`;
    } else if (phone.startsWith("0")) {
      phone = `0${phone.slice(1).replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3")}`;
    } else {
      phone = phone.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
    }

    setInputValue(phone);
    onChange(phone.replace(/\s/g, ""));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow only numbers, backspace, delete, tab, arrows
    if (!/[0-9]|Backspace|Delete|Tab|ArrowLeft|ArrowRight/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
        {/* Country Code Badge (Fixed for Pakistan) */}
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-l-md border-r">
          <img src="https://flagcdn.com/w20/pk.png" alt="PK" className="w-5 h-3.5 object-cover" />
          <span className="text-sm font-medium">+92</span>
        </div>

        {/* Phone Input */}
        <input
          type="tel"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="300 1234567"
          className="flex-1 px-3 py-2 rounded-r-md outline-none text-sm"
          maxLength={14} // +92 300 123 4567
        />
      </div>

      {/* Validation Message */}
      {!isValid && inputValue && (
        <p className="mt-1 text-xs text-red-500">Please enter a valid Pakistan mobile number (e.g. 03001234567 or +923001234567)</p>
      )}
    </div>
  );
};

export default PakistanPhoneInput;
