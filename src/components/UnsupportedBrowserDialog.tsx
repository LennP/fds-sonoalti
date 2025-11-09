// UnsupportedBrowserDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Bowser from "bowser";

interface UnsupportedBrowserDialogProps {
  isOpen: boolean;
}

const BROWSER = Bowser.getParser(window.navigator.userAgent);
const BROWSER_NAME = BROWSER.getBrowserName(); // e.g., "Chrome", "Safari", "Firefox", etc.
const BROWSER_VERSION = BROWSER.getBrowserVersion();
const BROWSER_OS = BROWSER.getOS().name; // e.g. "MacOS"

const UnsupportedBrowserDialog = ({
  isOpen,
}: UnsupportedBrowserDialogProps) => (
  <Dialog
    open={isOpen}
    onOpenChange={() => {
      /* Prevent closing */
    }}
  >
    <DialogContent className="[&>button]:hidden flex flex-col items-center p-6 focus:outline-none ring-0">
      <DialogHeader className="flex flex-col items-center">
        <DialogTitle className="text-red-600 text-xl">
          Unsupported Browser
        </DialogTitle>
        <DialogDescription className="mt-2 text-center">
          This application uses WebUSB, which is only supported by the
          following web browsers:
        </DialogDescription>
      </DialogHeader>
      <div className="mt-4 flex space-x-12">
        {/* Chrome */}
        <a
          href="https://www.google.com/chrome/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center"
        >
          <img
            src="./browser_chrome.svg"
            alt="Chrome Logo"
            className="w-12 h-12"
          />
          <span className="mt-2">Google Chrome</span>
        </a>
        {/* Opera */}
        <a
          href="https://www.opera.com/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center"
        >
          <img
            src="./browser_opera.svg"
            alt="Opera Logo"
            className="w-12 h-12"
          />
          <span className="mt-2">Opera Browser</span>
        </a>
      </div>
      <p className="mt-6 text-center">
        You are currently using:{" "}
        <strong>
          {BROWSER_NAME} {BROWSER_VERSION}{" "}
          {BROWSER_OS ? "on " + BROWSER_OS : ""}
        </strong>
      </p>
    </DialogContent>
  </Dialog>
);

export default UnsupportedBrowserDialog;
