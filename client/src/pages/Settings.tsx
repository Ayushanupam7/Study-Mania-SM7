import { useState } from 'react';
import { useStudyContext } from '@/context/StudyContext';
import { Avatar } from '@/components/ui/avatar';
import { Pencil } from 'lucide-react';
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
            <span>{user?.name?.charAt(0) || 'A'}</span>
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
          <div className="mb-8">
            <h2 className="flex items-center text-lg font-medium mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              App Color
            </h2>
            <div className="flex space-x-4">
              {colorOptions.map((color) => (
                <button 
                  key={color.value}
                  className={`w-10 h-10 rounded-md ${color.class} flex items-center justify-center border-2 ${
                    appColor === color.value 
                      ? 'border-blue-500' 
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
          <div>
            <h2 className="flex items-center text-lg font-medium mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Mode
            </h2>
            <RadioGroup 
              value={isDarkMode ? 'dark' : 'light'} 
              onValueChange={(value) => setIsDarkMode(value === 'dark')}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center">
                <RadioGroupItem value="light" id="light-mode" />
                <Label htmlFor="light-mode" className="ml-3 cursor-pointer">
                  Light
                </Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="dark" id="dark-mode" />
                <Label htmlFor="dark-mode" className="ml-3 cursor-pointer">
                  Dark
                </Label>
              </div>
              <div className="flex items-center">
                <RadioGroupItem value="system" id="system-mode" />
                <Label htmlFor="system-mode" className="ml-3 cursor-pointer">
                  Use system settings
                </Label>
              </div>
            </RadioGroup>
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
            <div className="grid gap-4 py-4">
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
