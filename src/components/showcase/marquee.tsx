import React from 'react';

export function Marquee() {
  return (
    <div className="overflow-hidden whitespace-nowrap bg-offBlack py-2">
      <div className="animate-marquee inline-block">
        {["Global Reach", "Trusted Partners", "Scholarships"].map((item) => (
          <span key={item} className="mx-8 text-white">{item}</span>
        ))}
      </div>
    </div>
  );
}
