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
import { clamp } from "@/utils";
import React, { useEffect, useState } from "react";
import { FaBell, FaPlay } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

interface AdditionalNotificationsProps {
  additionalNotifications: AdditionalNotification[];
  onAddNotification: (additionalNotification: AdditionalNotification) => void;
  onRemoveNotification: (
    additionalNotification: AdditionalNotification,
  ) => void;
  onPlayNotification: (notification: string) => void;
  stageAdditionalNotifications: string[];
}

const MIN_ALTITUDE_ADDITIONAL_NOTIFICATION = 0;
const MAX_ALTITUDE_ADDITIONAL_NOTIFICATION = 99999;

const AdditionalNotifications: React.FC<AdditionalNotificationsProps> = ({
  additionalNotifications,
  onAddNotification,
  onRemoveNotification,
  onPlayNotification,
  stageAdditionalNotifications,
}) => {
  const [additionalNotificationOptions, setAdditionalNotificationOptions] =
    useState(stageAdditionalNotifications.sort());

  const [selectedNotification, setSelectedNotification] = useState<string>("");
  const [localAltitude, setLocalAltitude] = useState<string>("");
  const [altitude, setAltitude] = useState<string>("");

  const addAdditionalNotification = (
    _: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (selectedNotification && altitude) {
      onAddNotification({
        notification: selectedNotification,
        altitude: Number(altitude),
      });
      setSelectedNotification("");
      setAltitude("");
    }
  };

  const handleOnBlur = (_e: React.FocusEvent<HTMLInputElement>) => {
    let num = Number(localAltitude);
    if (isNaN(num))
      num = MIN_ALTITUDE_ADDITIONAL_NOTIFICATION;

    // Limit the range of the value the user can fill in
    num = clamp(
      num,
      MIN_ALTITUDE_ADDITIONAL_NOTIFICATION,
      MAX_ALTITUDE_ADDITIONAL_NOTIFICATION,
    );
    setLocalAltitude(num.toString());
    setAltitude(num.toString());
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex text-start cursor-pointer">
                  <FaBell
                    size={15}
                    className="mr-2"
                    title="Additional Notifications"
                  />
                  <Label className="cursor-pointer">
                    Additional Notifications
                  </Label>
                </div>
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
          value={localAltitude}
          onChange={(e) => setLocalAltitude(e.target.value)}
          onBlur={handleOnBlur}
          placeholder="Altitude"
          className="w-20"
        />
        <span>ft</span>
        <Button
          className="bg-white shadow-none w-8"
          disabled={!selectedNotification}
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
              className="flex justify-center items-center mr-2 bg-red-400 text-white min-w-4 min-h-4 w-4 h-4 rounded-[6px] cursor-pointer"
              onClick={() => onRemoveNotification(item)}
            >
              <FaX size="0.5em" />
            </div>
            <div className="flex flex-wrap items-center">
              <span className="text-sm italic text-wrap">
                {item.notification}
              </span>
              &nbsp;
              <span className="text-sm text-wrap">at</span>
              &nbsp;
              <span className="text-sm text-wrap">{item.altitude} feet</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdditionalNotifications;
