import { useState } from "react";
import { Slider } from "@/components/ui/slider";

interface PreferenceSliderProps {
  id: string;
  label: string;
  min: string;
  max: string;
  value: number;
  onChange: (value: number) => void;
}

export default function PreferenceSlider({ 
  id, 
  label, 
  min, 
  max, 
  value, 
  onChange 
}: PreferenceSliderProps) {
  const [sliderValue, setSliderValue] = useState(value);

  const handleValueChange = (values: number[]) => {
    const newValue = values[0];
    setSliderValue(newValue);
    onChange(newValue);
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm text-gray-500">{sliderValue}</span>
      </div>

      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>

      <Slider
        id={id}
        defaultValue={[sliderValue]}
        max={10}
        min={1}
        step={1}
        onValueChange={handleValueChange}
        className="h-2"
      />
    </div>
  );
}
