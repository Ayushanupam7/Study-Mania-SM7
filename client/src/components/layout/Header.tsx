import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Moon, Sun, Focus } from "lucide-react";
import { useStudyContext } from "@/context/StudyContext";

const Header = () => {
  const { user, isDarkMode, setIsDarkMode, isFocusMode, setIsFocusMode } = useStudyContext();

  return (
    <header className="sticky top-0 z-50 w-full flex justify-between items-center px-6 py-3 border-b border-border bg-background backdrop-blur-md shadow-sm">
      {/* Left - Placeholder or logo (if needed) */}
      <div />

      {/* Right - Focus mode + Dark mode toggle + user profile */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          title={isFocusMode ? "Exit focus mode" : "Enter focus mode"}
          onClick={() => setIsFocusMode(!isFocusMode)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Focus className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="text-muted-foreground hover:text-foreground"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9 bg-primary text-white">
            {user?.photoUrl ? (
              <AvatarImage
                src={user.photoUrl}
                alt={user.name || "User"}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-primary text-white">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            )}
          </Avatar>
          <span className="font-medium text-sm truncate max-w-[140px] text-foreground">
            {user?.name || "Ayush"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;