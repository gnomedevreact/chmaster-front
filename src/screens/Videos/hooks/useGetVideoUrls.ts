import { storage } from '@/src/core/lib/store/storage';
import { getSignedUrls } from '@/src/screens/Videos/api/getSignedUrls';
import { useEffect, useState } from 'react';

export const useGetVideoUrls = () => {
  const [urls, setUrls] = useState<
    { error: string | null; path: string | null; signedUrl: string }[] | null
  >();
  const expiryTime = storage.getString('expiry_time');
  const cachedUrls = storage.getString('cached_urls');

  useEffect(() => {
    (async () => {
      if (expiryTime && Date.now() < Number(expiryTime) && cachedUrls) {
        setUrls(JSON.parse(cachedUrls));
        return;
      }

      const newUrls = await getSignedUrls();
      const newExpiry = Date.now() + 3600 * 1000;

      setUrls(newUrls);

      storage.set('cached_urls', JSON.stringify(newUrls));
      storage.set('expiry_time', String(newExpiry));
    })();
  }, []);

  return { urls };
};
