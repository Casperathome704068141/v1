import React from 'react';

export function BentoGrid() {
  const colors = ['bg-techBlue', 'bg-mapleRed', 'bg-signalYellow', 'bg-offBlack', 'bg-techBlue', 'bg-mapleRed'];
  return (
    <div className="grid grid-cols-6 auto-rows-[120px] gap-4">
      {colors.map((c, i) => (
        <div
          key={i}
          className={`${c} text-white flex items-center justify-center rounded-xl animate-fade-in-up ${i === 0 ? 'col-span-3 row-span-2' : 'col-span-3'}`}
        >
          Item {i + 1}
        </div>
      ))}
    </div>
  );
}
