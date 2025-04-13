import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Home,
  Clock,
  BookOpen,
  FileText,
  Calendar,
  History,
  Settings as SettingsIcon,
} from "lucide-react";
import { useStudyContext } from "@/context/StudyContext";

const Sidebar = () => {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { subjectsCount, flashcardsCount, plannerItemsCount } = useStudyContext();

  const toggleSidebar = () => setCollapsed(!collapsed);

  const menuItems = [
    { path: "/", label: "Dashboard", icon: <Home />, count: null },
    { path: "/study-time", label: "Study Time", icon: <Clock />, count: null },
    { path: "/subjects", label: "Subject", icon: <BookOpen />, count: subjectsCount },
    { path: "/flashbook", label: "Flashbook", icon: <FileText />, count: flashcardsCount },
    { path: "/planner", label: "Planner", icon: <Calendar />, count: plannerItemsCount },
    { path: "/history", label: "History", icon: <History />, count: null },
  ];

  const settingsItem = {
    path: "/settings",
    label: "Settings",
    icon: <SettingsIcon />,
    count: 1,
  };

  return (
    <aside
      className={`transition-all duration-300 ${
        collapsed ? "w-16" : "w-56"
      } bg-white border-r border-slate-200 flex flex-col h-full`}
    >
      {/* Logo and Toggle */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 overflow-hidden">
          <img
            src="/logo.png"
            alt="App Logo"
            className={`h-6 w-auto transition-all duration-300 ${collapsed ? "hidden" : "block"}`}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          {!collapsed && <span className="text-lg font-semibold text-slate-800">StudyMania</span>}
        </div>

        <button
          onClick={toggleSidebar}
          className="text-slate-400 transition-transform duration-300"
          title="Toggle Sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transform ${collapsed ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Menu Label */}
      {!collapsed && (
        <div className="px-4 py-1 text-xs text-slate-500 flex justify-between">
          <span>Menu</span>
          <span>{menuItems.length}</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="px-2 py-1 flex-grow">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <a
                  className={`flex items-center px-3 py-3 h-12 rounded-md justify-between ${
                    location === item.path
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <div
                    className={`flex items-center ${
                      collapsed ? "justify-center w-full" : "space-x-3"
                    }`}
                  >
                    <item.icon.type className="h-5 w-5" />
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && item.count && (
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
      {!collapsed && (
        <div className="px-4 py-1 text-xs text-slate-500 flex justify-between mt-auto">
          <span>Settings</span>
          <span>{settingsItem.count}</span>
        </div>
      )}

      {/* Settings Nav */}
      <nav className="px-2 py-1 mb-4">
        <ul>
          <li>
            <Link href={settingsItem.path}>
              <a
                className={`flex items-center px-3 py-3 h-12 rounded-md ${
                  location === settingsItem.path
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <div
                  className={`flex items-center ${
                    collapsed ? "justify-center w-full" : "space-x-3"
                  }`}
                >
                  <settingsItem.icon.type className="h-5 w-5" />
                  {!collapsed && <span>{settingsItem.label}</span>}
                </div>
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
