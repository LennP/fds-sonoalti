// commands.ts
import useSettingsStore from "@/stores/settingsStore";
import { FDSDevice } from "./webusb";

type Command = {
  pattern: RegExp;
  handleMessage: (values: string[]) => void;
  generateMessage: () => string;
};

type Commands = {
  [key: string]: Command;
};

export const sendStateToDevice = (key: keyof Commands, device: FDSDevice) => {
  const command = COMMANDS[key];
  if (!command) {
    console.error(`Command ${key} not found`);
    return;
  }
  const message = command.generateMessage();
  console.log("Sending", message);
  device.send(new TextEncoder().encode(message));
};

export const COMMANDS: Commands = {
  includePreJumpInfo: {
    pattern: /A([01])/,
    handleMessage: ([value]) =>
      useSettingsStore
        .getState()
        .updateGeneralSetting("includePreJumpInfo", value === "1"),
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const value = state.settings.generalSettings["includePreJumpInfo"]
        ? "1"
        : "0";
      return `A${value}`;
    },
  },
  includePostJumpInfo: {
    pattern: /B([01])/,
    handleMessage: ([value]) =>
      useSettingsStore
        .getState()
        .updateGeneralSetting("includePostJumpInfo", value === "1"),
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const value = state.settings.generalSettings["includePostJumpInfo"]
        ? "1"
        : "0";
      return `B${value}`;
    },
  },
  useMetric: {
    pattern: /C([01])/,
    handleMessage: ([value]) =>
      useSettingsStore
        .getState()
        .updateGeneralSetting("useMetric", value === "1"),
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const value = state.settings.generalSettings.useMetric ? "1" : "0";
      return `C${value}`;
    },
  },
  "ascendSettings.abbreviateReadings": {
    pattern: /D([01])([01])([01])/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "ascendSettings",
        "abbreviateReadings",
        value1 === "1",
      );
      updatePresetStageSetting(
        1,
        "ascendSettings",
        "abbreviateReadings",
        value2 === "1",
      );
      updatePresetStageSetting(
        2,
        "ascendSettings",
        "abbreviateReadings",
        value3 === "1",
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 = state.settings.presetSettings[0].ascendSettings
        .abbreviateReadings
        ? "1"
        : "0";
      const val2 = state.settings.presetSettings[1].ascendSettings
        .abbreviateReadings
        ? "1"
        : "0";
      const val3 = state.settings.presetSettings[2].ascendSettings
        .abbreviateReadings
        ? "1"
        : "0";
      return `D${val1}${val2}${val3}`;
    },
  },
  "freefallSettings.abbreviateReadings": {
    pattern: /E([01])([01])([01])/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "freefallSettings",
        "abbreviateReadings",
        value1 === "1",
      );
      updatePresetStageSetting(
        1,
        "freefallSettings",
        "abbreviateReadings",
        value2 === "1",
      );
      updatePresetStageSetting(
        2,
        "freefallSettings",
        "abbreviateReadings",
        value3 === "1",
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 = state.settings.presetSettings[0].freefallSettings
        .abbreviateReadings
        ? "1"
        : "0";
      const val2 = state.settings.presetSettings[1].freefallSettings
        .abbreviateReadings
        ? "1"
        : "0";
      const val3 = state.settings.presetSettings[2].freefallSettings
        .abbreviateReadings
        ? "1"
        : "0";
      return `E${val1}${val2}${val3}`;
    },
  },
  "canopySettings.abbreviateReadings": {
    pattern: /F([01])([01])([01])/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "canopySettings",
        "abbreviateReadings",
        value1 === "1",
      );
      updatePresetStageSetting(
        1,
        "canopySettings",
        "abbreviateReadings",
        value2 === "1",
      );
      updatePresetStageSetting(
        2,
        "canopySettings",
        "abbreviateReadings",
        value3 === "1",
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 = state.settings.presetSettings[0].canopySettings
        .abbreviateReadings
        ? "1"
        : "0";
      const val2 = state.settings.presetSettings[1].canopySettings
        .abbreviateReadings
        ? "1"
        : "0";
      const val3 = state.settings.presetSettings[2].canopySettings
        .abbreviateReadings
        ? "1"
        : "0";
      return `F${val1}${val2}${val3}`;
    },
  },
  /* Announcement frequency */
  "ascendSettings.announcementFrequency": {
    pattern: /G(\d{4})(\d{4})(\d{4})/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "ascendSettings",
        "announcementFrequency",
        parseInt(value1, 10),
      );
      updatePresetStageSetting(
        1,
        "ascendSettings",
        "announcementFrequency",
        parseInt(value2, 10),
      );
      updatePresetStageSetting(
        2,
        "ascendSettings",
        "announcementFrequency",
        parseInt(value3, 10),
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 =
        state.settings.presetSettings[0].ascendSettings.announcementFrequency;
      const val2 =
        state.settings.presetSettings[1].ascendSettings.announcementFrequency;
      const val3 =
        state.settings.presetSettings[2].ascendSettings.announcementFrequency;
      const formatValue = (value: number) => value.toString().padStart(4, "0");
      return `G${formatValue(val1)}${formatValue(val2)}${formatValue(val3)}`;
    },
  },
  "freefallSettings.announcementFrequency": {
    pattern: /H(\d{4})(\d{4})(\d{4})/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "freefallSettings",
        "announcementFrequency",
        parseInt(value1, 10),
      );
      updatePresetStageSetting(
        1,
        "freefallSettings",
        "announcementFrequency",
        parseInt(value2, 10),
      );
      updatePresetStageSetting(
        2,
        "freefallSettings",
        "announcementFrequency",
        parseInt(value3, 10),
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 =
        state.settings.presetSettings[0].freefallSettings.announcementFrequency;
      const val2 =
        state.settings.presetSettings[1].freefallSettings.announcementFrequency;
      const val3 =
        state.settings.presetSettings[2].freefallSettings.announcementFrequency;
      const formatValue = (value: number) => value.toString().padStart(4, "0");
      return `H${formatValue(val1)}${formatValue(val2)}${formatValue(val3)}`;
    },
  },
  "canopySettings.announcementFrequency": {
    pattern: /I(\d{4})(\d{4})(\d{4})/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "canopySettings",
        "announcementFrequency",
        parseInt(value1, 10),
      );
      updatePresetStageSetting(
        1,
        "canopySettings",
        "announcementFrequency",
        parseInt(value2, 10),
      );
      updatePresetStageSetting(
        2,
        "canopySettings",
        "announcementFrequency",
        parseInt(value3, 10),
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 =
        state.settings.presetSettings[0].canopySettings.announcementFrequency;
      const val2 =
        state.settings.presetSettings[1].canopySettings.announcementFrequency;
      const val3 =
        state.settings.presetSettings[2].canopySettings.announcementFrequency;
      const formatValue = (value: number) => value.toString().padStart(4, "0");
      return `I${formatValue(val1)}${formatValue(val2)}${formatValue(val3)}`;
    },
  },
  /* Announce altitude and speed */
  "ascendSettings.announceAltitude": {
    pattern: /J([01])([01])([01])/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "ascendSettings",
        "announceAltitude",
        value1 === "1",
      );
      updatePresetStageSetting(
        1,
        "ascendSettings",
        "announceAltitude",
        value2 === "1",
      );
      updatePresetStageSetting(
        2,
        "ascendSettings",
        "announceAltitude",
        value3 === "1",
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 = state.settings.presetSettings[0].ascendSettings
        .announceAltitude
        ? "1"
        : "0";
      const val2 = state.settings.presetSettings[1].ascendSettings
        .announceAltitude
        ? "1"
        : "0";
      const val3 = state.settings.presetSettings[2].ascendSettings
        .announceAltitude
        ? "1"
        : "0";
      return `J${val1}${val2}${val3}`;
    },
  },
  "ascendSettings.announceSpeed": {
    pattern: /K([01])([01])([01])/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "ascendSettings",
        "announceSpeed",
        value1 === "1",
      );
      updatePresetStageSetting(
        1,
        "ascendSettings",
        "announceSpeed",
        value2 === "1",
      );
      updatePresetStageSetting(
        2,
        "ascendSettings",
        "announceSpeed",
        value3 === "1",
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 = state.settings.presetSettings[0].ascendSettings.announceSpeed
        ? "1"
        : "0";
      const val2 = state.settings.presetSettings[1].ascendSettings.announceSpeed
        ? "1"
        : "0";
      const val3 = state.settings.presetSettings[2].ascendSettings.announceSpeed
        ? "1"
        : "0";
      return `K${val1}${val2}${val3}`;
    },
  },
  "freefallSettings.announceAltitude": {
    pattern: /L([01])([01])([01])/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "freefallSettings",
        "announceAltitude",
        value1 === "1",
      );
      updatePresetStageSetting(
        1,
        "freefallSettings",
        "announceAltitude",
        value2 === "1",
      );
      updatePresetStageSetting(
        2,
        "freefallSettings",
        "announceAltitude",
        value3 === "1",
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 = state.settings.presetSettings[0].freefallSettings
        .announceAltitude
        ? "1"
        : "0";
      const val2 = state.settings.presetSettings[1].freefallSettings
        .announceAltitude
        ? "1"
        : "0";
      const val3 = state.settings.presetSettings[2].freefallSettings
        .announceAltitude
        ? "1"
        : "0";
      return `L${val1}${val2}${val3}`;
    },
  },
  "freefallSettings.announceSpeed": {
    pattern: /M([01])([01])([01])/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "freefallSettings",
        "announceSpeed",
        value1 === "1",
      );
      updatePresetStageSetting(
        1,
        "freefallSettings",
        "announceSpeed",
        value2 === "1",
      );
      updatePresetStageSetting(
        2,
        "freefallSettings",
        "announceSpeed",
        value3 === "1",
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 = state.settings.presetSettings[0].freefallSettings
        .announceSpeed
        ? "1"
        : "0";
      const val2 = state.settings.presetSettings[1].freefallSettings
        .announceSpeed
        ? "1"
        : "0";
      const val3 = state.settings.presetSettings[2].freefallSettings
        .announceSpeed
        ? "1"
        : "0";
      return `M${val1}${val2}${val3}`;
    },
  },
  "canopySettings.announceAltitude": {
    pattern: /N([01])([01])([01])/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "canopySettings",
        "announceAltitude",
        value1 === "1",
      );
      updatePresetStageSetting(
        1,
        "canopySettings",
        "announceAltitude",
        value2 === "1",
      );
      updatePresetStageSetting(
        2,
        "canopySettings",
        "announceAltitude",
        value3 === "1",
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 = state.settings.presetSettings[0].canopySettings
        .announceAltitude
        ? "1"
        : "0";
      const val2 = state.settings.presetSettings[1].canopySettings
        .announceAltitude
        ? "1"
        : "0";
      const val3 = state.settings.presetSettings[2].canopySettings
        .announceAltitude
        ? "1"
        : "0";
      return `N${val1}${val2}${val3}`;
    },
  },
  "canopySettings.announceSpeed": {
    pattern: /O([01])([01])([01])/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "canopySettings",
        "announceSpeed",
        value1 === "1",
      );
      updatePresetStageSetting(
        1,
        "canopySettings",
        "announceSpeed",
        value2 === "1",
      );
      updatePresetStageSetting(
        2,
        "canopySettings",
        "announceSpeed",
        value3 === "1",
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 = state.settings.presetSettings[0].canopySettings.announceSpeed
        ? "1"
        : "0";
      const val2 = state.settings.presetSettings[1].canopySettings.announceSpeed
        ? "1"
        : "0";
      const val3 = state.settings.presetSettings[2].canopySettings.announceSpeed
        ? "1"
        : "0";
      return `O${val1}${val2}${val3}`;
    },
  },
  /* From and to altitude activation */
  "ascendSettings.fromAltitude": {
    pattern: /P(\d{5})(\d{5})(\d{5})/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "ascendSettings",
        "fromAltitude",
        parseInt(value1, 10),
      );
      updatePresetStageSetting(
        1,
        "ascendSettings",
        "fromAltitude",
        parseInt(value2, 10),
      );
      updatePresetStageSetting(
        2,
        "ascendSettings",
        "fromAltitude",
        parseInt(value3, 10),
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 = state.settings.presetSettings[0].ascendSettings.fromAltitude;
      const val2 = state.settings.presetSettings[1].ascendSettings.fromAltitude;
      const val3 = state.settings.presetSettings[2].ascendSettings.fromAltitude;
      const formatValue = (value: number) => value.toString().padStart(5, "0");
      return `P${formatValue(val1)}${formatValue(val2)}${formatValue(val3)}`;
    },
  },
  "ascendSettings.toAltitude": {
    pattern: /Q(\d{5})(\d{5})(\d{5})/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "ascendSettings",
        "toAltitude",
        parseInt(value1, 10),
      );
      updatePresetStageSetting(
        1,
        "ascendSettings",
        "toAltitude",
        parseInt(value2, 10),
      );
      updatePresetStageSetting(
        2,
        "ascendSettings",
        "toAltitude",
        parseInt(value3, 10),
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 = state.settings.presetSettings[0].ascendSettings.toAltitude;
      const val2 = state.settings.presetSettings[1].ascendSettings.toAltitude;
      const val3 = state.settings.presetSettings[2].ascendSettings.toAltitude;
      const formatValue = (value: number) => value.toString().padStart(5, "0");
      return `Q${formatValue(val1)}${formatValue(val2)}${formatValue(val3)}`;
    },
  },
  "freefallSettings.fromAltitude": {
    pattern: /R(\d{5})(\d{5})(\d{5})/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "freefallSettings",
        "fromAltitude",
        parseInt(value1, 10),
      );
      updatePresetStageSetting(
        1,
        "freefallSettings",
        "fromAltitude",
        parseInt(value2, 10),
      );
      updatePresetStageSetting(
        2,
        "freefallSettings",
        "fromAltitude",
        parseInt(value3, 10),
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 =
        state.settings.presetSettings[0].freefallSettings.fromAltitude;
      const val2 =
        state.settings.presetSettings[1].freefallSettings.fromAltitude;
      const val3 =
        state.settings.presetSettings[2].freefallSettings.fromAltitude;
      const formatValue = (value: number) => value.toString().padStart(5, "0");
      return `R${formatValue(val1)}${formatValue(val2)}${formatValue(val3)}`;
    },
  },
  "freefallSettings.toAltitude": {
    pattern: /S(\d{5})(\d{5})(\d{5})/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "freefallSettings",
        "toAltitude",
        parseInt(value1, 10),
      );
      updatePresetStageSetting(
        1,
        "freefallSettings",
        "toAltitude",
        parseInt(value2, 10),
      );
      updatePresetStageSetting(
        2,
        "freefallSettings",
        "toAltitude",
        parseInt(value3, 10),
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 = state.settings.presetSettings[0].freefallSettings.toAltitude;
      const val2 = state.settings.presetSettings[1].freefallSettings.toAltitude;
      const val3 = state.settings.presetSettings[2].freefallSettings.toAltitude;
      const formatValue = (value: number) => value.toString().padStart(5, "0");
      return `S${formatValue(val1)}${formatValue(val2)}${formatValue(val3)}`;
    },
  },
  "canopySettings.fromAltitude": {
    pattern: /T(\d{5})(\d{5})(\d{5})/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "canopySettings",
        "fromAltitude",
        parseInt(value1, 10),
      );
      updatePresetStageSetting(
        1,
        "canopySettings",
        "fromAltitude",
        parseInt(value2, 10),
      );
      updatePresetStageSetting(
        2,
        "canopySettings",
        "fromAltitude",
        parseInt(value3, 10),
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 = state.settings.presetSettings[0].canopySettings.fromAltitude;
      const val2 = state.settings.presetSettings[1].canopySettings.fromAltitude;
      const val3 = state.settings.presetSettings[2].canopySettings.fromAltitude;
      const formatValue = (value: number) => value.toString().padStart(5, "0");
      return `T${formatValue(val1)}${formatValue(val2)}${formatValue(val3)}`;
    },
  },
  "canopySettings.toAltitude": {
    pattern: /U(\d{5})(\d{5})(\d{5})/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "canopySettings",
        "toAltitude",
        parseInt(value1, 10),
      );
      updatePresetStageSetting(
        1,
        "canopySettings",
        "toAltitude",
        parseInt(value2, 10),
      );
      updatePresetStageSetting(
        2,
        "canopySettings",
        "toAltitude",
        parseInt(value3, 10),
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 = state.settings.presetSettings[0].canopySettings.toAltitude;
      const val2 = state.settings.presetSettings[1].canopySettings.toAltitude;
      const val3 = state.settings.presetSettings[2].canopySettings.toAltitude;
      const formatValue = (value: number) => value.toString().padStart(5, "0");
      return `U${formatValue(val1)}${formatValue(val2)}${formatValue(val3)}`;
    },
  },
  /* Volume */
  "ascendSettings.volume": {
    pattern: /V(\d{2})(\d{2})(\d{2})/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "ascendSettings",
        "volume",
        parseInt(value1, 10),
      );
      updatePresetStageSetting(
        1,
        "ascendSettings",
        "volume",
        parseInt(value2, 10),
      );
      updatePresetStageSetting(
        2,
        "ascendSettings",
        "volume",
        parseInt(value3, 10),
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 = state.settings.presetSettings[0].ascendSettings.volume;
      const val2 = state.settings.presetSettings[1].ascendSettings.volume;
      const val3 = state.settings.presetSettings[2].ascendSettings.volume;
      const formatValue = (value: number) => value.toString().padStart(2, "0");
      return `V${formatValue(val1)}${formatValue(val2)}${formatValue(val3)}`;
    },
  },
  "freefallSettings.volume": {
    pattern: /W(\d{2})(\d{2})(\d{2})/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "freefallSettings",
        "volume",
        parseInt(value1, 10),
      );
      updatePresetStageSetting(
        1,
        "freefallSettings",
        "volume",
        parseInt(value2, 10),
      );
      updatePresetStageSetting(
        2,
        "freefallSettings",
        "volume",
        parseInt(value3, 10),
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 = state.settings.presetSettings[0].freefallSettings.volume;
      const val2 = state.settings.presetSettings[1].freefallSettings.volume;
      const val3 = state.settings.presetSettings[2].freefallSettings.volume;
      const formatValue = (value: number) => value.toString().padStart(2, "0");
      return `W${formatValue(val1)}${formatValue(val2)}${formatValue(val3)}`;
    },
  },
  "canopySettings.volume": {
    pattern: /X(\d{2})(\d{2})(\d{2})/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "canopySettings",
        "volume",
        parseInt(value1, 10),
      );
      updatePresetStageSetting(
        1,
        "canopySettings",
        "volume",
        parseInt(value2, 10),
      );
      updatePresetStageSetting(
        2,
        "canopySettings",
        "volume",
        parseInt(value3, 10),
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 = state.settings.presetSettings[0].canopySettings.volume;
      const val2 = state.settings.presetSettings[1].canopySettings.volume;
      const val3 = state.settings.presetSettings[2].canopySettings.volume;
      const formatValue = (value: number) => value.toString().padStart(2, "0");
      return `X${formatValue(val1)}${formatValue(val2)}${formatValue(val3)}`;
    },
  },
  /* Freefall Threshold */
  "freefallSettings.freefallThreshold": {
    pattern: /Y(\d{3})(\d{3})(\d{3})/,
    handleMessage: ([value1, value2, value3]) => {
      const updatePresetStageSetting =
        useSettingsStore.getState().updatePresetStageSetting;
      updatePresetStageSetting(
        0,
        "freefallSettings",
        "freefallThreshold",
        parseInt(value1, 10),
      );
      updatePresetStageSetting(
        1,
        "freefallSettings",
        "freefallThreshold",
        parseInt(value2, 10),
      );
      updatePresetStageSetting(
        2,
        "freefallSettings",
        "freefallThreshold",
        parseInt(value3, 10),
      );
    },
    generateMessage: () => {
      const state = useSettingsStore.getState();
      const val1 =
        state.settings.presetSettings[0].freefallSettings.freefallThreshold;
      const val2 =
        state.settings.presetSettings[1].freefallSettings.freefallThreshold;
      const val3 =
        state.settings.presetSettings[2].freefallSettings.freefallThreshold;
      const formatValue = (value: number) => value.toString().padStart(3, "0");
      return `Y${formatValue(val1)}${formatValue(val2)}${formatValue(val3)}`;
    },
  },
};
