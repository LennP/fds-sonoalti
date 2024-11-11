// AbbreviateReadings.tsx
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";
import { MdShortText } from "react-icons/md";

interface AbbreviateReadingsProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const AbbreviateReadings: React.FC<AbbreviateReadingsProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <Tooltip>
          <TooltipTrigger>
            <div className="flex text-start cursor-pointer">
              <MdShortText
                size={15}
                className="mr-2"
                title="Abbreviate Readings"
              />
              <Label className="cursor-pointer">Abbreviate Readings</Label>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-black text-white rounded-2xl w-64">
            <p>
              When enabled, readings will be abbreviated to save time. For
              instance, "three point five" will be said instead of "thirty-five
              hundred".
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
};

export default AbbreviateReadings;
