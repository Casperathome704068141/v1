import React from 'react';
import { Book, Globe2, FileText } from 'lucide-react';

export function IconCloud() {
  const icons = [Book, Globe2, FileText];
  return (
    <div className="relative w-40 h-40 mx-auto animate-spin-slow">
      {icons.map((Icon, i) => (
        <Icon
          key={i}
          className="text-techBlue absolute"
          style={{
            top: `${50 + 40 * Math.sin((i / icons.length) * 2 * Math.PI)}%`,
            left: `${50 + 40 * Math.cos((i / icons.length) * 2 * Math.PI)}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
}
