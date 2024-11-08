// Preset.tsx
import Section from "@/components/Section";
import Stage from "@/components/Stage";
import {
  FreefallStageSettings,
  PresetSettings,
  PresetSettingsTypes,
  StageName,
  StageSettings,
  StageSettingsTypes,
} from "@/types";
import {
  ASCEND_NOTIFICATION_OPTIONS,
  CANOPY_NOTIFICATION_OPTIONS,
  FREEFALL_NOTIFICATION_OPTIONS,
} from "@/utils/notifications";
import React from "react";
import { FaParachuteBox, FaPlaneDeparture } from "react-icons/fa";
import { GiFalling } from "react-icons/gi";

interface PresetProps {
  presetNumber: number;
  presetSettings: PresetSettings;
  onChange: (key: keyof PresetSettings, value: PresetSettingsTypes) => void;
  onStageChange: (
    stageKey: "ascendSettings" | "freefallSettings" | "canopySettings",
    settingKey: keyof StageSettings | keyof FreefallStageSettings,
    value: StageSettingsTypes,
  ) => void;
}

const Preset: React.FC<PresetProps> = ({
  presetNumber,
  presetSettings,
  onChange,
  onStageChange,
}) => {
  const handleStageChange =
    (key: keyof PresetSettings) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value: string = event.target.value;
      onChange(key, value);
    };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="w-full h-16 flex flex-col justify-center items-center bg-[#252727] text-white">
        <h1 className="text-2xl font-bold text-center">
          Preset {presetNumber}
        </h1>
      </div>

      {/* Preset-level settings */}
      <div className="p-4">
        <label>
          LZ Offset:
          <input
            type="number"
            value={presetSettings.lzOffset}
            onChange={handleStageChange("lzOffset")}
            className="border p-1 ml-2"
          />
        </label>
        <label className="ml-4">
          LZ Higher or Lower:
          <select
            value={presetSettings.lzHigherOrLower}
            onChange={handleStageChange("lzHigherOrLower")}
            className="border p-1 ml-2"
          >
            <option value="higher">Higher</option>
            <option value="lower">Lower</option>
          </select>
        </label>
      </div>

      <Section title="Ascend" icon={<FaPlaneDeparture size={24} />}>
        <Stage
          stageName={StageName.ASCEND}
          stageSettings={presetSettings.ascendSettings}
          onChange={(
            settingKey: keyof StageSettings,
            value: StageSettingsTypes,
          ) => {
            onStageChange("ascendSettings", settingKey, value);
          }}
          notificationOptions={ASCEND_NOTIFICATION_OPTIONS}
          speedLabel="Climb Rate"
        />
      </Section>

      <Section title="Freefall" icon={<GiFalling size={24} />}>
        <Stage
          stageName={StageName.FREEFALL}
          stageSettings={presetSettings.freefallSettings}
          onChange={(
            settingKey: keyof FreefallStageSettings,
            value: StageSettingsTypes,
          ) => {
            onStageChange("freefallSettings", settingKey, value);
          }}
          notificationOptions={FREEFALL_NOTIFICATION_OPTIONS}
          speedLabel="Freefall Speed"
        />
      </Section>

      <Section title="Canopy" icon={<FaParachuteBox size={24} />}>
        <Stage
          stageName={StageName.CANOPY}
          stageSettings={presetSettings.canopySettings}
          onChange={(
            settingKey: keyof StageSettings,
            value: StageSettingsTypes,
          ) => {
            onStageChange("canopySettings", settingKey, value);
          }}
          notificationOptions={CANOPY_NOTIFICATION_OPTIONS}
          speedLabel="Descent Rate"
        />
      </Section>
    </div>
  );
};

export default Preset;
