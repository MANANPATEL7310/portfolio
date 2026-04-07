'use client';

import { useState } from 'react';
import { Desktop } from '@/components/desktop/Desktop';
import { BootScreen } from '@/components/desktop/BootScreen';
import { MobilePortfolio } from '@/components/mobile/MobilePortfolio';

export default function Home() {
  const [isBooting, setIsBooting] = useState(true);

  return (
    <>
      {isBooting && <BootScreen onComplete={() => setIsBooting(false)} />}
      <div className="hidden lg:block">
        <Desktop enableHeroIntro={!isBooting} />
      </div>
      <div className="lg:hidden">
        <MobilePortfolio />
      </div>
    </>
  );
}
