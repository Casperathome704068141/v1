import React from 'react';
import { Home, HelpCircle, DollarSign } from 'lucide-react';

export function Dock() {
  const actions = [
    { icon: Home, label: 'Quiz' },
    { icon: DollarSign, label: 'Pricing' },
    { icon: HelpCircle, label: 'Support' },
  ];
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 backdrop-blur bg-offBlack/60 text-white px-4 py-2 rounded-full flex space-x-6">
      {actions.map(({ icon: Icon, label }) => (
        <button key={label} className="flex flex-col items-center text-xs">
          <Icon className="h-5 w-5" />
          {label}
        </button>
      ))}
    </div>
  );
}
