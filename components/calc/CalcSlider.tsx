"use client";

import { Slider } from "@/components/ui/slider";

type CalcSliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
};

export function CalcSlider(props: CalcSliderProps) {
  return <Slider {...props} />;
}
