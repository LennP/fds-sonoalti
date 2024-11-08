// Announcement.tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";
import { FaArrowsAltV, FaBullhorn, FaTachometerAlt } from "react-icons/fa";

interface AnnouncementProps {
  altitudeValue: boolean;
  altitudeOnChange: (value: boolean) => void;
  speedValue: boolean;
  speedOnChange: (value: boolean) => void;
  speedLabel: string;
}

const Announcement: React.FC<AnnouncementProps> = ({
  altitudeValue: altitudeChecked,
  altitudeOnChange: onAltitudeChange,
  speedValue: speedChecked,
  speedOnChange: onSpeedChange,
  speedLabel,
}) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <FaBullhorn size={15} className="mr-2" title="Announcement" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Label className="cursor-pointer">Announcement</Label>
            </TooltipTrigger>
            <TooltipContent className="bg-black text-white rounded-2xl">
              <p>
                Select the parameters you want to be announced during this
                stage.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex space-x-4">
        <div className="flex items-center">
          <Checkbox
            className={altitudeChecked ? "border-black" : "border-input"}
            checked={altitudeChecked}
            onCheckedChange={onAltitudeChange}
            id="announceAltitude"
          />
          <FaArrowsAltV size={16} className="ml-1" title="Altitude" />
        </div>
        <div className="flex items-center">
          <Checkbox
            className={speedChecked ? "border-black" : "border-input"}
            checked={speedChecked}
            onCheckedChange={onSpeedChange}
            id="announceSpeed"
          />
          <FaTachometerAlt size={16} className="ml-1" title={speedLabel} />
        </div>
      </div>
    </div>
  );
};

export default Announcement;
