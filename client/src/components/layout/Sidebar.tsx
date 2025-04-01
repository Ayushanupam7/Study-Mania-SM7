import { Link, useLocation } from "wouter";
import { 
  Home, 
  Clock, 
  BookOpen, 
  FileText, 
  Calendar, 
  History,
  Settings as SettingsIcon 
} from "lucide-react";
import { useStudyContext } from "@/context/StudyContext";

const Sidebar = () => {
  const [location] = useLocation();
  const { subjectsCount, flashcardsCount, plannerItemsCount } = useStudyContext();

  const menuItems = [
    { 
      path: "/", 
      label: "Dashboard", 
      icon: <Home className="h-5 w-5 mr-3" />, 
      count: null 
    },
    { 
      path: "/study-time", 
      label: "Study Time", 
      icon: <Clock className="h-5 w-5 mr-3" />, 
      count: null 
    },
    { 
      path: "/subjects", 
      label: "Subject", 
      icon: <BookOpen className="h-5 w-5 mr-3" />, 
      count: subjectsCount 
    },
    { 
      path: "/flashbook", 
      label: "Flashbook", 
      icon: <FileText className="h-5 w-5 mr-3" />, 
      count: flashcardsCount 
    },
    { 
      path: "/planner", 
      label: "Planner", 
      icon: <Calendar className="h-5 w-5 mr-3" />, 
      count: plannerItemsCount 
    },
    { 
      path: "/history", 
      label: "History", 
      icon: <History className="h-5 w-5 mr-3" />, 
      count: null 
    },
  ];

  const settingsItem = { 
    path: "/settings", 
    label: "Settings", 
    icon: <SettingsIcon className="h-5 w-5 mr-3" />, 
    count: 1 
  };

  return (
    <aside className="w-56 bg-white border-r border-slate-200 flex flex-col h-full">
      {/* Top Window Controls */}
      <div className="p-4 flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="flex-grow"></div>
        <button className="text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Menu Label */}
      <div className="px-4 py-1 text-xs text-slate-500 flex justify-between">
        <span>Menu</span>
        <span>{menuItems.length}</span>
      </div>
      
      {/* Navigation Items */}
      <nav className="px-2 py-1 flex-grow">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <a 
                  className={`flex items-center px-3 py-2 rounded-md justify-between ${
                    location === item.path
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center">
                    {item.icon}
                    {item.label}
                  </div>
                  {item.count && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 rounded-full">
                      {item.count}
                    </span>
                  )}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Settings Label */}
      <div className="px-4 py-1 text-xs text-slate-500 flex justify-between mt-auto">
        <span>Settings</span>
        <span>{settingsItem.count}</span>
      </div>
      
      {/* Settings Navigation */}
      <nav className="px-2 py-1 mb-4">
        <ul>
          <li>
            <Link href={settingsItem.path}>
              <a 
                className={`flex items-center px-3 py-2 rounded-md ${
                  location === settingsItem.path
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {settingsItem.icon}
                {settingsItem.label}
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
