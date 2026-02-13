import { useEffect } from 'react';
import { useSiteDesign } from '@/lib/site-design';

export function useDocumentTitle(title: string | null) {
  const { siteNameFallback } = useSiteDesign();
  useEffect(() => {
    if (title) {
      document.title = `${title} — ${siteNameFallback}`;
      return () => {
        document.title = siteNameFallback;
      };
    }
  }, [title, siteNameFallback]);
}
