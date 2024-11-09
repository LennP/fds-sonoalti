// settingsStore.ts
import {
  AdditionalNotification,
  GeneralSettingsKey,
  GeneralSettingsValue,
  PresetSettingsKey,
  PresetSettingsValue,
  Settings,
  StageSettingsID,
  StageSettingsKey,
  StageSettingsValue,
} from "@/types";
import { COMMANDS, Commands } from "@/utils/commands";
import { defaultSettings } from "@/utils/defaultSettings";
import { FDSDevice } from "@/utils/webusb";
import { create } from "zustand";

type SettingsStore = {
  settings: Settings;
  // Methods to update settings
  setSettings: (newSettings: Settings) => void;
  updateGeneralSetting: (
    key: GeneralSettingsKey,
    value: GeneralSettingsValue,
    device?: FDSDevice | null,
  ) => void;
  updatePresetSetting: (
    presetIndex: number,
    key: PresetSettingsKey,
    value: PresetSettingsValue,
    device?: FDSDevice | null,
  ) => void;
  updatePresetStageSetting: (
    presetIndex: number,
    stageKey: StageSettingsID,
    settingKey: StageSettingsValue,
    value: StageSettingsValue,
    device?: FDSDevice | null,
  ) => void;
  addPresetStageNotification: (
    presetIndex: number,
    stageKey: StageSettingsID,
    additionalNotification: AdditionalNotification,
    device?: FDSDevice | null,
  ) => void;
  // removePresetStageNotification: (
  //   presetIndex: number,
  //   stageKey: StageSettingsName,
  //   notification: Notification,
  // ) => void;
  // const newPresetSetting: Settings["presetSettings"][0][K] = structuredClone(
  //   useSettingsStore.getState().settings.presetSettings[presetIndex][key],
  // );
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
  device.send(message);
};

const useSettingsStore = create<SettingsStore>((set) => ({
  settings: defaultSettings(),

  setSettings: (newSettings: Settings) => set({ settings: newSettings }),

  updateGeneralSetting: (
    key: GeneralSettingsKey,
    value: GeneralSettingsValue,
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
    handleStateUpdateConditionally(key, value, device);
  },

  updatePresetSetting: (
    presetIndex: number,
    key: PresetSettingsKey,
    value: PresetSettingsValue,
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
    handleStateUpdateConditionally(
      key,
      useSettingsStore
        .getState()
        .settings.presetSettings.map((preset) => preset[key]),
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

  addPresetStageNotification: (
    presetIndex: number,
    stageKey: StageSettingsID,
    additionalNotification: AdditionalNotification,
    device?: FDSDevice | null,
  ) => {
    set((state) => {
      const updatedPresetSettings = [...state.settings.presetSettings];
      const updatedStageSettings = {
        ...updatedPresetSettings[presetIndex][stageKey],
      };
      // Check if notification with altitude already exists in object
      if (
        !updatedStageSettings.additionalNotifications.some(
          (existingNotification) =>
            existingNotification.altitude === additionalNotification.altitude &&
            existingNotification.notification ==
              additionalNotification.notification,
        )
      )
        updatedStageSettings.additionalNotifications.push(
          additionalNotification,
        );
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
      "notification",
      {
        presetIndex,
        stageKey,
        additionalNotification,
      },
      device,
    );
  },
}));

export default useSettingsStore;
