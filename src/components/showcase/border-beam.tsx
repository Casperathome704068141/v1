import React, { PropsWithChildren } from 'react';

export function BorderBeam({ children }: PropsWithChildren) {
  return (
    <div className="relative p-px rounded-xl">
      <div className="absolute inset-0 rounded-xl animate-gradient-pan bg-gradient-to-r from-techBlue via-mapleRed to-signalYellow" />
      <div className="relative rounded-xl bg-offBlack p-4 text-white">{children}</div>
    </div>
  );
}
