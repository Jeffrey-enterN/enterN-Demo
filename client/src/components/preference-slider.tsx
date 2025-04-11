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
        {/* Numeric value removed as requested */}
      </div>

      <div className="flex justify-between text-xs text-gray-600 mb-1 px-1">
        <span className="w-1/2 text-left font-medium">{min}</span>
        <span className="w-1/2 text-right font-medium">{max}</span>
      </div>

      <Slider
        id={id}
        defaultValue={[sliderValue]}
        max={99}
        min={1}
        step={1}
        onValueChange={handleValueChange}
        className="h-2.5 cursor-pointer"
      />
      
      {/* Visual indicator for slider position without showing the number */}
      <div className="flex justify-between mt-1 relative">
        <div className="flex-1 flex justify-start">
          <div className={`h-1 ${sliderValue < 33 ? 'bg-blue-300 w-2' : 'w-0'}`}></div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className={`h-1 ${sliderValue >= 33 && sliderValue <= 66 ? 'bg-purple-300 w-2' : 'w-0'}`}></div>
        </div>
        <div className="flex-1 flex justify-end">
          <div className={`h-1 ${sliderValue > 66 ? 'bg-red-300 w-2' : 'w-0'}`}></div>
        </div>
      </div>
    </div>
  );
}
