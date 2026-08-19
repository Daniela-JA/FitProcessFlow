export async function scheduleInsightsNotification(): Promise<void> {
  try {
    const Notifications = await import("expo-notifications");
    await Notifications.requestPermissionsAsync();
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Insights are ready",
        body: "Yesterday’s scores and the smallest fix.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 7,
        minute: 0,
      },
    });
  } catch {
    // Expo Go / tests: skip
  }
}
