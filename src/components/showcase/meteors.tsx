import React from 'react';

export function Meteors() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 right-0 w-1 h-1 bg-white rounded-full animate-meteor"
          style={{ animationDelay: `${i}s` }}
        />
      ))}
    </div>
  );
}
