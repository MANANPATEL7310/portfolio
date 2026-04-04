'use client';

import { useState } from 'react';
import { Desktop } from '@/components/desktop/Desktop';
import { BootScreen } from '@/components/desktop/BootScreen';

export default function Home() {
  const [isBooting, setIsBooting] = useState(true);

  return (
    <>
      {isBooting && <BootScreen onComplete={() => setIsBooting(false)} />}
      <Desktop />
    </>
  );
}
