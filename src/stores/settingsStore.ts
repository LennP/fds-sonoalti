// settingsStore.ts
import {
  GeneralSettingsKey,
  GeneralSettingsValue,
  PresetSettingsKey,
  PresetSettingsValue,
  Settings,
  StageSettings,
  StageSettingsID,
  StageSettingsKey,
  StageSettingsValue,
} from "@/types";
import { COMMANDS, Commands } from "@/utils/commands";
import { defaultSettings } from "@/utils/defaultSettings";
import { FDSDevice } from "@/utils/webusb";
import { create } from "zustand";
import { FreefallStageSettings } from "./../types/index";

type SettingsStore = {
  settings: Settings;
  // Methods to update settings
  setSettings: (newSettings: Settings) => void;
  updateGeneralSetting: (
    key: keyof Settings["generalSettings"],
    value: GeneralSettingsValue,
    device?: FDSDevice | null,
  ) => void;
  updatePresetSetting: (
    presetIndex: number,
    key: keyof Settings["presetSettings"][0],
    value: PresetSettingsValue,
    device?: FDSDevice | null,
  ) => void;
  updatePresetStageSetting: (
    presetIndex: number,
    stageKey: StageSettingsID,
    settingKey: keyof StageSettings | keyof FreefallStageSettings,
    value: StageSettingsValue,
    device?: FDSDevice | null,
  ) => void;
};

export const handleStateUpdateConditionally = <T, U>(
  commandHandlerID: keyof Commands<T, U>,
  data: T,
  device: FDSDevice | null | undefined,
) => {
  // Do not update to device if no device is given
  if (!device) return;

  const command = COMMANDS[commandHandlerID];
  if (!command) {
    console.error(`Command handler ${commandHandlerID} not found`);
    return;
  }
  const message = command.generateMessage(data);
  console.log("Sending", message);
  device.send(new TextEncoder().encode(message));
};

const useSettingsStore = create<SettingsStore>((set) => ({
  settings: defaultSettings(),

  setSettings: (newSettings: Settings) => set({ settings: newSettings }),

  updateGeneralSetting: (
    key: GeneralSettingsKey,
    value: GeneralSettingsValue,
    device?: FDSDevice | null,
  ) => {
    console.log("updateGeneralSetting")
    set((state: SettingsStore) => ({
      settings: {
        ...state.settings,
        generalSettings: {
          ...state.settings.generalSettings,
          [key]: value,
        },
      },
    }));
    handleStateUpdateConditionally(key, value, device);
  },

  updatePresetSetting: (
    presetIndex: number,
    key: PresetSettingsKey,
    value: PresetSettingsValue,
    device?: FDSDevice | null,
  ) => {
    console.log("updatePresetSetting")
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
    handleStateUpdateConditionally(
      key,
      useSettingsStore
        .getState()
        .settings.presetSettings.forEach((preset) => preset[key]),
      device,
    );
  },

  updatePresetStageSetting: (
    presetIndex: number,
    stageKey: StageSettingsID,
    key: StageSettingsKey,
    value: StageSettingsValue,
    device?: FDSDevice | null,
  ) => {
    console.log("updatePresetStageSetting")
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
    handleStateUpdateConditionally(
      `${stageKey}.${key}`,
      useSettingsStore
        .getState()
        .settings.presetSettings.map(
          (presetSetting) => presetSetting[stageKey][key],
        ),
      device,
    );
  },
}));

export default useSettingsStore;

// addPresetStageNotification: (
//   presetIndex: number,
//   stageKey: StageSettingsID,
//   notification: AdditionalNotification,
//   device?: FDSDevice | null,
// ) => void;
// removePresetStageNotification: (
//   presetIndex: number,
//   stageKey: StageSettingsName,
//   notification: Notification,
// ) => void;
// const newPresetSetting: Settings["presetSettings"][0][K] = structuredClone(
//   useSettingsStore.getState().settings.presetSettings[presetIndex][key],
// );
// addPresetStageNotification: (
//   presetIndex: number,
//   stageKey,
//   notification: AdditionalNotification,
//   device?: FDSDevice | null,
// ) => {
//   set((state) => {
//     const updatedPresetSettings = [...state.settings.presetSettings];
//     const updatedStageSettings = {
//       ...updatedPresetSettings[presetIndex][stageKey],
//     };
//     // Check if notification with altitude already exists in object
//     if (
//       !updatedStageSettings.additionalNotifications.some(
//         (existingNotification) =>
//           existingNotification.altitude === notification.altitude &&
//           existingNotification.notification == notification.notification,
//       )
//     )
//       updatedStageSettings.additionalNotifications.push(notification);
//     updatedPresetSettings[presetIndex] = {
//       ...updatedPresetSettings[presetIndex],
//       [stageKey]: updatedStageSettings,
//     };
//     return {
//       settings: {
//         ...state.settings,
//         presetSettings: updatedPresetSettings,
//       },
//     };
//   });
//   handleStateUpdateConditionally(`${stageKey}.${key}`, device);
// },
