// commands.ts
import useSettingsStore from "@/stores/settingsStore";
import {
  AdditionalNotificationChange,
  GeneralSettingsKey,
  PresetSettingsKey,
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

function createPresetStageBooleanCommand(
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

function createPresetPolarNumberCommand(
  letter: string,
  settingKey: PresetSettingsKey,
  valueLength: number,
): Command<[string, string, string], [number, number, number]> {
  const pattern = new RegExp(
    `${letter}` + `([+-]?${`\\d{${valueLength}}`})`.repeat(3),
  );
  return {
    pattern,
    handleMessage: (values) =>
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

function createPresetStageNumberCommand(
  letter: string,
  stage: StageSettingsID,
  settingKey: StageSettingsKey,
  valueLength: number,
): Command<[string, string, string], [number, number, number]> {
  const pattern = new RegExp(
    `${letter}` + `(${`\\d{${valueLength}}`})`.repeat(3),
  );
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
  "freefallSettings.freefallThreshold": createPresetStageNumberCommand(
    "Y",
    "freefallSettings",
    "freefallThreshold",
    3,
  ),
  dropzoneOffset: createPresetPolarNumberCommand("Z", "dropzoneOffset", 5),
  /* Additional Notification */
  notification: {
    pattern: /([+-])([2-4])([afc])(\d{5})([\w ]+)/, //  /([+-])([2-4])([afc])(\d{5})([\w ]+)/
    handleMessage: ([operation, preset, stage, altitude, notificationName]: [
      string,
      string,
      string,
      string,
      string,
    ]) => {
      console.log(
        "Handling notificiation message:",
        operation,
        preset,
        stage,
        altitude,
        notificationName,
      );
      if (operation === "-") {
        console.log("Remove operation request");
        return;
      }
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

      useSettingsStore
        .getState()
        .addPresetStageNotification(presetIndex, stageKey, {
          altitude: altitudeInt,
          notification: notificationName,
        });
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
      return `+${presetIndexOffset}${stageChar}${altitudeStr}${notification}`;
    },
  },
};
