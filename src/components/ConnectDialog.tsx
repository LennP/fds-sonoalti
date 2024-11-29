// ConnectDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FDSDevice,
  getPairedFDSDevices,
  requestFDSDevice,
} from "@/utils/webusb";
import React, { useEffect, useState } from "react";
import { FaUsb } from "react-icons/fa6";
import { Button } from "./ui/button";
import { LoadingButton } from "./ui/loading-button";

enum ConnectionButtonState {
  DISCONNECTED = "Connect",
  CONNECTING = "Connecting",
  LOADING_SETTINGS = "Loading",
  CONNECTED = "Connected",
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
  const [connectionState, setConnectionState] = useState<
    [FDSDevice, ConnectionButtonState] | null
  >(null);
  const [pairedFDSDevices, setPairedFDSDevices] = useState<FDSDevice[]>([]);

  const [error, _setError] = useState<string | null>(null);
  const [showError, _setShowError] = useState<boolean>(false);

  const flashError = async (error: string) => {
    _setError(error);
    _setShowError(true);
    setTimeout(() => _setShowError(false), 1000);
  };

  // Function to fetch FDS devices
  const fetchFDSDevices = async () => {
    try {
      const devices = await getPairedFDSDevices();
      setPairedFDSDevices(devices);
    } catch (err) {
      console.error("Error fetching FDS devices:", err);
    }
  };

  const pairFDSDevice = async () => {
    requestFDSDevice().catch(() => {});
  };

  // Set up interval to fetch devices
  useEffect(() => {
    if (isOpen) {
      // Set connection state to null when dialog opens
      setConnectionState(null);

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
    setConnectionState([device, ConnectionButtonState.CONNECTING]);
    try {
      await device.connect(); // Attempt to establish a connection

      setConnectionState([device, ConnectionButtonState.LOADING_SETTINGS]);
      onAfterConnect(device);
    } catch (err) {
      flashError("Failed to connect to device. Try plugging it back in.");
      console.error(err);
      setConnectionState([device, ConnectionButtonState.DISCONNECTED]);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="[&>button]:hidden focus:outline-none ring-0">
        <DialogHeader className="flex flex-col items-center mb-2">
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
        <div
          style={{
            opacity: showError ? 1 : 0,
          }}
          className="text-red-600 text-center font-bold text-sm mb-2 transition-opacity h-3 ease-in-out duration-1000"
        >
          {error}
        </div>
        <div className="mb-1">
          {pairedFDSDevices.length !== 0 && (
            <ul>
              {pairedFDSDevices.map((fdsDevice, fdsDeviceIndex) => (
                <li
                  key={fdsDeviceIndex}
                  className="flex items-center justify-between mb-6"
                >
                  <div className="flex flex-col items-center mr-8">
                    <p>{fdsDevice.device.productName}</p>
                    <p className="text-xs">({fdsDevice.device.serialNumber})</p>
                  </div>
                  <LoadingButton
                    className="flex-1"
                    onClick={() => connect(fdsDevice)}
                    disabled={
                      connectionState !== null &&
                      [
                        ConnectionButtonState.CONNECTING,
                        ConnectionButtonState.LOADING_SETTINGS,
                      ].includes(connectionState[1])
                    }
                    loading={
                      connectionState !== null &&
                      connectionState[0].device.serialNumber ===
                        fdsDevice.device.serialNumber &&
                      [
                        ConnectionButtonState.CONNECTING,
                        ConnectionButtonState.LOADING_SETTINGS,
                      ].includes(connectionState[1])
                    }
                  >
                    {connectionState !== null &&
                    connectionState[0].device.serialNumber ===
                      fdsDevice.device.serialNumber
                      ? connectionState[1]
                      : "Connect"}
                  </LoadingButton>
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-col items-center text-[#222222]">
            <Button
              className="w-full focus-visible:ring-0"
              onClick={pairFDSDevice}
              variant={pairedFDSDevices.length > 0 ? "secondary" : "default"}
            >
              <FaUsb></FaUsb>
              Pair {pairedFDSDevices.length > 0 ? "other" : ""} altimeter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectDialog;
