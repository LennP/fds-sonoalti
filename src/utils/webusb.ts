export class FDSDevice {
  device: USBDevice;
  private interfaceNumber: number | null;
  private endpointIn: number | null;
  private endpointOut: number | null;
  public onReceive: ((data: DataView) => void) | null;
  public onReceiveError: ((error: any) => void) | null;

  constructor(device: USBDevice) {
    this.device = device;
    this.interfaceNumber = null;
    this.endpointIn = null;
    this.endpointOut = null;
    this.onReceive = null; // Callback for received data
    this.onReceiveError = null; // Callback for errors
  }

  async connect(): Promise<void> {
    console.log("Connecting");
    await this.device.open();

    if (this.device.configuration === null) {
      await this.device.selectConfiguration(1);
    }

    const interfaces = this.device.configuration?.interfaces;

    if (!interfaces) {
      throw new Error("Device has no interfaces");
    }

    interfaces.forEach((iface: USBInterface) => {
      iface.alternates.forEach((alternate: USBAlternateInterface) => {
        if (alternate.interfaceClass === 0xff) {
          this.interfaceNumber = iface.interfaceNumber;
          alternate.endpoints.forEach((endpoint: USBEndpoint) => {
            if (endpoint.direction === "in") {
              this.endpointIn = endpoint.endpointNumber;
            } else if (endpoint.direction === "out") {
              this.endpointOut = endpoint.endpointNumber;
            }
          });
        }
      });
    });

    if (this.interfaceNumber === null)
      throw new Error("No suitable interface found.");

    await this.device.claimInterface(this.interfaceNumber);
    await this.device.selectAlternateInterface(this.interfaceNumber, 0);
    await this.device.controlTransferOut({
      requestType: "class",
      recipient: "interface",
      request: 0x22, // SET_CONTROL_LINE_STATE
      value: 0x01, // DTR = 1
      index: this.interfaceNumber,
    });

    this.readLoop();
    console.log("Sending -");
    this.send(new TextEncoder().encode("-"));
  }

  async disconnect(): Promise<void> {
    if (this.interfaceNumber !== null) {
      await this.device.controlTransferOut({
        requestType: "class",
        recipient: "interface",
        request: 0x22, // SET_CONTROL_LINE_STATE
        value: 0x00, // DTR = 0
        index: this.interfaceNumber,
      });
    }
    await this.device.close();
  }

  async send(data: BufferSource): Promise<void> {
    if (this.endpointOut !== null) {
      await this.device.transferOut(this.endpointOut, data);
    } else {
      throw new Error("EndpointOut is not set.");
    }
  }

  private async readLoop(): Promise<void> {
    try {
      while (true) {
        if (this.endpointIn !== null) {
          const result = await this.device.transferIn(this.endpointIn, 64);
          if (result.data === undefined) {
            console.error("Serial data is undefined");
            continue;
          }
          if (this.onReceive) this.onReceive(result.data);
        } else {
          throw new Error("EndpointIn is not set.");
        }
      }
    } catch (error) {
      if (this.onReceiveError) this.onReceiveError(error);
    }
  }
}

export async function getFDSDevices(): Promise<FDSDevice[]> {
  const devices: USBDevice[] = await navigator.usb.getDevices();
  const fdsDevices: USBDevice[] = devices.filter(
    (device) => device.vendorId === 0x239a,
  );
  return fdsDevices.map((device: USBDevice) => new FDSDevice(device));
}

export async function findFDSDevice(): Promise<FDSDevice> {
  const filters: USBDeviceFilter[] = [{ vendorId: 0x239a }]; // Adafruit vendor ID
  const device = await navigator.usb.requestDevice({ filters });
  return new FDSDevice(device);
}

export function browserSupportsWebUSB(): boolean {
  return navigator.usb !== undefined;
}
