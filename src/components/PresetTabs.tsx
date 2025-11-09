// PresetTabs.tsx
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PresetTabsProps {
  presets: string[];
  selectedPreset: number;
  onSelectPreset: (index: number) => void;
}

const PresetTabs = ({
  presets,
  selectedPreset,
  onSelectPreset,
}: PresetTabsProps) => (
  <Tabs
    value={presets[selectedPreset]}
    onValueChange={(value) => {
      const index = presets.indexOf(value);
      if (index !== -1) {
        onSelectPreset(index);
      }
    }}
  >
    <TabsList className="bg-[#252727]">
      {presets.map((preset, index) => (
        <TabsTrigger key={index} value={preset}>
          {preset}
        </TabsTrigger>
      ))}
    </TabsList>
  </Tabs>
);

export default PresetTabs;
