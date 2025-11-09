// FreefallThreshold.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { clamp } from "@/utils";
import { useEffect, useState } from "react";
import { GiFalling } from "react-icons/gi";

interface FreefallThresholdProps {
  freefallThreshold: number;
  onFreefallThresholdChange: (value: number) => void;
}

const MIN_FREEFALL_THRESHOLD: number = 0;
const MAX_FREEFALL_THRESHOLD: number = 999;

const FreefallThreshold = ({
  freefallThreshold,
  onFreefallThresholdChange,
}: FreefallThresholdProps) => {
  const [focus, setFocus] = useState(false);

  const [localThreshold, setLocalThreshold] = useState<string>(
    freefallThreshold.toString(),
  );

  // Sync local state when props change
  useEffect(() => {
    setLocalThreshold(freefallThreshold.toString());
  }, [freefallThreshold]);

  // Handle changes for the input
  const handleThresholdChange = (value: string) => {
    // Allow empty string for user convenience
    if (value === "") {
      setLocalThreshold(value);
      return;
    }

    // Ensure the input is a valid number
    const num = Number(value);
    if (!isNaN(num)) {
      setLocalThreshold(value);
    }
  };

  // Handle blur event to validate and propagate changes
  const handleThresholdBlur = () => {
    let num = Number(localThreshold);
    if (isNaN(num)) {
      num = MIN_FREEFALL_THRESHOLD;
    }

    // Clamp the value between MIN_THRESHOLD and MAX_THRESHOLD
    num = clamp(num, MIN_FREEFALL_THRESHOLD, MAX_FREEFALL_THRESHOLD);
    onFreefallThresholdChange(num);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        {/* Label and Tooltip */}
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex text-start cursor-pointer">
                  <GiFalling
                    size={15}
                    className="mr-2"
                    title="Freefall Threshold"
                  />
                  <Label>Freefall Threshold</Label>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white rounded-2xl">
                <p>
                  Set the speed threshold to detect when freefall starts, in
                  MPH.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Input and Unit Wrapper */}
        <div
          className={`flex items-center space-x-2 shadow-sm border border-input rounded-md pr-2 ${
            focus ? "ring-1 ring-ring ring-offset-background" : ""
          }`}
        >
          <Input
            type="number"
            value={localThreshold}
            onChange={(e) => handleThresholdChange(e.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => {
              handleThresholdBlur();
              setFocus(false);
            }}
            min={MIN_FREEFALL_THRESHOLD}
            max={MAX_FREEFALL_THRESHOLD}
            className="w-14 focus-visible:ring-0 border-none shadow-none pr-0"
            placeholder="0"
            aria-label="Freefall Threshold in MPH"
          />
          <div className="flex items-center">
            <p className="text-sm">mph</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreefallThreshold;
