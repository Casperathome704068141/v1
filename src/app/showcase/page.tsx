import React from 'react';
import { Marquee } from '@/components/showcase/marquee';
import { BentoGrid } from '@/components/showcase/bento-grid';
import { AnimatedList } from '@/components/showcase/animated-list';
import { Dock } from '@/components/showcase/dock';
import { Globe } from '@/components/showcase/globe';
import { IconCloud } from '@/components/showcase/icon-cloud';
import { AnimatedBeam } from '@/components/showcase/animated-beam';
import { BorderBeam } from '@/components/showcase/border-beam';
import { Meteors } from '@/components/showcase/meteors';
import { PixelImage } from '@/components/showcase/pixel-image';

export default function ShowcasePage() {
  return (
    <div className="space-y-8 p-8 relative min-h-screen bg-background text-foreground">
      <Marquee />
      <BentoGrid />
      <AnimatedList />
      <Globe />
      <IconCloud />
      <AnimatedBeam />
      <BorderBeam>Border Beam Content</BorderBeam>
      <div className="relative h-40 bg-offBlack"><Meteors /></div>
      <PixelImage />
      <Dock />
    </div>
  );
}
