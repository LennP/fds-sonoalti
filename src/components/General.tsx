// General.tsx
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GeneralSettings } from "@/types";

interface GeneralProps {
  generalSettings: GeneralSettings;
  onChange: (key: keyof GeneralSettings, value: boolean) => void;
}

const General = ({ generalSettings, onChange }: GeneralProps) => {
  const handleInputChange =
    (key: keyof GeneralSettings) => (value: boolean) => {
      onChange(key, value);
    };

  return (
    <div className="shadow-lg rounded-xl overflow-hidden mb-4 pb-2">
      <div className="text-2xl font-bold text-center mb-2 bg-[#252727] text-white p-2">
        <h1>General</h1>
      </div>
      <div className="flex flex-row space-x-3 justify-center">
        <div className="flex flex-col justify-center items-center space-y-2 p-3">
          <Label className="text-center">Pre-Jump Info</Label>
          <Switch
            checked={generalSettings.includePreJumpInfo}
            onCheckedChange={handleInputChange("includePreJumpInfo")}
          />
        </div>
        <div className="flex flex-col justify-center items-center space-y-2 p-3">
          <Label className="text-center">Post-Jump Info</Label>
          <Switch
            checked={generalSettings.includePostJumpInfo}
            onCheckedChange={(value: boolean) => {
              console.log("Changed postjumpinfo");
              onChange("includePostJumpInfo", value);
            }}
          />
        </div>
        <div className="flex flex-col justify-center items-center space-y-2 p-3">
          <Label className="text-center">Metric Mode</Label>
          <Switch
            checked={generalSettings.useMetric}
            onCheckedChange={handleInputChange("useMetric")}
          />
        </div>
      </div>
    </div>
  );
};

export default General;
