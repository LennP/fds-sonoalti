// Preset.tsx
import Section from "@/components/Section";
import Stage from "@/components/Stage";
import {
  AdditionalNotification,
  PresetSettings,
  PresetSettingsValue,
  StageName,
  StageSettingsID,
  StageSettingsKey,
  StageSettingsValue
} from "@/types";
import {
  ASCEND_NOTIFICATION_OPTIONS,
  CANOPY_NOTIFICATION_OPTIONS,
  FREEFALL_NOTIFICATION_OPTIONS,
} from "@/utils/notifications";
import React from "react";
import { FaParachuteBox, FaPlaneDeparture } from "react-icons/fa";
import { GiFalling } from "react-icons/gi";
import DropzoneOffset from "./settings/DropzoneOffset";

interface PresetProps {
  presetNumber: number;
  presetSettings: PresetSettings;
  onPresetChange: (
    key: keyof PresetSettings,
    value: PresetSettingsValue,
  ) => void;
  onPresetStageChange: (
    stageKey: StageSettingsID,
    key: StageSettingsKey,
    value: StageSettingsValue,
  ) => void;
  onPresetStageAddNotification: (
    stageKey: StageSettingsID,
    additionalNotification: AdditionalNotification,
  ) => void;
}

// Define a type for stage configuration
interface StageConfig {
  id: StageSettingsID;
  icon: React.ReactElement;
  stageName: StageName;
  notificationOptions: any; // Adjust the type based on your notification options
  speedLabel: string;
  settingsKey: keyof PresetSettings;
}

const STAGES: StageConfig[] = [
  {
    id: "ascendSettings",
    icon: <FaPlaneDeparture size={24} />,
    stageName: StageName.ASCEND,
    notificationOptions: ASCEND_NOTIFICATION_OPTIONS,
    speedLabel: "Climb Rate",
    settingsKey: "ascendSettings",
  },
  {
    id: "freefallSettings",
    icon: <GiFalling size={24} />,
    stageName: StageName.FREEFALL,
    notificationOptions: FREEFALL_NOTIFICATION_OPTIONS,
    speedLabel: "Freefall Speed",
    settingsKey: "freefallSettings",
  },
  {
    id: "canopySettings",
    icon: <FaParachuteBox size={24} />,
    stageName: StageName.CANOPY,
    notificationOptions: CANOPY_NOTIFICATION_OPTIONS,
    speedLabel: "Descent Rate",
    settingsKey: "canopySettings",
  },
];

const Preset: React.FC<PresetProps> = ({
  presetNumber,
  presetSettings,
  onPresetChange,
  onPresetStageChange,
  onPresetStageAddNotification,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="w-full h-16 flex flex-col justify-center items-center bg-[#252727] text-white">
        <h1 className="text-2xl font-bold text-center">
          Preset {presetNumber}
        </h1>
      </div>

      {/* Preset-level settings */}
      <div className="px-6 py-4">
        <DropzoneOffset
          dropzoneOffset={presetSettings.dropzoneOffset}
          onChange={(offset: number) =>
            onPresetChange("dropzoneOffset", offset)
          }
        />
      </div>

      {/* Stages */}
      {STAGES.map((stage) => (
        <Section key={stage.id} title={stage.stageName} icon={stage.icon}>
          <Stage
            stageName={stage.stageName}
            stageSettings={presetSettings[stage.settingsKey]}
            onPresetStageChange={(key, value) =>
              onPresetStageChange(stage.id as StageSettingsID, key, value)
            }
            onPresetStageAddNotification={(additionalNotification) =>
              onPresetStageAddNotification(
                stage.id as StageSettingsID,
                additionalNotification
              )
            }
            notificationOptions={stage.notificationOptions}
            speedLabel={stage.speedLabel}
          />
        </Section>
      ))}
    </div>
  );
};

export default Preset;