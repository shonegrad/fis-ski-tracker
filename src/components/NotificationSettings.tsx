import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Bell, BellOff, AlertCircle } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { Alert, AlertDescription } from './ui/alert';

export function NotificationSettings() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    raceStart: true,
    raceResults: true,
    weatherUpdates: false,
    courseUpdates: false
  });
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    checkSubscriptionStatus();
    checkNotificationPermission();
  }, []);

  const checkSubscriptionStatus = async () => {
    const status = await notificationService.getSubscriptionStatus();
    setIsSubscribed(status);
  };

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setPermissionDenied(Notification.permission === 'denied');
    }
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const subscription = await notificationService.subscribeToPushNotifications();
      if (subscription) {
        setIsSubscribed(true);
        setPermissionDenied(false);
      } else {
        setError('Failed to subscribe to notifications. Please check your browser settings.');
      }
    } catch (err) {
      setError('Failed to enable notifications. Please try again.');
      console.error('Subscription error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await notificationService.unsubscribeFromPushNotifications();
      if (success) {
        setIsSubscribed(false);
      } else {
        setError('Failed to unsubscribe from notifications.');
      }
    } catch (err) {
      setError('Failed to disable notifications. Please try again.');
      console.error('Unsubscription error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    // Save preferences to server
    savePreferences({ ...preferences, [key]: value });
  };

  const savePreferences = async (newPreferences: typeof preferences) => {
    try {
      await fetch('/api/notifications/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPreferences)
      });
    } catch (err) {
      console.error('Failed to save preferences:', err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isSubscribed ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
          Push Notifications
        </CardTitle>
        <CardDescription>
          Get notified about live race updates, results, and important information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {permissionDenied && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Notifications are blocked. Please enable them in your browser settings and refresh the page.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base">Enable Push Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive real-time updates about races and results
            </p>
          </div>
          <Button
            onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
            disabled={isLoading || permissionDenied}
            variant={isSubscribed ? "destructive" : "default"}
          >
            {isLoading ? "Processing..." : isSubscribed ? "Disable" : "Enable"}
          </Button>
        </div>

        {isSubscribed && (
          <div className="space-y-4 pt-4 border-t">
            <Label className="text-base">Notification Preferences</Label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="race-start">Race Start Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when races begin</p>
                </div>
                <Switch
                  id="race-start"
                  checked={preferences.raceStart}
                  onCheckedChange={(value) => handlePreferenceChange('raceStart', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="race-results">Race Results</Label>
                  <p className="text-sm text-muted-foreground">Get notified when results are available</p>
                </div>
                <Switch
                  id="race-results"
                  checked={preferences.raceResults}
                  onCheckedChange={(value) => handlePreferenceChange('raceResults', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weather-updates">Weather Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified about weather changes</p>
                </div>
                <Switch
                  id="weather-updates"
                  checked={preferences.weatherUpdates}
                  onCheckedChange={(value) => handlePreferenceChange('weatherUpdates', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="course-updates">Course Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified about course conditions</p>
                </div>
                <Switch
                  id="course-updates"
                  checked={preferences.courseUpdates}
                  onCheckedChange={(value) => handlePreferenceChange('courseUpdates', value)}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}