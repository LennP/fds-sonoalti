// Volume.tsx
import { FaVolumeHigh, FaVolumeLow } from "react-icons/fa6";

interface VolumeControlProps {
  value: number;
  onChange: (value: number) => void;
}

const NUMBER_OF_VOLUME_BLOCKS = 10;
const VOLUME_BLOCKS = Array.from(
  { length: NUMBER_OF_VOLUME_BLOCKS },
  (_, i) => i + 1,
);

const Volume = ({ value, onChange }: VolumeControlProps) => {
  return (
    <div className="flex items-center mb-4">
      {VOLUME_BLOCKS.map((block) => (
        <div
          key={block}
          className={`flex flex-1 justify-center items-center w-10 h-8 box-content transition-colors cursor-pointer ${
            value >= block ? "bg-blue-500" : "bg-gray-300"
          }`}
          style={{
            borderRight: block < NUMBER_OF_VOLUME_BLOCKS ? "1px solid white" : "",
          }}
          onClick={() => onChange(block)}
        >
          {block === 1 ? (
            <FaVolumeLow className="text-black" />
          ) : block === NUMBER_OF_VOLUME_BLOCKS ? (
            <FaVolumeHigh className="text-black" />
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default Volume;
