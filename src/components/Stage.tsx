// Stage.tsx
import AbbreviateReadings from "@/components/settings/AbbreviateReadings";
import AdditionalNotifications from "@/components/settings/AdditionalNotifications";
import AltitudeRange from "@/components/settings/AltitudeRange";
import Announcement from "@/components/settings/Announcement";
import AnnouncementFrequency from "@/components/settings/AnnouncementFrequency";
import FreefallThreshold from "@/components/settings/FreefallThreshold";
import Volume from "@/components/settings/Volume";
import {
  FreefallStageSettings,
  Notification,
  StageName,
  StageSettings,
  StageSettingsTypes,
} from "@/types";
import React from "react";

interface StageProps {
  stageName: StageName;
  stageSettings: StageSettings | FreefallStageSettings;
  onChange: (
    settingKey: keyof StageSettings,
    value: StageSettingsTypes,
  ) =>
    | void
    | ((
        settingKey: keyof FreefallStageSettings,
        value: StageSettingsTypes,
      ) => void);
  notificationOptions: string[];
  speedLabel: string;
}

const Stage: React.FC<StageProps> = ({
  stageName,
  stageSettings,
  onChange,
  notificationOptions,
  speedLabel,
}) => {
  return (
    <>
      <div className="mb-4">
        <Volume
          value={stageSettings.volume}
          onChange={(value: number) => {
            onChange("volume", value);
          }}
        />
      </div>
      <div className="px-6">
        <AbbreviateReadings
          value={stageSettings.abbreviateReadings}
          onChange={(value: boolean) => {
            onChange("abbreviateReadings", value);
          }}
        />
        <Announcement
          altitudeValue={stageSettings.announceAltitude}
          altitudeOnChange={(value: boolean) => {
            onChange("announceAltitude", value);
          }}
          speedValue={stageSettings.announceSpeed}
          speedOnChange={(value: boolean) => {
            onChange("announceSpeed", value);
          }}
          speedLabel={speedLabel}
        />
        <AnnouncementFrequency
          value={stageSettings.announcementFrequency}
          onChange={(value: number) => {
            onChange("announcementFrequency", value);
          }}
        />
        <AltitudeRange
          fromValue={stageSettings.fromAltitude}
          fromOnChange={(value: number) => {
            onChange("fromAltitude", value);
          }}
          toValue={stageSettings.toAltitude}
          toOnChange={(value: number) => {
            onChange("toAltitude", value);
          }}
        />
        <AdditionalNotifications
          notifications={stageSettings.notifications}
          onAddNotification={(notification: Notification) => {
            const newNotifications = [
              ...stageSettings.notifications,
              notification,
            ];
            onChange("notifications", newNotifications);
          }}
          onRemoveNotification={(index: number) => {
            const newNotifications = stageSettings.notifications.filter(
              (_, i) => i !== index,
            );
            onChange("notifications", newNotifications);
          }}
          notificationOptions={notificationOptions}
        />
        {stageName === StageName.FREEFALL &&
          "freefallThreshold" in stageSettings && (
            <FreefallThreshold
              freefallThreshold={stageSettings.freefallThreshold}
              onFreefallThresholdChange={(value: number) => {
                (
                  onChange as (
                    settingKey: keyof FreefallStageSettings,
                    value: StageSettingsTypes,
                  ) => void
                )("freefallThreshold", value);
              }}
            />
          )}
      </div>
    </>
  );
};

export default Stage;
