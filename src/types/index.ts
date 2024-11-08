export interface Notification {
  notification: string;
  altitude: string;
}

export interface StageSettings {
  abbreviateReadings: boolean;
  announcementFrequency: number;
  announceAltitude: boolean;
  announceSpeed: boolean;
  fromAltitude: number;
  toAltitude: number;
  volume: number;
  notifications: Notification[];
}
export interface FreefallStageSettings extends StageSettings {
  freefallThreshold: number;
}
export type StageSettingsTypes = boolean | number | Notification[];

export interface PresetSettings {
  lzOffset: string;
  lzHigherOrLower: "higher" | "lower";
  ascendSettings: StageSettings;
  freefallSettings: FreefallStageSettings;
  canopySettings: StageSettings;
}
export type PresetSettingsTypes =
  | string
  | "higher"
  | "lower"
  | StageSettings
  | FreefallStageSettings;

export interface GeneralSettings {
  includePreJumpInfo: boolean;
  includePostJumpInfo: boolean;
  useMetric: boolean;
}
export type GeneralSettingsTypes = boolean;

export interface Settings {
  generalSettings: GeneralSettings;
  presetSettings: PresetSettings[];
}

export enum StageName {
  ASCEND = "ascend",
  FREEFALL = "freefall",
  CANOPY = "canopy",
}
