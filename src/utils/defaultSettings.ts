// defaultSettings.ts
import {
  FreefallStageSettings,
  GeneralSettings,
  PresetSettings,
  Settings,
  StageSettings,
} from "../types";

export function defaultSettings(): Settings {
  return {
    generalSettings: defaultGeneralSettings(),
    presetSettings: [
      defaultPresetSettings(),
      defaultPresetSettings(),
      defaultPresetSettings(),
    ],
  };
}

export function defaultGeneralSettings(): GeneralSettings {
  return {
    includePreJumpInfo: false,
    includePostJumpInfo: false,
    useMetric: false,
  };
}

export function defaultPresetSettings(): PresetSettings {
  return {
    lzOffset: "",
    lzHigherOrLower: "higher",
    ascendSettings: defaultStageSettings(),
    freefallSettings: defaultFreefallSettings(),
    canopySettings: defaultStageSettings(),
  };
}

export function defaultStageSettings(): StageSettings {
  return {
    abbreviateReadings: false,
    announcementFrequency: 1000,
    announceAltitude: false,
    announceSpeed: false,
    fromAltitude: 0,
    toAltitude: 10000,
    volume: 5,
    additionalNotifications: [],
  };
}

export function defaultFreefallSettings(): FreefallStageSettings {
  return {
    ...defaultStageSettings(),
    freefallThreshold: 0,
  };
}
