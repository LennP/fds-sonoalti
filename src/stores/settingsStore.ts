// settingsStore.ts
import {
  FreefallStageSettings,
  GeneralSettingsTypes,
  PresetSettingsTypes,
  Settings,
  StageSettings,
  StageSettingsTypes,
} from "@/types";
import { sendStateToDevice } from "@/utils/commands";
import { defaultSettings } from "@/utils/defaultSettings";
import { FDSDevice } from "@/utils/webusb";
import { create } from "zustand";

type SettingsStore = {
  settings: Settings;
  // Methods to update settings
  setSettings: (newSettings: Settings) => void;
  updateGeneralSetting: (
    key: keyof Settings["generalSettings"],
    value: GeneralSettingsTypes,
    device?: FDSDevice | null,
  ) => void;
  updatePresetSetting: (
    presetIndex: number,
    key: keyof Settings["presetSettings"][0],
    value: PresetSettingsTypes,
    device?: FDSDevice | null,
  ) => void;
  updatePresetStageSetting: (
    presetIndex: number,
    stageKey: "ascendSettings" | "freefallSettings" | "canopySettings",
    settingKey: keyof StageSettings | keyof FreefallStageSettings,
    value: StageSettingsTypes,
    device?: FDSDevice | null,
  ) => void;
};

const useSettingsStore = create<SettingsStore>((set) => ({
  settings: defaultSettings(),

  setSettings: (newSettings: Settings) => set({ settings: newSettings }),

  updateGeneralSetting: (
    key: keyof Settings["generalSettings"],
    value: GeneralSettingsTypes,
    device?: FDSDevice | null,
  ) => {
    set((state: SettingsStore) => ({
      settings: {
        ...state.settings,
        generalSettings: {
          ...state.settings.generalSettings,
          [key]: value,
        },
      },
    }));
    if (device) sendStateToDevice(key, device);
  },

  updatePresetSetting: (
    presetIndex: number,
    key: keyof Settings["presetSettings"][0],
    value: PresetSettingsTypes,
    device?: FDSDevice | null,
  ) => {
    set((state: SettingsStore) => {
      const updatedPresetSettings = [...state.settings.presetSettings];
      updatedPresetSettings[presetIndex] = {
        ...updatedPresetSettings[presetIndex],
        [key]: value,
      };
      return {
        settings: {
          ...state.settings,
          presetSettings: updatedPresetSettings,
        },
      };
    });
    if (device) sendStateToDevice(key, device);
  },

  updatePresetStageSetting: (
    presetIndex: number,
    stageKey,
    key,
    value,
    device?: FDSDevice | null,
  ) => {
    set((state) => {
      const updatedPresetSettings = [...state.settings.presetSettings];
      const updatedStageSettings = {
        ...updatedPresetSettings[presetIndex][stageKey],
        [key]: value,
      };
      updatedPresetSettings[presetIndex] = {
        ...updatedPresetSettings[presetIndex],
        [stageKey]: updatedStageSettings,
      };
      return {
        settings: {
          ...state.settings,
          presetSettings: updatedPresetSettings,
        },
      };
    });
    if (device) sendStateToDevice(`${stageKey}.${key}`, device);
  },
}));

export default useSettingsStore;
