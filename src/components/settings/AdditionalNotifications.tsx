// AdditionalNotifications.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import useSettingsStore from "@/stores/settingsStore";
import { AdditionalNotification } from "@/types";
import React, { useEffect, useState } from "react";
import { FaBell, FaPlay } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

interface AdditionalNotificationsProps {
  additionalNotifications: AdditionalNotification[];
  onAddNotification: (additionalNotification: AdditionalNotification) => void;
  onRemoveNotification: (
    additionalNotification: AdditionalNotification,
  ) => void;
  onPlayNotification: (
    notification: string,
  ) => void;
  stageAdditionalNotifications: string[];
}

const AdditionalNotifications: React.FC<AdditionalNotificationsProps> = ({
  additionalNotifications,
  onAddNotification,
  onRemoveNotification,
  onPlayNotification,
  stageAdditionalNotifications,
}) => {
  const [additionalNotificationOptions, setAdditionalNotificationOptions] =
    useState(stageAdditionalNotifications.sort());

  const [selectedNotification, setSelectedNotification] = useState("");
  const [altitude, setAltitude] = useState("");

  const addAdditionalNotification = (_: React.MouseEvent<HTMLButtonElement>) => {
    if (selectedNotification && altitude) {
      onAddNotification({
        notification: selectedNotification,
        altitude: Number(altitude),
      });
      setSelectedNotification("");
      setAltitude("");
    }
  };

  useEffect(() => {
    // Subscribe to changes in extra additional notifications
    const unsubscribe = useSettingsStore.subscribe(
      (state) => {
        return state.extraAdditionalNotifications;
      },
      (extraNotifications, _prev) =>
        // Filter out duplicates and sort
        setAdditionalNotificationOptions(
          [
            ...new Set([
              ...additionalNotificationOptions,
              ...extraNotifications,
            ]),
          ].sort(),
        ),
    );
    return () => unsubscribe();
  }, [additionalNotificationOptions]);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FaBell size={15} className="mr-2" title="Additional Notifications" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Label className="cursor-pointer">
                  Additional Notifications
                </Label>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-white rounded-2xl">
                <p>Add custom notifications at specific altitudes.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex items-center space-x-2 mt-2">
        <Select
          value={selectedNotification}
          onValueChange={setSelectedNotification}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select notification" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {additionalNotificationOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          value={altitude}
          onChange={(e) => setAltitude(e.target.value)}
          placeholder="Altitude"
          className="w-20"
        />
        <span>ft</span>
        <Button
          onClick={() => {
            onPlayNotification(selectedNotification);
          }}
          variant="secondary"
        >
          <FaPlay />
        </Button>
        <Button onClick={addAdditionalNotification} variant="default">
          +
        </Button>
      </div>
      <ul className="mt-2">
        {additionalNotifications.map((item, index) => (
          <li key={index} className="flex items-center">
            <div
              className="flex justify-center items-center mr-2 bg-red-400 text-white w-4 h-4 rounded-[6px] cursor-pointer"
              onClick={() => onRemoveNotification(item)}
            >
              <FaX size="0.5em" />
            </div>
            <p className="text-sm italic">{item.notification}</p>
            <p className="text-sm">&nbsp;at {item.altitude} feet</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdditionalNotifications;
