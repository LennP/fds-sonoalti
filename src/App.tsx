// App.tsx
import Configurator from "@/components/Configurator";
import ConnectDialog from "@/components/ConnectDialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import UnsupportedBrowserDialog from "@/components/UnsupportedBrowserDialog";
import { browserSupportsWebUSB, FDSDevice } from "@/utils/webusb";
import { useEffect, useRef, useState } from "react";
import useSettingsStore from "./stores/settingsStore";
import { COMMANDS } from "./utils/commands";

const processBuffer = (buffer: string): [string, boolean, boolean] => {
  let matchedSomeCommand = false;
  let startOfSettings = false;
  let endOfSettings = false;

  // Special handling for beginning of settings, e.g. "n41"
  const startSettingsMatch = buffer.match(/n[0-9]{1,2}/);
  if (startSettingsMatch) {
    matchedSomeCommand = true;
    startOfSettings = true;

    // Remove the matched "nXX" from the buffer
    buffer = buffer.replace(startSettingsMatch[0], "");
  }

  // Iterate over each command pattern defined in COMMANDS
  for (const commandID in COMMANDS) {
    const { pattern, handleMessage } = COMMANDS[commandID];
    let regex: RegExp = pattern;

    // Ensure the regex has the global flag 'g' to find all matches
    if (!pattern.flags.includes("g")) {
      console.warn(
        `Pattern for "${commandID}" does not have the global flag 'g'. Adding it automatically.`,
      );
      const newFlags = pattern.flags.includes("g")
        ? pattern.flags
        : pattern.flags + "g";
      try {
        regex = new RegExp(pattern.source, newFlags);
      } catch (error) {
        console.error(
          `Failed to add 'g' flag to pattern for "${commandID}". Please check the regex syntax.`,
          error,
        );
        continue;
      }
    }

    // Use matchAll to retrieve all matches for the current pattern
    const matches = buffer.matchAll(regex);

    for (const match of matches) {
      if (match.index !== undefined) {
        matchedSomeCommand = true;

        // Extract the matched command
        const matchedCommand = match[0];
        console.log(" > Matched command:", matchedCommand);

        // Call the handler with captured groups (excluding the full match)
        handleMessage(match.slice(1));

        // Remove the matched command from the buffer
        // console.log("Old buffer:", buffer);
        buffer = buffer.replace(matchedCommand, "");
        // console.log("New buffer:", buffer);
      }
    }
  }

  // Special handling for "end-settings" or "end settings" command
  const endSettingsMatch = buffer.match(/end([- ])settings/);
  if (endSettingsMatch) {
    matchedSomeCommand = true;
    endOfSettings = true;

    // Add (Altitude) notification only if "end-settings" (firmware >= 1.1)
    const separator = endSettingsMatch[1];
    if (separator === "-") {
      useSettingsStore.getState().addExtraAdditionalNotification("(Altitude)");
    }

    // Remove the matched "end-settings" or "end settings" from the buffer
    buffer = buffer.replace(endSettingsMatch[0], "");
  }

  if (!matchedSomeCommand) {
    console.warn("No complete command matched in the buffer:", buffer);
  }

  return [buffer, endOfSettings, startOfSettings];
};

function App() {
  const [receivingSettings, setReceivingSettings] = useState<boolean>(false);
  const [device, setDevice] = useState<FDSDevice | null>(null);
  const deviceRef = useRef<FDSDevice | null>(null);

  const [browserIsSupported, setBrowserIsSupported] = useState<boolean | null>(
    null,
  );

  const bufferRef = useRef<string>("");

  const handleConnect = (device: FDSDevice) => {
    deviceRef.current = device;
    bufferRef.current = "";

    if (browserIsSupported) {
      navigator.usb.ondisconnect = (event: USBConnectionEvent) => {
        console.log(
          `Device physically disconnected (${event.device.serialNumber})`,
        );
        if (
          !deviceRef.current ||
          event.device.serialNumber !== deviceRef.current.device.serialNumber
        )
          return;
        setDevice(null);
        deviceRef.current = null;
        setReceivingSettings(false);
      };
      device.onDisconnect = (device: FDSDevice) => {
        console.log(
          `Device manually disconnected (${device.device.serialNumber})`,
        );
        setDevice(null);
        deviceRef.current = null;
        setReceivingSettings(false);
      };
      device.onReceive = (dataView: DataView) => {
        const data = new TextDecoder().decode(dataView);
        console.log("Received data from device:", data);
        bufferRef.current += data;
        console.log(" > Updated buffer:", bufferRef.current);

        const [newBuffer, endOfSettingsReceived, startOfSettingsReceived] =
          processBuffer(bufferRef.current);
        bufferRef.current = newBuffer;
        // If end of settings is received, set the device
        if (endOfSettingsReceived) setDevice(device);
        if (startOfSettingsReceived) setReceivingSettings(true);
      };
      device.onReceiveError = (error) => console.error("Receive Error:", error);
    }
  };

  useEffect(() => {
    const browserSupported = browserSupportsWebUSB();
    setBrowserIsSupported(browserSupported);
  }, []);

  return (
    <TooltipProvider>
      {/* Unsupported Browser Dialog */}
      <UnsupportedBrowserDialog isOpen={browserIsSupported === false} />

      {/* Connect Device Dialog */}
      <ConnectDialog
        isOpen={!device && browserIsSupported === true}
        receivingSettings={receivingSettings}
        onAfterConnect={handleConnect}
      />

      {/* Main Configurator */}
      <Configurator
        device={device}
        dialogOpen={!browserIsSupported || !device}
        deblurOnConnect
      />
    </TooltipProvider>
  );
}

export default App;
