// App.tsx
import Configurator from "@/components/Configurator";
import ConnectDialog from "@/components/ConnectDialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import UnsupportedBrowserDialog from "@/components/UnsupportedBrowserDialog";
import { browserSupportsWebUSB, FDSDevice } from "@/utils/webusb";
import { useEffect, useRef, useState } from "react";
import { COMMANDS } from "./utils/commands";

function App() {
  const [device, setDevice] = useState<FDSDevice | null>(null);
  const deviceRef = useRef<FDSDevice | null>(null);

  const [browserIsSupported, setBrowserIsSupported] = useState<boolean>(true);

  const handleConnect = (device: FDSDevice) => {
    deviceRef.current = device;

    if (browserIsSupported) {
      navigator.usb.ondisconnect = (event: USBConnectionEvent) => {
        if (
          !deviceRef.current ||
          event.device.serialNumber !== deviceRef.current.device.serialNumber
        )
          return;
        setDevice(null);
        deviceRef.current = null;
      };
      device.onReceive = (data: DataView) => {
        const text: string = new TextDecoder().decode(data).trim();
        console.log("Received data from device:", text);
        let matched = false;
        for (const command_str in COMMANDS) {
            const { pattern, handleMessage }: {pattern: RegExp, handleMessage: (groups: string[]) => void} = COMMANDS[command_str];
            let regex: RegExp = pattern;
      
            // Check if the pattern has the 'g' flag
            if (!pattern.flags.includes('g')) {
              console.warn(
                `Pattern for "${command_str}" does not have the global flag 'g'. Adding it automatically.`
              );
              const newFlags = pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g';
              try {
                regex = new RegExp(pattern.source, newFlags);
              } catch (error) {
                console.error(
                  `Failed to add 'g' flag to pattern for "${command_str}". Please check the regex syntax.`,
                  error
                );
                continue;
              }
            }
      
            // Use matchAll to retrieve all matches for the current pattern
            const matches = text.matchAll(regex);
      
            for (const match of matches) {
              // Call handleMessage with captured groups (excluding the full match)
              handleMessage(match.slice(1));
              matched = true;
            }
        }
        if (text.includes("end-settings")) {
          matched = true;
          // Only set the device after info has been received
          setDevice(device);
        }
        if (!matched) console.warn("Unknown command received:", text);
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
      <UnsupportedBrowserDialog isOpen={!browserIsSupported} />

      {/* Connect Device Dialog */}
      <ConnectDialog
        isOpen={!device && browserIsSupported}
        // isOpen={false}
        onAfterConnect={handleConnect}
      />

      {/* Main Configurator */}
      <Configurator
        device={device}
        dialogOpen={!browserIsSupported || !device}
        deblurOnConnect={false}
      />
    </TooltipProvider>
  );
}

export default App;
