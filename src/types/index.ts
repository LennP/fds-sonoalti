export interface AdditionalNotification {
  notification: string;
  altitude: number;
}

export interface StageSettings {
  abbreviateReadings: boolean;
  announcementFrequency: number;
  announceAltitude: boolean;
  announceSpeed: boolean;
  fromAltitude: number;
  toAltitude: number;
  volume: number;
  additionalNotifications: AdditionalNotification[];
}
export interface FreefallStageSettings extends StageSettings {
  freefallThreshold: number;
}
export type StageSettingsKey = keyof FreefallStageSettings;
export type StageSettingsValue = FreefallStageSettings[StageSettingsKey];

export interface PresetSettings {
  dropzoneOffset: number;
  ascendSettings: StageSettings;
  freefallSettings: FreefallStageSettings;
  canopySettings: StageSettings;
}
export type PresetSettingsKey = keyof PresetSettings;
export type PresetSettingsValue = PresetSettings[PresetSettingsKey];

export interface GeneralSettings {
  includePreJumpInfo: boolean;
  includePostJumpInfo: boolean;
  useMetric: boolean;
}
export type GeneralSettingsKey = keyof GeneralSettings;
export type GeneralSettingsValue = GeneralSettings[GeneralSettingsKey];

export interface Settings {
  generalSettings: GeneralSettings;
  presetSettings: PresetSettings[];
}

export type StageSettingsID =
  | "ascendSettings"
  | "freefallSettings"
  | "canopySettings";

export enum StageName {
  ASCEND = "ascend",
  FREEFALL = "freefall",
  CANOPY = "canopy",
}
