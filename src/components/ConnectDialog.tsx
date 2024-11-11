// ConnectDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FDSDevice, getFDSDevices } from "@/utils/webusb";
import React, { useEffect, useState } from "react";
import { FaUsb } from "react-icons/fa";
import PuffLoader from "react-spinners/PuffLoader";
import { LoadingButton } from "./ui/loading-button";

enum ConnectionButtonState {
  Disconnected = "Disconnected",
  Connecting = "Connecting",
  LoadingSettings = "LoadingSettings",
  Connected = "Connected",
}

interface ConnectDialogProps {
  isOpen: boolean;
  onAfterConnect: (device: FDSDevice) => void;
}

const DEVICE_SCAN_INTERVAL: number = 200; // milliseconds

const ConnectDialog: React.FC<ConnectDialogProps> = ({
  isOpen,
  onAfterConnect,
}) => {
  const [connectionState, setConnectionState] = useState<ConnectionButtonState>(
    ConnectionButtonState.Disconnected,
  );
  const [error, setError] = useState<string | null>(null);
  const [fdsDevices, setFdsDevices] = useState<FDSDevice[]>([]);

  // Function to fetch FDS devices
  const fetchFDSDevices = async () => {
    try {
      const devices = await getFDSDevices(); // Ensure getFDSDevices returns SerialPort[]
      setFdsDevices(devices);
    } catch (err) {
      console.error("Error fetching FDS devices:", err);
      // Optionally, set an error state here if fetching devices can fail
    }
  };

  // Set up interval to fetch devices
  useEffect(() => {
    if (isOpen) {
      // Fetch devices immediately when dialog opens
      fetchFDSDevices();

      const intervalId = setInterval(() => {
        fetchFDSDevices();
      }, DEVICE_SCAN_INTERVAL);

      // Cleanup scan interval on unmount or when dialog closes
      return () => clearInterval(intervalId);
    }
  }, [isOpen]);

  const connect = async (device: FDSDevice) => {
    setConnectionState(ConnectionButtonState.Connecting);
    setError(null);
    try {
      await device.connect(); // Attempt to establish a connection

      setConnectionState(ConnectionButtonState.LoadingSettings);
      onAfterConnect(device);
    } catch (err) {
      setError("Failed to connect to device. Try plugging it back in.");
      console.error(err);
      setConnectionState(ConnectionButtonState.Disconnected);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="[&>button]:hidden focus:outline-none ring-0">
        <DialogHeader className="flex flex-col items-center mb-6">
          <DialogTitle className="text-center text-xl mb-2">
            Connect to Altimeter
          </DialogTitle>
          <div className="text-sm text-center text-gray-800 space-y-2">
            <ol className="list-decimal list-inside">
              <li>
                Hold down the USB button&nbsp;
                <FaUsb className="inline-block bg-black text-white p-1 rounded-lg text-2xl" />{" "}
                on the altimeter until you hear a chime
              </li>
              <li>
                Use a USB data cable to plug the altimeter into your
                computer&nbsp;
                <span className="font-bold">
                  (ensure it is a data cable and not a charge-only cable, which
                  is a common mistake)
                </span>
              </li>
            </ol>
          </div>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {error && (
          <div className="mb-4 text-red-600 text-center font-bold">{error}</div>
        )}
        <div className="mb-4">
          {fdsDevices.length === 0 ? (
            <div className="flex flex-col items-center text-[#222222]">
              Searching...
              <PuffLoader
                className="mt-1"
                color="#222222"
                size={30}
                speedMultiplier={1}
              />
            </div>
          ) : (
            <ul>
              {fdsDevices.map((device, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between mb-2"
                >
                  <div className="flex flex-col items-center flex-1">
                    <p>{device.device.productName}</p>
                    <p className="text-xs">({device.device.serialNumber})</p>
                  </div>
                  <LoadingButton
                    onClick={() => connect(device)}
                    disabled={
                      connectionState === ConnectionButtonState.Connecting ||
                      connectionState === ConnectionButtonState.LoadingSettings
                    }
                    loading={[
                      ConnectionButtonState.Connecting,
                      ConnectionButtonState.LoadingSettings,
                    ].includes(connectionState)}
                  >
                    {
                      // @ts-expect-error has default value
                      {
                        [ConnectionButtonState.Connecting]: "Connecting",
                        [ConnectionButtonState.LoadingSettings]: "Loading",
                        [ConnectionButtonState.Connected]: "Connected",
                      }[connectionState] || "Connect"
                    }
                  </LoadingButton>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectDialog;
