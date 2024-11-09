// Preset.tsx
import Section from "@/components/Section";
import Stage from "@/components/Stage";
import {
  FreefallStageSettings,
  PresetSettings,
  PresetSettingsValue,
  StageName,
  StageSettings,
  StageSettingsID,
  StageSettingsKey,
  StageSettingsValue,
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
}

const Preset: React.FC<PresetProps> = ({
  presetNumber,
  presetSettings,
  onPresetChange,
  onPresetStageChange,
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

      <Section title="Ascend" icon={<FaPlaneDeparture size={24} />}>
        <Stage
          stageName={StageName.ASCEND}
          stageSettings={presetSettings.ascendSettings}
          onPresetStageChange={(
            key: keyof StageSettings,
            value: StageSettingsValue,
          ) => {
            onPresetStageChange("ascendSettings", key, value);
          }}
          notificationOptions={ASCEND_NOTIFICATION_OPTIONS}
          speedLabel="Climb Rate"
        />
      </Section>

      <Section title="Freefall" icon={<GiFalling size={24} />}>
        <Stage
          stageName={StageName.FREEFALL}
          stageSettings={presetSettings.freefallSettings}
          onPresetStageChange={(
            key: keyof FreefallStageSettings,
            value: StageSettingsValue,
          ) => {
            onPresetStageChange("freefallSettings", key, value);
          }}
          notificationOptions={FREEFALL_NOTIFICATION_OPTIONS}
          speedLabel="Freefall Speed"
        />
      </Section>

      <Section title="Canopy" icon={<FaParachuteBox size={24} />}>
        <Stage
          stageName={StageName.CANOPY}
          stageSettings={presetSettings.canopySettings}
          onPresetStageChange={(
            key: keyof StageSettings,
            value: StageSettingsValue,
          ) => {
            onPresetStageChange("canopySettings", key, value);
          }}
          notificationOptions={CANOPY_NOTIFICATION_OPTIONS}
          speedLabel="Descent Rate"
        />
      </Section>
    </div>
  );
};

export default Preset;
