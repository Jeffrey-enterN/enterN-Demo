import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface PreferenceSliderProps {
  id: string;
  label: string;
  min: string;
  max: string;
  value: number;
  onChange: (value: number) => void;
  tooltip?: string; // Optional tooltip description
}

export default function PreferenceSlider({ 
  id, 
  label, 
  min, 
  max, 
  value, 
  onChange,
  tooltip
}: PreferenceSliderProps) {
  const [sliderValue, setSliderValue] = useState(value);

  const handleValueChange = (values: number[]) => {
    const newValue = values[0];
    setSliderValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <div className="flex items-center gap-2">
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <span className="text-sm text-gray-500">{sliderValue}</span>
      </div>

      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span className="w-1/3 text-left">{min}</span>
        <span className="w-1/3 text-right">{max}</span>
      </div>

      <Slider
        id={id}
        defaultValue={[sliderValue]}
        max={99}
        min={1}
        step={1}
        onValueChange={handleValueChange}
        className="h-2"
      />
    </div>
  );
}
