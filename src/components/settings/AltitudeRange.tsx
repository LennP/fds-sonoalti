// AltitudeRange.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { clamp } from "@/utils";
import React, { useEffect, useState } from "react";
import { FaMountain } from "react-icons/fa";

interface AltitudeRangeProps {
  fromValue: number;
  toValue: number;
  fromOnChange: (value: number) => void;
  toOnChange: (value: number) => void;
}

const MIN_ALTITUDE: number = 0;
const MAX_ALTITUDE: number = 30000;

const AltitudeRange: React.FC<AltitudeRangeProps> = ({
  fromValue,
  toValue,
  fromOnChange: onFromChange,
  toOnChange: onToChange,
}) => {
  const [focus, setFocus] = useState(false);

  // Local state for input fields
  const [localFrom, setLocalFrom] = useState<string>(fromValue.toString());
  const [localTo, setLocalTo] = useState<string>(toValue.toString());

  // Sync local state when props change
  useEffect(() => {
    setLocalFrom(fromValue.toString());
  }, [fromValue]);

  useEffect(() => {
    setLocalTo(toValue.toString());
  }, [toValue]);

  // Handle changes for "from" input
  const handleFromChange = (value: string) => {
    // Allow empty string for user convenience
    if (value === "") {
      setLocalFrom(value);
      return;
    }

    // Ensure the input is a valid number
    const num = Number(value);
    if (!isNaN(num)) {
      setLocalFrom(value);
    }
  };

  // Handle changes for "to" input
  const handleToChange = (value: string) => {
    if (value === "") {
      setLocalTo(value);
      return;
    }

    const num = Number(value);
    if (!isNaN(num)) {
      setLocalTo(value);
    }
  };

  // Handle blur for "from" input
  const handleFromBlur = () => {
    let num = Number(localFrom);
    if (isNaN(num)) {
      num = MIN_ALTITUDE;
    }

    // Clamp the value between MIN_ALTITUDE and toValue
    num = clamp(num, MIN_ALTITUDE, toValue);
    onFromChange(num);
  };

  // Handle blur for "to" input
  const handleToBlur = () => {
    let num = Number(localTo);
    if (isNaN(num)) {
      num = MAX_ALTITUDE;
    }

    // Clamp the value between fromValue and MAX_ALTITUDE
    num = clamp(num, fromValue, MAX_ALTITUDE);
    onToChange(num);
  };

  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <FaMountain size={15} className="mr-2" title="Altitude Range" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="cursor-pointer text-start">
                <Label>Altitude Range</Label>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-black text-white rounded-2xl">
              <p>
                Specify the altitude range in which announcements should be
                given.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div
        className={`flex items-center space-x-2 shadow-sm border border-input rounded-md pr-2 ${
          focus ? "ring-1 ring-ring ring-offset-background" : ""
        }`}
      >
        <Input
          type="number"
          value={localFrom}
          onChange={(e) => handleFromChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => {
            handleFromBlur();
            setFocus(false);
          }}
          min={MIN_ALTITUDE}
          max={MAX_ALTITUDE}
          className="w-[4.5rem] focus-visible:ring-0 border-none shadow-none pr-0"
          placeholder="From"
        />
        <span>-</span>
        <Input
          type="number"
          value={localTo}
          onChange={(e) => handleToChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => {
            handleToBlur();
            setFocus(false);
          }}
          min={MIN_ALTITUDE}
          max={MAX_ALTITUDE}
          className="w-[4.5rem] focus-visible:ring-0 border-none shadow-none pr-0"
          placeholder="To"
        />
        <p className="text-sm">feet</p>
      </div>
    </div>
  );
};

export default AltitudeRange;
