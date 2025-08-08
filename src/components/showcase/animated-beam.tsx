import React from 'react';

export function AnimatedBeam() {
  return (
    <div className="relative h-1 w-full overflow-hidden rounded-full bg-gradient-to-r from-mapleRed via-techBlue to-signalYellow">
      <div className="absolute inset-0 animate-gradient-pan bg-gradient-to-r from-mapleRed via-gold to-techBlue" />
    </div>
  );
}
