"use client";

import { useState } from "react";

export default function ColorSwatchPicker({
  name,
  colors,
  defaultValue,
}: {
  name: string;
  colors: string[];
  defaultValue?: string;
}) {
  const [selected, setSelected] = useState(defaultValue ?? colors[0]);

  return (
    <div className="flex flex-wrap gap-2">
      <input type="hidden" name={name} value={selected} />
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => setSelected(color)}
          aria-label={`Choose color ${color}`}
          aria-pressed={selected === color}
          className="h-7 w-7 shrink-0 rounded-full transition"
          style={{
            backgroundColor: color,
            boxShadow: selected === color ? `0 0 0 2px #ffffff, 0 0 0 4px ${color}` : "none",
          }}
        />
      ))}
    </div>
  );
}
