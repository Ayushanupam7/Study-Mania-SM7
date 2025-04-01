import { Bell, Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useStudyContext } from "@/context/StudyContext";

const Header = () => {
  const { user } = useStudyContext();
  
  return (
    <header className="flex justify-end items-center p-4 border-b border-slate-200 bg-white">
      <div className="flex items-center space-x-4">
        <button className="text-slate-400 hover:text-slate-600">
          <Bell className="h-6 w-6" />
        </button>
        <button className="text-slate-400 hover:text-slate-600">
          <Star className="h-6 w-6" />
        </button>
        <Avatar className="h-8 w-8 bg-primary text-white">
          {user?.photoUrl ? (
            <AvatarImage src={user.photoUrl} alt={user.name} className="object-cover" />
          ) : (
            <AvatarFallback className="bg-primary text-white">
              {user?.name?.charAt(0) || 'A'}
            </AvatarFallback>
          )}
        </Avatar>
        <span className="font-medium">{user?.name || 'Ayush'}</span>
      </div>
    </header>
  );
};

export default Header;
