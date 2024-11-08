// Configurator.tsx
import General from "@/components/General";
import Preset from "@/components/Preset";
import PresetTabs from "@/components/PresetTabs";
import { Button } from "@/components/ui/button";
import useWindowWidth from "@/hooks/useWindowWidth";
import useSettingsStore from "@/stores/settingsStore"; // Import the store
import {
  FreefallStageSettings,
  GeneralSettings,
  GeneralSettingsTypes,
  PresetSettings,
  PresetSettingsTypes,
  Settings,
  StageSettings,
  StageSettingsTypes,
} from "@/types";
import { downloadFile, parseYAMLFile, toYAML } from "@/utils/file";
import { FDSDevice } from "@/utils/webusb";
import React, { useRef, useState } from "react";
import { FaFileExport, FaFileImport } from "react-icons/fa";

const SETTINGS_FILE_NAME: string = "config.yaml";
const PRESET_TAB_NAMES: string[] = ["Preset 1", "Preset 2", "Preset 3"];
const MOBILE_BREAKPOINT: number = 768; // Define your breakpoint (e.g., 768px for mobile)

interface ConfiguratorProps {
  device: FDSDevice | null;
  dialogOpen: boolean;
  deblurOnConnect: boolean;
}

const Configurator: React.FC<ConfiguratorProps> = ({
  device,
  dialogOpen,
  deblurOnConnect = false,
}) => {
  const {
    settings,
    setSettings,
    updateGeneralSetting,
    updatePresetSetting,
    updatePresetStageSetting,
  } = useSettingsStore();

  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const fileInputImportRef = useRef<HTMLInputElement>(null);

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
      // Optionally, display an error message to the user
    }
  };

  const handleSettingsExport = (
    _: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    downloadFile(toYAML<Settings>(settings), SETTINGS_FILE_NAME);
  };

  // Use the custom hook to get the current window width
  const width = useWindowWidth();
  const isMobile = width < MOBILE_BREAKPOINT;

  // Handle incoming data from device
  // useEffect(() => {
  //   if (!device) return;

  //   // Register handlers
  //   device.onReceive = (data: DataView) => {
  //     const text: string = new TextDecoder().decode(data).trim();
  //     console.log('Received command:', text)
  //     let matched = false;
  //     for (const command_str in COMMANDS) {
  //       const match = COMMANDS[command_str].pattern.exec(text);
  //       if (match) {
  //         COMMANDS[command_str].handleMessage(match.slice(1));
  //         matched = true;
  //         // break;
  //       }
  //     }
  //     if (text.includes("end-settings")) {
  //       matched = true;
  //       // Handle end-settings command
  //     }
  //     if (!matched) {
  //       console.warn('Unknown command received:', text);
  //     }
  //   };
  //   device.onReceiveError = (error) => {
  //     console.error("Receive Error:", error);
  //   };

  //   // Cleanup handlers
  //   return () => {
  //     device.onReceive = () => {};
  //     device.onReceiveError = () => {};
  //   };
  // }, [device]);

  return (
    <div
      className="container mx-auto p-4 transition-opacity duration-500"
      style={{
        opacity: !dialogOpen ? 100 : deblurOnConnect ? 0 : 100,
      }}
    >
      {/* Preset Tabs and Export/Import Buttons */}
      <div className="flex justify-between items-center mb-4">
        <img
          className="w-32"
          src="https://freefalldatasystems.com/image/original_logo_w_text_no_blur.svg"
          alt="Freefall Data Systems Logo"
        />
        <div className="float-right">
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
        onChange={(key: keyof GeneralSettings, value: GeneralSettingsTypes) =>
          updateGeneralSetting(key, value, device)
        }
      />

      {/* Preset Tabs */}
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

      {/* Presets */}
      {isMobile ? (
        <Preset
          presetNumber={selectedPreset + 1}
          presetSettings={settings.presetSettings[selectedPreset]}
          onChange={(key: keyof PresetSettings, value: PresetSettingsTypes) =>
            updatePresetSetting(selectedPreset, key, value, device)
          }
          onStageChange={(
            stageKey: "ascendSettings" | "freefallSettings" | "canopySettings",
            settingKey: keyof StageSettings | keyof FreefallStageSettings,
            value: StageSettingsTypes,
          ) =>
            updatePresetStageSetting(
              selectedPreset,
              stageKey,
              settingKey,
              value,
              device,
            )
          }
        />
      ) : (
        // Render all three presets on larger screens
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {settings.presetSettings.map((preset, presetIndex) => (
            <Preset
              key={presetIndex}
              presetNumber={presetIndex + 1}
              presetSettings={preset}
              onChange={(
                key: keyof PresetSettings,
                value: PresetSettingsTypes,
              ) => updatePresetSetting(presetIndex, key, value, device)}
              onStageChange={(
                stageKey:
                  | "ascendSettings"
                  | "freefallSettings"
                  | "canopySettings",
                settingKey: keyof StageSettings | keyof FreefallStageSettings,
                value: StageSettingsTypes,
              ) =>
                updatePresetStageSetting(
                  presetIndex,
                  stageKey,
                  settingKey,
                  value,
                  device,
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Configurator;
