import { useState } from 'react';
import { useStudyContext } from '@/context/StudyContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Pencil, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { user, updateUser, appColor, setAppColor, isDarkMode, setIsDarkMode } = useStudyContext();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: user?.name || 'Ayush',
    photoUrl: user?.photoUrl || null, // Added photoUrl to state
  });
  const { toast } = useToast();

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(profileFormData);
    setIsProfileDialogOpen(false);

    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileFormData({ ...profileFormData, photoUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };


  const colorOptions = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'red', label: 'Red', class: 'bg-red-500' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-500' }
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      <p className="text-slate-600 mb-8">Customize your Study Mania experience</p>

      {/* Profile Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center">
          <Avatar className="w-16 h-16 text-2xl bg-primary text-white mr-4">
              {user?.photoUrl ? (
                <AvatarImage src={user.photoUrl} alt={user.name} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-primary text-white">
                  {user?.name?.charAt(0) || 'A'}
                </AvatarFallback>
              )}
            </Avatar>
          <div>
            <p className="font-medium text-lg">{user?.name || 'Ayush'}</p>
            <p className="text-slate-500">default</p>
          </div>
          <button 
            className="ml-auto text-slate-400 hover:text-blue-500"
            onClick={() => setIsProfileDialogOpen(true)}
          >
            <Pencil className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="border-b border-slate-200 mb-6 bg-transparent p-0 -mb-px flex space-x-8">
          <TabsTrigger 
            value="appearance" 
            className="border-transparent data-[state=active]:border-primary data-[state=active]:text-primary py-2 px-1 border-b-2 font-medium text-sm data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent"
          >
            Appearance
          </TabsTrigger>
          <TabsTrigger 
            value="account" 
            className="border-transparent data-[state=active]:border-primary data-[state=active]:text-primary py-2 px-1 border-b-2 font-medium text-sm data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent"
          >
            Account
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="border-transparent data-[state=active]:border-primary data-[state=active]:text-primary py-2 px-1 border-b-2 font-medium text-sm data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent"
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="mt-0">
          {/* App Color Settings */}
          <div className="mb-8 bg-card p-6 rounded-lg border">
            <h2 className="flex items-center text-lg font-medium mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Theme Color
            </h2>
            <p className="text-sm text-muted-foreground mb-4">Choose your preferred accent color for the application</p>
            <div className="grid grid-cols-5 gap-4">
              {colorOptions.map((color) => (
                <button 
                  key={color.value}
                  className={`w-14 h-14 rounded-lg ${color.class} flex items-center justify-center border-2 transition-all hover:scale-105 ${
                    appColor === color.value 
                      ? 'border-primary shadow-lg' 
                      : 'border-transparent hover:border-slate-400'
                  }`}
                  onClick={() => setAppColor(color.value)}
                >
                  {appColor === color.value && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Display Mode Settings */}
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="flex items-center text-lg font-medium mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Appearance Mode
            </h2>
            <p className="text-sm text-muted-foreground mb-4">Select your preferred appearance mode</p>
            <div className="grid grid-cols-3 gap-4">
              <button
                className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all hover:bg-accent ${!isDarkMode ? 'border-primary bg-accent' : 'border-transparent'}`}
                onClick={() => setIsDarkMode(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-sm font-medium">Light</span>
              </button>

              <button
                className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all hover:bg-accent ${isDarkMode ? 'border-primary bg-accent' : 'border-transparent'}`}
                onClick={() => setIsDarkMode(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span className="text-sm font-medium">Dark</span>
              </button>

              <button
                className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all hover:bg-accent ${false ? 'border-primary bg-accent' : 'border-transparent'}`}
                onClick={() => {
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  setIsDarkMode(prefersDark);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account">
          <div className="rounded-md border border-slate-200 p-6">
            <h2 className="text-lg font-medium mb-4">Account Settings</h2>
            <p className="text-slate-600 mb-4">Manage your account settings and preferences.</p>
            <p className="text-slate-500 text-sm italic">More account settings coming soon.</p>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="rounded-md border border-slate-200 p-6">
            <h2 className="text-lg font-medium mb-4">Notification Preferences</h2>
            <p className="text-slate-600 mb-4">Control how and when you receive notifications.</p>
            <p className="text-slate-500 text-sm italic">Notification settings coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Profile Edit Dialog */}
      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleProfileSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={profileFormData.name}
                  onChange={(e) => setProfileFormData({ ...profileFormData, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="photo" className="text-right">
                  Photo
                </Label>
                <div className="col-span-3">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      {profileFormData.photoUrl ? (
                        <img src={profileFormData.photoUrl} alt={profileFormData.name} className="w-full h-full object-cover rounded-full"/>
                      ) : (
                        <span>{profileFormData.name.charAt(0)}</span>
                      )}
                    </Avatar>
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Settings;