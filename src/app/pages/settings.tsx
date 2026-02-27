import { useState } from 'react';
import { motion } from 'motion/react';
import { Save, Bell, Clock, Shield, Download, Moon, Sun, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useAuthStore } from '../lib/store';
import { toast } from 'sonner';

export function SettingsPage() {
  const { user } = useAuthStore();
  const [sla, setSla] = useState({ low: 168, medium: 48, high: 24, urgent: 4 });
  const [notifSettings, setNotifSettings] = useState({
    email: true, sms: false, inApp: true, slaBreach: true, newAssignment: true, statusUpdate: true, overdue: true,
  });

  const exportBackup = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      user: user,
      settings: { sla, notifications: notifSettings },
      note: 'This is a demo backup export',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'repairflow-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Backup exported', { description: 'JSON snapshot downloaded.' });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your preferences and system configuration</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <TabsList className="w-max sm:w-auto">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="sla">SLA</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="profile">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sm">Profile Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-lg">{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p style={{ fontWeight: 600 }}>{user?.name}</p>
                  <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue={user?.name} className="bg-input-background" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={user?.email} className="bg-input-background" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input defaultValue={user?.phone} className="bg-input-background" />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input defaultValue={user?.role} disabled className="bg-input-background opacity-60" />
                </div>
              </div>
              <Button className="gap-2" onClick={() => toast.success('Profile updated (demo)')}>
                <Save className="w-4 h-4" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2"><Bell className="w-4 h-4" /> Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm" style={{ fontWeight: 600 }}>Channels</h3>
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email (demo)' },
                  { key: 'sms', label: 'SMS Notifications', desc: 'Receive notifications via SMS (demo)' },
                  { key: 'inApp', label: 'In-App Notifications', desc: 'Show notifications in the app' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifSettings[item.key as keyof typeof notifSettings] as boolean}
                      onCheckedChange={v => setNotifSettings(p => ({ ...p, [item.key]: v }))}
                    />
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-sm" style={{ fontWeight: 600 }}>Event Types</h3>
                {[
                  { key: 'slaBreach', label: 'SLA Breach Alerts' },
                  { key: 'newAssignment', label: 'New Assignments' },
                  { key: 'statusUpdate', label: 'Status Updates' },
                  { key: 'overdue', label: 'Overdue Tasks' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <p className="text-sm">{item.label}</p>
                    <Switch
                      checked={notifSettings[item.key as keyof typeof notifSettings] as boolean}
                      onCheckedChange={v => setNotifSettings(p => ({ ...p, [item.key]: v }))}
                    />
                  </div>
                ))}
              </div>
              <Button className="gap-2" onClick={() => toast.success('Notification settings saved (demo)')}>
                <Save className="w-4 h-4" /> Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sla">
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2"><Clock className="w-4 h-4" /> SLA Thresholds</CardTitle>
              <CardDescription>Set resolution time targets by priority level (in hours)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'urgent', label: 'Urgent', color: 'text-red-500' },
                { key: 'high', label: 'High', color: 'text-orange-500' },
                { key: 'medium', label: 'Medium', color: 'text-yellow-500' },
                { key: 'low', label: 'Low', color: 'text-gray-400' },
              ].map(item => (
                <div key={item.key} className="flex items-center gap-4">
                  <span className={`text-sm w-24 ${item.color}`} style={{ fontWeight: 500 }}>{item.label}</span>
                  <Input
                    type="number"
                    value={sla[item.key as keyof typeof sla]}
                    onChange={e => setSla(p => ({ ...p, [item.key]: parseInt(e.target.value) || 0 }))}
                    className="w-24 bg-input-background"
                  />
                  <span className="text-xs text-muted-foreground">hours</span>
                </div>
              ))}
              <Button className="gap-2" onClick={() => toast.success('SLA thresholds updated (demo)')}>
                <Save className="w-4 h-4" /> Save Thresholds
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <div className="space-y-4">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2"><Shield className="w-4 h-4" /> Security</CardTitle>
                <CardDescription>Data encryption and security settings (demo)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-sm">Data Encryption</p>
                    <p className="text-xs text-muted-foreground">AES-256 encryption for sensitive data (placeholder)</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-sm">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Additional security layer (placeholder)</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2"><Download className="w-4 h-4" /> Backup</CardTitle>
                <CardDescription>Export a snapshot of the system data</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="gap-2" onClick={exportBackup}>
                  <Download className="w-4 h-4" /> Export JSON Backup
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}