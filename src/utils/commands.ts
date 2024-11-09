// commands.ts
import useSettingsStore from "@/stores/settingsStore";
import {
  FreefallStageSettings,
  GeneralSettingsKey,
  StageSettings,
  StageSettingsID,
  StageSettingsKey,
} from "@/types";

export type Command<T, U> = {
  pattern: RegExp;
  handleMessage: (values: T) => void;
  generateMessage: (data: U) => string;
};

export type Commands<T, U> = {
  [key: string]: Command<T, U>;
};

function createGeneralSettingCommand(
  letter: string,
  settingKey: GeneralSettingsKey,
): Command<[string], boolean> {
  return {
    pattern: new RegExp(`${letter}([01])`),
    handleMessage: ([value]) =>
      useSettingsStore
        .getState()
        .updateGeneralSetting(settingKey, value === "1"),
    generateMessage: (newValue: boolean) => `${letter}${newValue ? "1" : "0"}`,
  };
}

function createPresetBooleanCommand(
  letter: string,
  stage: StageSettingsID,
  settingKey: StageSettingsKey,
): Command<[string, string, string], [boolean, boolean, boolean]> {
  return {
    pattern: new RegExp(`${letter}([01])([01])([01])`),
    handleMessage: (values: [string, string, string]) =>
      values.forEach((value, index) =>
        useSettingsStore
          .getState()
          .updatePresetStageSetting(index, stage, settingKey, value === "1"),
      ),
    generateMessage: (values: [boolean, boolean, boolean]) =>
      `${letter}${values.map((value) => (value ? "1" : "0")).join("")}`,
  };
}

function createPresetNumberCommand(
  letter: string,
  stage: StageSettingsID,
  settingKey: keyof StageSettings | keyof FreefallStageSettings,
  valueLength: number,
): Command<[string, string, string], [number, number, number]> {
  const pattern = new RegExp(`${letter}` + `(${`\\d{${valueLength}}`})`.repeat(3));
  return {
    pattern,
    handleMessage: (values) =>
      values.forEach((value, index) =>
        useSettingsStore
          .getState()
          .updatePresetStageSetting(
            index,
            stage,
            settingKey,
            parseInt(value, 10),
          ),
      ),
    generateMessage: (values: [number, number, number]) => {
      return `${letter}${values
        .map((value) => value.toString().padStart(valueLength, "0"))
        .join("")}`;
    },
  };
}

export const COMMANDS: Commands = {
  includePreJumpInfo: createGeneralSettingCommand("A", "includePreJumpInfo"),
  includePostJumpInfo: createGeneralSettingCommand("B", "includePostJumpInfo"),
  useMetric: createGeneralSettingCommand("C", "useMetric"),
  "ascendSettings.abbreviateReadings": createPresetBooleanCommand(
    "D",
    "ascendSettings",
    "abbreviateReadings",
  ),
  "freefallSettings.abbreviateReadings": createPresetBooleanCommand(
    "E",
    "freefallSettings",
    "abbreviateReadings",
  ),
  "canopySettings.abbreviateReadings": createPresetBooleanCommand(
    "F",
    "canopySettings",
    "abbreviateReadings",
  ),
  "ascendSettings.announcementFrequency": createPresetNumberCommand(
    "G",
    "ascendSettings",
    "announcementFrequency",
    4,
  ),
  "freefallSettings.announcementFrequency": createPresetNumberCommand(
    "H",
    "freefallSettings",
    "announcementFrequency",
    4,
  ),
  "canopySettings.announcementFrequency": createPresetNumberCommand(
    "I",
    "canopySettings",
    "announcementFrequency",
    4,
  ),
  "ascendSettings.announceAltitude": createPresetBooleanCommand(
    "J",
    "ascendSettings",
    "announceAltitude",
  ),
  "ascendSettings.announceSpeed": createPresetBooleanCommand(
    "K",
    "ascendSettings",
    "announceSpeed",
  ),
  "freefallSettings.announceAltitude": createPresetBooleanCommand(
    "L",
    "freefallSettings",
    "announceAltitude",
  ),
  "freefallSettings.announceSpeed": createPresetBooleanCommand(
    "M",
    "freefallSettings",
    "announceSpeed",
  ),
  "canopySettings.announceAltitude": createPresetBooleanCommand(
    "N",
    "canopySettings",
    "announceAltitude",
  ),
  "canopySettings.announceSpeed": createPresetBooleanCommand(
    "O",
    "canopySettings",
    "announceSpeed",
  ),
  "ascendSettings.fromAltitude": createPresetNumberCommand(
    "P",
    "ascendSettings",
    "fromAltitude",
    5,
  ),
  "ascendSettings.toAltitude": createPresetNumberCommand(
    "Q",
    "ascendSettings",
    "toAltitude",
    5,
  ),
  "freefallSettings.fromAltitude": createPresetNumberCommand(
    "R",
    "freefallSettings",
    "fromAltitude",
    5,
  ),
  "freefallSettings.toAltitude": createPresetNumberCommand(
    "S",
    "freefallSettings",
    "toAltitude",
    5,
  ),
  "canopySettings.fromAltitude": createPresetNumberCommand(
    "T",
    "canopySettings",
    "fromAltitude",
    5,
  ),
  "canopySettings.toAltitude": createPresetNumberCommand(
    "U",
    "canopySettings",
    "toAltitude",
    5,
  ),
  "ascendSettings.volume": createPresetNumberCommand(
    "V",
    "ascendSettings",
    "volume",
    2,
  ),
  "freefallSettings.volume": createPresetNumberCommand(
    "W",
    "freefallSettings",
    "volume",
    2,
  ),
  "canopySettings.volume": createPresetNumberCommand(
    "X",
    "canopySettings",
    "volume",
    2,
  ),
  "freefallSettings.freefallThreshold": createPresetNumberCommand(
    "Y",
    "freefallSettings",
    "freefallThreshold",
    3,
  ),
};

// /* Additional Notification */
// notification: {
//   pattern: /([+-])([2-4])([afc])(\d{5})([\w ]+)/, //  /([+-])([2-4])([afc])(\d{5})([\w ]+)/
//   handleMessage: ([add, preset, stage, altitude, notificationName]) => {
//     const addPresetStageNotification =
//       useSettingsStore.getState().addPresetStageNotification;
//     const presetIndex = parseInt(preset, 10) - 2;
//     const stageKey =
//       stage === "a"
//         ? "ascendSettings"
//         : stage === "f"
//           ? "freefallSettings"
//           : "canopySettings";
//     const altitudeInt = parseInt(altitude, 10);

//     addPresetStageNotification(presetIndex, stageKey, {
//       altitude: altitudeInt,
//       notification: notificationName,
//     });
//   },
//   generateMessage: (oldSettings: Settings) => {
//     const addPresetStageNotification =
//       useSettingsStore.getState().addPresetStageNotification;
//       return "";
//   },
// },
