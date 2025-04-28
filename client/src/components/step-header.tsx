import React from 'react';

interface StepHeaderProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  progress: number;
}

export function StepHeader({ title, currentStep, totalSteps, progress }: StepHeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-heading font-bold text-gray-900">{title}</h1>
          <div className="text-sm font-medium text-gray-500">Step {currentStep} of {totalSteps}</div>
        </div>
        <div className="w-full bg-gray-200 h-2 mt-4 rounded-full overflow-hidden">
          <div 
            className="bg-primary-500 h-full rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </header>
  );
}