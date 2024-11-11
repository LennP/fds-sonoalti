// settingsStore.ts
import {
  AdditionalNotification,
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
import { subscribeWithSelector } from "zustand/middleware";

type SettingsStore = {
  extraAdditionalNotifications: string[];
  addExtraAdditionalNotification: (notification: string) => void;
  settings: Settings;
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
  updatePresetStageSetting: <_T>(
    presetIndex: number,
    stageKey: StageSettingsID,
    settingKey: StageSettingsKey,
    value: StageSettingsValue,
    device?: FDSDevice | null,
  ) => void;
  addPresetStageNotification: (
    presetIndex: number,
    stageKey: StageSettingsID,
    additionalNotification: AdditionalNotification,
    device?: FDSDevice | null,
  ) => void;
  removePresetStageNotification: (
    presetIndex: number,
    stageKey: StageSettingsID,
    additionalNotification: AdditionalNotification,
    device?: FDSDevice | null,
  ) => void;
};

export const handleStateUpdateConditionally = <K extends keyof Commands>(
  commandHandlerID: K,
  data: Parameters<Commands[K]["generateMessage"]>[0],
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

const useSettingsStore = create(
  subscribeWithSelector<SettingsStore>((set) => ({
    extraAdditionalNotifications: [],

    addExtraAdditionalNotification: (notification: string) => {
      set((state: SettingsStore) => ({
        ...state,
        extraAdditionalNotifications: [
          ...state.extraAdditionalNotifications,
          notification,
        ],
      }));
    },

    settings: defaultSettings(),

    setSettings: (_: Settings) => {},

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
        key as keyof Commands,
        useSettingsStore
          .getState()
          .settings.presetSettings.map((preset) => preset[key]),
        device,
      );
    },

    updatePresetStageSetting: <T = StageSettings>(
      presetIndex: number,
      stageKey: StageSettingsID,
      key: keyof T,
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
        `${stageKey}.${String(key)}` as keyof Commands,
        useSettingsStore
          .getState()
          .settings.presetSettings.map(
            (presetSetting) => (presetSetting[stageKey] as T)[key],
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
              existingNotification.altitude ===
                additionalNotification.altitude &&
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
          add: true,
          presetIndex,
          stageKey,
          additionalNotification,
        },
        device,
      );
    },

    removePresetStageNotification: (
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
        // Find the index of the first notification that matches both altitude and notification
        const indexToRemove =
          updatedStageSettings.additionalNotifications.findIndex(
            (existingNotification) =>
              existingNotification.altitude ===
                additionalNotification.altitude &&
              existingNotification.notification ===
                additionalNotification.notification,
          );
        // If a matching notification is found, remove it from the array
        if (indexToRemove !== -1) {
          updatedStageSettings.additionalNotifications.splice(indexToRemove, 1);
        }
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
          add: false,
          presetIndex,
          stageKey,
          additionalNotification,
        },
        device,
      );
    },
  })),
);

export default useSettingsStore;
