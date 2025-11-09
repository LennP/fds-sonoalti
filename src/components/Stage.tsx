// Stage.tsx
import AbbreviateReadings from "@/components/settings/AbbreviateReadings";
import AdditionalNotifications from "@/components/settings/AdditionalNotifications";
import AltitudeRange from "@/components/settings/AltitudeRange";
import Announcement from "@/components/settings/Announcement";
import AnnouncementFrequency from "@/components/settings/AnnouncementFrequency";
import FreefallThreshold from "@/components/settings/FreefallThreshold";
import Volume from "@/components/settings/Volume";
import {
  AdditionalNotification,
  FreefallStageSettings,
  StageName,
  StageSettings,
  StageSettingsValue,
} from "@/types";

interface StageProps {
  stageName: StageName;
  stageSettings: StageSettings | FreefallStageSettings;
  onPresetStageChange: (
    settingKey: keyof StageSettings,
    value: StageSettingsValue,
  ) =>
    | void
    | ((
        settingKey: keyof FreefallStageSettings,
        value: StageSettingsValue,
      ) => void);
  onPresetStageAddNotification: (
    additionalNotification: AdditionalNotification,
  ) => void;
  onPresetStageRemoveNotification: (
    additionalNotification: AdditionalNotification,
  ) => void;
  onPlayNotification: (notification: string) => void;
  stageAdditionalNotifications: string[];
  speedLabel: string;
}

const Stage = ({
  stageName,
  stageSettings,
  onPresetStageChange,
  onPresetStageAddNotification,
  onPresetStageRemoveNotification,
  onPlayNotification,
  stageAdditionalNotifications,
  speedLabel,
}: StageProps) => (
  <>
    <div className="mb-4">
      <Volume
        value={stageSettings.volume}
        onChange={(value: number) => {
          onPresetStageChange("volume", value);
        }}
      />
    </div>
    <div className="px-6">
      <AbbreviateReadings
        value={stageSettings.abbreviateReadings}
        onChange={(value: boolean) => {
          onPresetStageChange("abbreviateReadings", value);
        }}
      />
      <Announcement
        altitudeValue={stageSettings.announceAltitude}
        altitudeOnChange={(value: boolean) => {
          onPresetStageChange("announceAltitude", value);
        }}
        speedValue={stageSettings.announceSpeed}
        speedOnChange={(value: boolean) => {
          onPresetStageChange("announceSpeed", value);
        }}
        speedLabel={speedLabel}
      />
      <AnnouncementFrequency
        value={stageSettings.announcementFrequency}
        onChange={(value: number) => {
          onPresetStageChange("announcementFrequency", value);
        }}
      />
      <AltitudeRange
        fromValue={stageSettings.fromAltitude}
        fromOnChange={(value: number) => {
          onPresetStageChange("fromAltitude", value);
        }}
        toValue={stageSettings.toAltitude}
        toOnChange={(value: number) => {
          onPresetStageChange("toAltitude", value);
        }}
      />
      <AdditionalNotifications
        additionalNotifications={stageSettings.additionalNotifications}
        onAddNotification={(
          additionalNotification: AdditionalNotification,
        ) => {
          onPresetStageAddNotification(additionalNotification);
        }}
        onRemoveNotification={(
          additionalNotification: AdditionalNotification,
        ) => {
          onPresetStageRemoveNotification(additionalNotification);
        }}
        onPlayNotification={onPlayNotification}
        stageAdditionalNotifications={stageAdditionalNotifications}
      />
      {stageName === StageName.FREEFALL &&
        "freefallThreshold" in stageSettings && (
          <FreefallThreshold
            freefallThreshold={stageSettings.freefallThreshold}
            onFreefallThresholdChange={(value: number) => {
              (
                onPresetStageChange as (
                  settingKey: keyof FreefallStageSettings,
                  value: StageSettingsValue,
                ) => void
              )("freefallThreshold", value);
            }}
          />
        )}
    </div>
  </>
);

export default Stage;
