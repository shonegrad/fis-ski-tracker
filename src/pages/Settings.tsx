import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Settings as SettingsIcon, Moon, Sun, Bell, Globe } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';

export default function Settings() {
    const { isDarkMode, toggleTheme } = useAppContext();

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
                <SettingsIcon className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold">Settings</h1>
            </div>

            <div className="grid gap-6 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            Appearance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="dark-mode">Dark Mode</Label>
                                <p className="text-sm text-muted-foreground">
                                    Switch between light and dark themes
                                </p>
                            </div>
                            <Switch
                                id="dark-mode"
                                checked={isDarkMode}
                                onCheckedChange={toggleTheme}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5" />
                            Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="race-notifications">Race Alerts</Label>
                                <p className="text-sm text-muted-foreground">
                                    Get notified when races start or finish
                                </p>
                            </div>
                            <Switch id="race-notifications" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="result-notifications">Results Updates</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive updates when new results are posted
                                </p>
                            </div>
                            <Switch id="result-notifications" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="w-5 h-5" />
                            Language & Region
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Language and region settings coming soon...
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
