// Configurator.tsx
import General from "@/components/General";
import Preset from "@/components/Preset";
import PresetTabs from "@/components/PresetTabs";
import { Button } from "@/components/ui/button";
import useWindowWidth from "@/hooks/useWindowWidth";
import useSettingsStore from "@/stores/settingsStore";
import {
  AdditionalNotification,
  FreefallStageSettings,
  GeneralSettings,
  GeneralSettingsValue,
  PresetSettings,
  PresetSettingsValue,
  Settings,
  StageSettings,
  StageSettingsID,
  StageSettingsValue,
} from "@/types";
import { downloadFile, parseYAMLFile, toYAML } from "@/utils/file";
import { FDSDevice } from "@/utils/webusb";
import React, { useMemo, useRef, useState } from "react";
import { FaFileExport, FaFileImport } from "react-icons/fa";

const SETTINGS_FILE_NAME: string = "config.yaml";
const PRESET_TAB_NAMES: string[] = ["Preset 1", "Preset 2", "Preset 3"];
const MOBILE_BREAKPOINT: number = 768; // Mobile breakpoint, e.g. 768px

interface ConfiguratorProps {
  device: FDSDevice | null;
  dialogOpen: boolean;
  deblurOnConnect: boolean;
}

const Configurator = ({
  device,
  dialogOpen,
  deblurOnConnect = false,
}: ConfiguratorProps) => {
  const {
    settings,
    setSettings,
    updateGeneralSetting,
    updatePresetSetting,
    updatePresetStageSetting,
    addPresetStageNotification,
    removePresetStageNotification,
    playNotification,
  } = useSettingsStore();

  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const fileInputImportRef = useRef<HTMLInputElement | null>(null);

  const handleSettingsImport = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    try {
      const file = event.target.files?.[0];
      if (!file) throw new Error("No file selected");
      const importedSettings = await parseYAMLFile<Settings>(file);
      setSettings(importedSettings);
    } catch (error) {
      console.error("Import failed:", error);
    }
  };

  const handleSettingsExport = (
    _: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    downloadFile(toYAML<Settings>(settings), SETTINGS_FILE_NAME);
  };

  const handleDisconnect = async (_: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Disconnecting...");
    await device?.disconnect();
  };

  // Use the custom hook to get the current window width
  const width = useWindowWidth();
  const isMobile = width < MOBILE_BREAKPOINT;

  /**
   * Generates the props for a Preset component based on the preset index.
   * This helps in avoiding duplication of callback functions.
   *
   * @param presetIndex - The index of the preset.
   * @returns An object containing all the necessary props for the Preset component.
   */
  const generatePresetProps = (presetIndex: number) => ({
    presetNumber: presetIndex + 1,
    presetSettings: settings.presetSettings[presetIndex],
    onPresetChange: (key: keyof PresetSettings, value: PresetSettingsValue) =>
      updatePresetSetting(presetIndex, key, value, device),
    onPresetStageChange: (
      stageKey: StageSettingsID,
      settingKey: keyof StageSettings | keyof FreefallStageSettings,
      value: StageSettingsValue,
    ) =>
      updatePresetStageSetting(
        presetIndex,
        stageKey,
        settingKey,
        value,
        device,
      ),
    onPresetStageAddNotification: (
      stageKey: StageSettingsID,
      additionalNotification: AdditionalNotification,
    ) =>
      addPresetStageNotification(
        presetIndex,
        stageKey,
        additionalNotification,
        device,
      ),
    onPresetStageRemoveNotification: (
      stageKey: StageSettingsID,
      additionalNotification: AdditionalNotification,
    ) =>
      removePresetStageNotification(
        presetIndex,
        stageKey,
        additionalNotification,
        device,
      ),
    onPlayNotification: (notification: string) =>
      playNotification(notification, device),
  });

  /**
   * Determines which presets to render based on the device width.
   * - On mobile: Renders only the selected preset.
   * - On desktop: Renders all presets.
   */
  const presetsToRender = useMemo(() => {
    if (isMobile) {
      return [selectedPreset];
    }
    return settings.presetSettings.map((_, index) => index);
  }, [isMobile, selectedPreset, settings.presetSettings]);

  return (
    <div
      className="container mx-auto p-4 transition-opacity duration-500"
      style={{
        opacity: !dialogOpen ? 100 : deblurOnConnect ? 0 : 100,
      }}
    >
      {/* Preset Tabs and Export/Import Buttons */}
      <div className="flex justify-between items-center mb-4">
        {/* <img
          className="w-32"
          src="https://freefalldatasystems.com/image/original_logo_w_text_no_blur.svg"
          alt="Freefall Data Systems Logo"
        /> */}
        <div className="flex">
          {/* Export */}
          <Button
            disabled={!device}
            onClick={handleDisconnect}
            variant="destructive"
            className="mr-2"
          >
            Disconnect
          </Button>
          {/* Export */}
          <Button onClick={handleSettingsExport} className="mr-2">
            <FaFileExport className="mr-2" />
            Export
          </Button>
          {/* Import */}
          <Button
            onClick={() =>
              fileInputImportRef.current && fileInputImportRef.current.click()
            }
          >
            <FaFileImport className="mr-2" />
            Import
          </Button>
          <input
            type="file"
            accept=".yaml,.yml"
            ref={fileInputImportRef}
            onChange={handleSettingsImport}
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* Initial Settings */}
      <General
        generalSettings={settings.generalSettings}
        onChange={(key: keyof GeneralSettings, value: GeneralSettingsValue) =>
          updateGeneralSetting(key, value, device)
        }
      />

      {/* Preset Tabs for Mobile */}
      {isMobile && (
        <div className="flex justify-center mb-2">
          <PresetTabs
            presets={PRESET_TAB_NAMES}
            selectedPreset={selectedPreset}
            onSelectPreset={(presetIndex: number) => {
              setSelectedPreset(presetIndex);
            }}
          />
        </div>
      )}

      {/* Presets Rendering */}
      {isMobile ? (
        <Preset {...generatePresetProps(selectedPreset)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {presetsToRender.map((presetIndex) => (
            <Preset key={presetIndex} {...generatePresetProps(presetIndex)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Configurator;
