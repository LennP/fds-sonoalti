// commands.ts
import useSettingsStore from "@/stores/settingsStore";
import {
  AdditionalNotificationChange,
  FreefallStageSettings,
  GeneralSettingsKey,
  PresetSettingsKey,
  StageSettings,
  StageSettingsID,
  StageSettingsKey,
} from "@/types";
import {
  possibleNotificationsForRegExp,
  REQUEST_SETTINGS_COMMAND,
} from "./notifications";

export type Command<T, U> = {
  pattern: RegExp;
  handleMessage: (values: T) => void;
  generateMessage: (data: U) => string;
};

// Define specific command types
type GeneralSettingCommand = Command<[string], boolean>;
type PresetStageBooleanCommand = Command<
  [string, string, string],
  [boolean, boolean, boolean]
>;
type PresetPolarNumberCommand = Command<
  [string, string, string],
  [number, number, number]
>;
type PresetStageNumberCommand = Command<
  [string, string, string],
  [number, number, number]
>;
type NotificationCommand = Command<
  [string, string, string, string, string],
  AdditionalNotificationChange
>;
type CustomNotificationCommand = Command<[string], void>;
type PlayNotificationCommand = Command<[string], string>;

// Map each command key to its specific Command type
export type Commands = {
  includePreJumpInfo: GeneralSettingCommand;
  includePostJumpInfo: GeneralSettingCommand;
  useMetric: GeneralSettingCommand;
  "ascendSettings.abbreviateReadings": PresetStageBooleanCommand;
  "freefallSettings.abbreviateReadings": PresetStageBooleanCommand;
  "canopySettings.abbreviateReadings": PresetStageBooleanCommand;
  "ascendSettings.announcementFrequency": PresetStageNumberCommand;
  "freefallSettings.announcementFrequency": PresetStageNumberCommand;
  "canopySettings.announcementFrequency": PresetStageNumberCommand;
  "ascendSettings.announceAltitude": PresetStageBooleanCommand;
  "ascendSettings.announceSpeed": PresetStageBooleanCommand;
  "freefallSettings.announceAltitude": PresetStageBooleanCommand;
  "freefallSettings.announceSpeed": PresetStageBooleanCommand;
  "canopySettings.announceAltitude": PresetStageBooleanCommand;
  "canopySettings.announceSpeed": PresetStageBooleanCommand;
  "ascendSettings.fromAltitude": PresetStageNumberCommand;
  "ascendSettings.toAltitude": PresetStageNumberCommand;
  "freefallSettings.fromAltitude": PresetStageNumberCommand;
  "freefallSettings.toAltitude": PresetStageNumberCommand;
  "canopySettings.fromAltitude": PresetStageNumberCommand;
  "canopySettings.toAltitude": PresetStageNumberCommand;
  "ascendSettings.volume": PresetStageNumberCommand;
  "freefallSettings.volume": PresetStageNumberCommand;
  "canopySettings.volume": PresetStageNumberCommand;
  "freefallSettings.freefallThreshold": PresetStageNumberCommand;
  dropzoneOffset: PresetPolarNumberCommand;
  notification: NotificationCommand;
  customNotification: CustomNotificationCommand;
  playNotification: PlayNotificationCommand;
};

function createGeneralSettingCommand(
  letter: string,
  settingKey: GeneralSettingsKey,
): Command<[string], boolean> {
  return {
    pattern: new RegExp(`${letter}([01])`, "g"),
    handleMessage: ([value]: [value: string]) =>
      useSettingsStore
        .getState()
        .updateGeneralSetting(settingKey, value === "1"),
    generateMessage: (newValue: boolean) => `${letter}${newValue ? "1" : "0"}`,
  };
}

function createPresetStageBooleanCommand<T>(
  letter: string,
  stage: StageSettingsID,
  settingKey: StageSettingsKey,
): Command<[string, string, string], [boolean, boolean, boolean]> {
  return {
    pattern: new RegExp(`${letter}([01])([01])([01])`, "g"),
    handleMessage: (values: [string, string, string]) =>
      values.forEach((value, index) =>
        useSettingsStore
          .getState()
          .updatePresetStageSetting<T>(index, stage, settingKey, value === "1"),
      ),
    generateMessage: (values: [boolean, boolean, boolean]) =>
      `${letter}${values.map((value) => (value ? "1" : "0")).join("")}`,
  };
}

function createPresetPolarNumberCommand(
  letter: string,
  settingKey: PresetSettingsKey,
  valueLength: number,
): Command<[string, string, string], [number, number, number]> {
  const pattern = new RegExp(
    `${letter}` + `([+-]?${`\\d{${valueLength}}`})`.repeat(3),
    "g",
  );
  return {
    pattern,
    handleMessage: (values: [string, string, string]) =>
      values.forEach((value, index) =>
        useSettingsStore
          .getState()
          .updatePresetSetting(index, settingKey, parseInt(value, 10)),
      ),
    generateMessage: (values: [number, number, number]): string => {
      return `${letter}${values
        .map(
          (value) =>
            `${value >= 0 ? "+" : "-"}${Math.abs(value)
              .toString()
              .padStart(valueLength, "0")}`,
        )
        .join("")}`;
    },
  };
}

function createPresetStageNumberCommand<T = StageSettings>(
  letter: string,
  stageKey: StageSettingsID,
  settingKey: StageSettingsKey,
  valueLength: number,
): Command<[string, string, string], [number, number, number]> {
  const pattern = new RegExp(
    `${letter}` + `(${`\\d{${valueLength}}`})`.repeat(3),
    "g",
  );
  return {
    pattern,
    handleMessage: (values: [string, string, string]) =>
      values.forEach((value, presetIndex) =>
        useSettingsStore
          .getState()
          .updatePresetStageSetting<T>(
            presetIndex,
            stageKey,
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
  "ascendSettings.abbreviateReadings": createPresetStageBooleanCommand(
    "D",
    "ascendSettings",
    "abbreviateReadings",
  ),
  "freefallSettings.abbreviateReadings": createPresetStageBooleanCommand(
    "E",
    "freefallSettings",
    "abbreviateReadings",
  ),
  "canopySettings.abbreviateReadings": createPresetStageBooleanCommand(
    "F",
    "canopySettings",
    "abbreviateReadings",
  ),
  "ascendSettings.announcementFrequency": createPresetStageNumberCommand(
    "G",
    "ascendSettings",
    "announcementFrequency",
    4,
  ),
  "freefallSettings.announcementFrequency": createPresetStageNumberCommand(
    "H",
    "freefallSettings",
    "announcementFrequency",
    4,
  ),
  "canopySettings.announcementFrequency": createPresetStageNumberCommand(
    "I",
    "canopySettings",
    "announcementFrequency",
    4,
  ),
  "ascendSettings.announceAltitude": createPresetStageBooleanCommand(
    "J",
    "ascendSettings",
    "announceAltitude",
  ),
  "ascendSettings.announceSpeed": createPresetStageBooleanCommand(
    "K",
    "ascendSettings",
    "announceSpeed",
  ),
  "freefallSettings.announceAltitude": createPresetStageBooleanCommand(
    "L",
    "freefallSettings",
    "announceAltitude",
  ),
  "freefallSettings.announceSpeed": createPresetStageBooleanCommand(
    "M",
    "freefallSettings",
    "announceSpeed",
  ),
  "canopySettings.announceAltitude": createPresetStageBooleanCommand(
    "N",
    "canopySettings",
    "announceAltitude",
  ),
  "canopySettings.announceSpeed": createPresetStageBooleanCommand(
    "O",
    "canopySettings",
    "announceSpeed",
  ),
  "ascendSettings.fromAltitude": createPresetStageNumberCommand(
    "P",
    "ascendSettings",
    "fromAltitude",
    5,
  ),
  "ascendSettings.toAltitude": createPresetStageNumberCommand(
    "Q",
    "ascendSettings",
    "toAltitude",
    5,
  ),
  "freefallSettings.fromAltitude": createPresetStageNumberCommand(
    "R",
    "freefallSettings",
    "fromAltitude",
    5,
  ),
  "freefallSettings.toAltitude": createPresetStageNumberCommand(
    "S",
    "freefallSettings",
    "toAltitude",
    5,
  ),
  "canopySettings.fromAltitude": createPresetStageNumberCommand(
    "T",
    "canopySettings",
    "fromAltitude",
    5,
  ),
  "canopySettings.toAltitude": createPresetStageNumberCommand(
    "U",
    "canopySettings",
    "toAltitude",
    5,
  ),
  "ascendSettings.volume": createPresetStageNumberCommand(
    "V",
    "ascendSettings",
    "volume",
    2,
  ),
  "freefallSettings.volume": createPresetStageNumberCommand(
    "W",
    "freefallSettings",
    "volume",
    2,
  ),
  "canopySettings.volume": createPresetStageNumberCommand(
    "X",
    "canopySettings",
    "volume",
    2,
  ),
  "freefallSettings.freefallThreshold":
    createPresetStageNumberCommand<FreefallStageSettings>(
      "Y",
      "freefallSettings",
      "freefallThreshold",
      3,
    ),
  dropzoneOffset: createPresetPolarNumberCommand("Z", "dropzoneOffset", 5),
  /* Additional Notification */
  notification: {
    pattern: new RegExp(
      `([+-])([2-4])([afc])(\\d{5})(${possibleNotificationsForRegExp})`,
      "g",
    ),
    handleMessage: ([operation, preset, stage, altitude, notificationName]: [
      string,
      string,
      string,
      string,
      string,
    ]) => {
      const presetIndex = parseInt(preset, 10) - 2;
      const stageKey =
        stage === "a"
          ? "ascendSettings"
          : stage === "f"
            ? "freefallSettings"
            : stage === "c"
              ? "canopySettings"
              : undefined;
      if (stageKey === undefined)
        throw new Error("Invalid stage for notification: " + stage);
      const altitudeInt = parseInt(altitude, 10);

      if (operation === "+") {
        useSettingsStore
          .getState()
          .addPresetStageNotification(presetIndex, stageKey, {
            altitude: altitudeInt,
            notification: notificationName,
          });
      } else if (operation === "-") {
        useSettingsStore
          .getState()
          .removePresetStageNotification(presetIndex, stageKey, {
            altitude: altitudeInt,
            notification: notificationName,
          });
      } else {
        throw new Error("Invalid operation for notification: " + operation);
      }
    },
    generateMessage: (notificationChange: AdditionalNotificationChange) => {
      console.log("Adding: ", notificationChange);
      const presetIndexOffset = notificationChange.presetIndex + 2;
      const stageChar =
        notificationChange.stageKey === "ascendSettings"
          ? "a"
          : notificationChange.stageKey === "freefallSettings"
            ? "f"
            : notificationChange.stageKey === "canopySettings"
              ? "c"
              : undefined;
      if (stageChar === undefined)
        throw new Error(
          "Invalid stage for notification: " + notificationChange.stageKey,
        );
      const altitudeStr = notificationChange.additionalNotification.altitude
        .toString()
        .padStart(5, "0");
      const notification =
        notificationChange.additionalNotification.notification;
      const operation = notificationChange.add ? "+" : "-";
      return `${operation}${presetIndexOffset}${stageChar}${altitudeStr}${notification}`;
    },
  },
  /* Custom Notification */
  customNotification: {
    pattern: new RegExp(
      `a([A-Z][a-z -]+)(?=a[A-Z]|${REQUEST_SETTINGS_COMMAND})`,
      "g",
    ),
    handleMessage: ([customNotification]: [string]) => {
      useSettingsStore
        .getState()
        .addExtraAdditionalNotification(customNotification);
    },
    generateMessage: () => {
      throw new Error("Cannot add custom notifications from client to device");
    },
  },
  /* Play Notification */
  playNotification: {
    pattern: new RegExp(`p(${possibleNotificationsForRegExp})`, "g"),
    handleMessage: ([playNotification]: [string]) => {
      console.log("Successfully played", playNotification);
    },
    generateMessage: (playNotification) => {
      console.log("Playing notification", playNotification);
      return `p${playNotification}`;
    },
  },
};
