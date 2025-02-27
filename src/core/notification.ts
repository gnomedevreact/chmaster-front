import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';

export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    return false;
  }
  return true;
}

export async function scheduleDailyNotification() {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '♟️ Time for your chess training!',
      body: 'Dont let your brain take a day off—your next move is waiting!',
      sound: true,
      vibrate: [0, 255, 255, 255],
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DAILY,
      hour: 17,
      minute: 30,
    },
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '♟️ Hooray, a new task is open!',
      body: 'Time to stretch your brain—shall we go solve it?',
      sound: true,
      vibrate: [0, 255, 255, 255],
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DAILY,
      hour: 0,
      minute: 0,
    },
  });
}
