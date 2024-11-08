// AnnouncementFrequency.tsx
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";
import { FaWaveSquare } from "react-icons/fa";

interface AnnouncementFrequencyProps {
  value: number;
  onChange: (value: number) => void;
}

const ANNOUNCEMENT_FREQUENCIES: number[] = [100, 200, 500, 1000, 2000, 5000];

const AnnouncementFrequency: React.FC<AnnouncementFrequencyProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <FaWaveSquare
          size={15}
          className="mr-2"
          title="Announcement Frequency"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="cursor-pointer text-start">
                <Label>Announcement Frequency</Label>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-black text-white rounded-2xl">
              <p>
                Select how often announcements should be provided during this
                stage.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Select
        value={value.toString()}
        onValueChange={(value) => onChange(Number(value))}
      >
        <SelectTrigger className="w-[7rem]">
          <SelectValue placeholder="Frequency" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {ANNOUNCEMENT_FREQUENCIES.map((freq) => (
            <SelectItem key={freq} value={freq.toString()}>
              {freq} feet
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AnnouncementFrequency;
