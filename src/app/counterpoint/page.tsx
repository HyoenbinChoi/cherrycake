'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import CounterpointWeave from '@/components/CounterpointWeave';

function CounterpointPageContent() {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';

  useEffect(() => {
    if (isEmbed) {
      // Hide header and footer in embed mode
      const header = document.querySelector('header') as HTMLElement;
      const footer = document.querySelector('footer') as HTMLElement;
      const main = document.querySelector('#main') as HTMLElement;
      
      if (header) header.style.display = 'none';
      if (footer) footer.style.display = 'none';
      if (main) {
        main.style.position = 'fixed';
        main.style.inset = '0';
        main.style.width = '100%';
        main.style.height = '100%';
      }
      
      return () => {
        // Cleanup on unmount
        if (header) header.style.display = '';
        if (footer) footer.style.display = '';
        if (main) {
          main.style.position = '';
          main.style.inset = '';
          main.style.width = '';
          main.style.height = '';
        }
      };
    }
  }, [isEmbed]);

  return <CounterpointWeave />;
}

export default function CounterpointPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CounterpointPageContent />
    </Suspense>
  );
}
