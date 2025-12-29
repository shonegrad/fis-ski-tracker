export interface NotificationSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface RaceNotification {
  id: string;
  type: 'race_start' | 'race_result' | 'weather_update' | 'course_update';
  title: string;
  message: string;
  raceId: string;
  locationId: string;
  timestamp: string;
  data?: any;
}

export interface NotificationError {
  type: 'permission_denied' | 'not_supported' | 'network_error' | 'unknown';
  message: string;
}

class NotificationService {
  private vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HcCWLEaWHLTBWYiRTMgaOlWzrAIZSrP7hOvdoqPw-0sP4rKDhHTRz5zrJE'; // Demo key

  async requestPermission(): Promise<{ granted: boolean; error?: NotificationError }> {
    if (!('Notification' in window)) {
      return {
        granted: false,
        error: {
          type: 'not_supported',
          message: 'This browser does not support notifications'
        }
      };
    }

    if (!('serviceWorker' in navigator)) {
      return {
        granted: false,
        error: {
          type: 'not_supported',
          message: 'This browser does not support service workers'
        }
      };
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        return { granted: true };
      } else if (permission === 'denied') {
        return {
          granted: false,
          error: {
            type: 'permission_denied',
            message: 'Notification permission was denied. You can enable it in your browser settings.'
          }
        };
      } else {
        return {
          granted: false,
          error: {
            type: 'permission_denied',
            message: 'Notification permission was not granted.'
          }
        };
      }
    } catch (error) {
      return {
        granted: false,
        error: {
          type: 'unknown',
          message: 'Failed to request notification permission'
        }
      };
    }
  }

  async subscribeToPushNotifications(): Promise<{ 
    subscription: NotificationSubscription | null;
    error?: NotificationError;
  }> {
    try {
      const permissionResult = await this.requestPermission();
      if (!permissionResult.granted) {
        return { 
          subscription: null, 
          error: permissionResult.error 
        };
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      const subscriptionData: NotificationSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(subscription.getKey('p256dh')!)))),
          auth: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(subscription.getKey('auth')!))))
        }
      };

      // Try to store subscription on server, but don't fail if it doesn't work
      try {
        await this.saveSubscription(subscriptionData);
      } catch (serverError) {
        console.warn('Failed to save subscription to server, but notifications will still work locally:', serverError);
      }
      
      return { subscription: subscriptionData };
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      
      // Determine error type
      let errorType: NotificationError['type'] = 'unknown';
      let errorMessage = 'Failed to enable notifications';
      
      if (error instanceof Error) {
        if (error.message.includes('permission') || error.message.includes('denied')) {
          errorType = 'permission_denied';
          errorMessage = 'Notification permission was denied. Please enable notifications in your browser settings.';
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorType = 'network_error';
          errorMessage = 'Network error while setting up notifications. Please try again.';
        }
      }
      
      return { 
        subscription: null, 
        error: {
          type: errorType,
          message: errorMessage
        }
      };
    }
  }

  async unsubscribeFromPushNotifications(): Promise<{ 
    success: boolean;
    error?: NotificationError;
  }> {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          
          // Try to remove from server, but don't fail if it doesn't work
          try {
            await this.removeSubscription();
          } catch (serverError) {
            console.warn('Failed to remove subscription from server:', serverError);
          }
          
          return { success: true };
        }
      }
      return { success: false };
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return { 
        success: false,
        error: {
          type: 'unknown',
          message: 'Failed to disable notifications'
        }
      };
    }
  }

  async saveSubscription(subscription: NotificationSubscription): Promise<void> {
    // In a real app, this would save to your backend
    // For now, we'll just simulate success since we're in demo mode
    return Promise.resolve();
  }

  async removeSubscription(): Promise<void> {
    // In a real app, this would remove from your backend
    // For now, we'll just simulate success since we're in demo mode
    return Promise.resolve();
  }

  async getSubscriptionStatus(): Promise<boolean> {
    try {
      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        return false;
      }
      
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        return subscription !== null && Notification.permission === 'granted';
      }
      return false;
    } catch {
      return false;
    }
  }

  showLocalNotification(notification: RaceNotification): boolean {
    if (Notification.permission === 'granted') {
      try {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/alpine-ski-icon.png',
          badge: '/alpine-ski-badge.png',
          tag: notification.raceId,
          data: notification.data,
          actions: [
            {
              action: 'view',
              title: 'View Details'
            },
            {
              action: 'dismiss',
              title: 'Dismiss'
            }
          ]
        });
        return true;
      } catch (error) {
        console.error('Failed to show notification:', error);
        return false;
      }
    }
    return false;
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export const notificationService = new NotificationService();