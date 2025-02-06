import Purchases from 'react-native-purchases';
import { useEffect } from 'react';
import { presentPaywall } from '@/src/shared/lib/utils/presentPaywall';
import { router } from 'expo-router';

export const useCheckSubscription = async () => {
  useEffect(() => {
    (async () => {
      try {
        const customerInfo = await Purchases.getCustomerInfo();
        const active = customerInfo.activeSubscriptions[0];

        if (!active) {
          router.push('/');
          await presentPaywall();
          return;
        }
      } catch (error) {
        console.log('Error checking subscription:', error);
        return false;
      }
    })();
  }, []);
};
