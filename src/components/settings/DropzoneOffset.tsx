// components/DropzoneOffset.tsx

import { Input } from "@/components/ui/input"; // Adjust the import path based on your project structure
import { Label } from "@/components/ui/label";
import { clamp } from "@/utils"; // Ensure you have a clamp utility or define it below
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import React, { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp, FaMountain } from "react-icons/fa";

interface DropzoneOffsetProps {
  dropzoneOffset: number;
  onChange: (newOffset: number) => void;
}

const MIN_OFFSET = -99999;
const MAX_OFFSET = 99999;

const DropzoneOffset: React.FC<DropzoneOffsetProps> = ({
  dropzoneOffset,
  onChange,
}) => {
  const [focus, setFocus] = useState(false);
  const [localOffset, setLocalOffset] = useState<number>(dropzoneOffset);

  // Sync local state when props change
  useEffect(() => {
    setLocalOffset(dropzoneOffset);
  }, [dropzoneOffset]);

  // Handle changes in the numeric input
  const handleOffsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const num = parseInt(value, 10);

    if (!isNaN(num)) {
      setLocalOffset(num);
    } else if (value === "" || value === "-") {
      // Allow empty string or just a minus sign temporarily
      // However, since localOffset is a number, we'll set it to 0
      setLocalOffset(0);
    }
  };

  // Handle blur event to validate and propagate changes
  const handleOffsetBlur = () => {
    let num = localOffset;
    // Clamp the value between MIN_OFFSET and MAX_OFFSET
    num = clamp(num, MIN_OFFSET, MAX_OFFSET);
    onChange(num);
    setLocalOffset(num);
  };

  const dropzoneOffsetIsPositive = dropzoneOffset >= 0;

  // Set offset to positive clamped value
  const setPositive = () => {
    const clampedValue = clamp(Math.abs(dropzoneOffset), 0, MAX_OFFSET);
    onChange(clampedValue);
    setLocalOffset(clampedValue);
  };

  // Set offset to negative clamped value
  const setNegative = () => {
    const clampedValue = clamp(-Math.abs(dropzoneOffset), MIN_OFFSET, 0);
    onChange(clampedValue);
    setLocalOffset(clampedValue);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger>
            <div className="flex text-start cursor-pointer">
              <FaMountain size={15} className="mr-2" title="Abbreviate Readings" />
              <Label className="cursor-pointer">Dropzone Offset</Label>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-black text-white rounded-2xl w-64">
            <p>
              Indicate how much higher or lower your landing area from your
              takeoff altitude is.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex">
        {/* Input and Unit Wrapper */}
        <div
          className={`flex items-center space-x-2 shadow-sm border border-input rounded-md pr-2 ${
            focus ? "ring-1 ring-ring ring-offset-background" : ""
          }`}
        >
          <Input
            type="number"
            value={localOffset}
            onChange={handleOffsetChange}
            onFocus={() => setFocus(true)}
            onBlur={() => {
              handleOffsetBlur();
              setFocus(false);
            }}
            min={-MAX_OFFSET}
            max={MAX_OFFSET}
            className="w-18 focus-visible:ring-0 border-none shadow-none pr-0"
            placeholder="0"
            aria-label="LZ Offset in feet"
          />
          <div className="flex items-center">
            <p className="text-sm">feet</p>
          </div>
        </div>
        {/* Arrow Buttons */}
        <button
          type="button"
          onClick={setPositive}
          className={`p-2 ml-2 rounded ${
            dropzoneOffsetIsPositive
              ? "bg-black text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          aria-label="Set Higher"
        >
          <FaArrowUp size={10} />
        </button>
        <button
          type="button"
          onClick={setNegative}
          className={`p-2 ml-1 rounded ${
            !dropzoneOffsetIsPositive
              ? "bg-black text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          aria-label="Set Lower"
        >
          <FaArrowDown size={10} />
        </button>
      </div>
    </div>
  );
};

export default DropzoneOffset;
