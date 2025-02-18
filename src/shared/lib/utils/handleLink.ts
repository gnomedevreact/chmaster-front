import { presentPaywallIfNeeded } from '@/src/shared/lib/utils/presentPaywall';
import { router } from 'expo-router';

export const handleLink = async (subscription: boolean, link: any) => {
  if (subscription) {
    const isSubscribed = await presentPaywallIfNeeded();
    if (isSubscribed) {
      router.push(link);
    }

    return;
  }

  router.push(link);
};
