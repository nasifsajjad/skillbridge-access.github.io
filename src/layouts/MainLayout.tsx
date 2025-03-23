
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Book, 
  Home, 
  LogOut, 
  LucideIcon, 
  Menu, 
  PanelLeft, 
  User, 
  X,
  BookOpen,
  BarChart,
  Users,
  Settings
} from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type MenuItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  adminOnly?: boolean;
};

const menuItems: MenuItem[] = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Courses', icon: Book, href: '/courses' },
  { label: 'My Learning', icon: BookOpen, href: '/my-learning' },
  { label: 'Dashboard', icon: BarChart, href: '/admin/dashboard', adminOnly: true },
  { label: 'Manage Courses', icon: Book, href: '/admin/courses', adminOnly: true },
  { label: 'Users', icon: Users, href: '/admin/users', adminOnly: true },
  { label: 'Settings', icon: Settings, href: '/admin/settings', adminOnly: true },
];

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  // Filter menu items based on admin status
  const filteredMenuItems = menuItems.filter(
    item => !item.adminOnly || (item.adminOnly && isAdmin)
  );

  const handleNavigation = (href: string) => {
    navigate(href);
    setSheetOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside 
        className={cn(
          "hidden md:flex flex-col w-64 bg-card border-r border-border transition-all duration-300",
          !sidebarOpen && "md:w-20"
        )}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className={cn("flex items-center", !sidebarOpen && "justify-center w-full")}>
            {sidebarOpen ? (
              <h1 className="text-xl font-bold tracking-tight">NB Institution</h1>
            ) : (
              <span className="text-xl font-bold">NB</span>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={cn("text-muted-foreground hover:text-foreground", !sidebarOpen && "hidden")}
          >
            <PanelLeft size={20} />
          </Button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {filteredMenuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                "flex items-center w-full p-2 rounded-md text-sm transition-all hover:bg-accent group",
                isActive(item.href) ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground hover:text-foreground",
                !sidebarOpen && "justify-center"
              )}
            >
              <item.icon size={20} className={cn("shrink-0", sidebarOpen && "mr-3")} />
              {sidebarOpen && <span>{item.label}</span>}
              {!sidebarOpen && (
                <div className="absolute left-20 rounded-md px-2 py-1 ml-6 bg-popover text-popover-foreground border shadow-md text-sm whitespace-nowrap opacity-0 -translate-x-3 pointer-events-none transition-all group-hover:opacity-100 group-hover:translate-x-0">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-border">
          {user ? (
            <div className={cn("flex items-center", !sidebarOpen && "justify-center")}>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                <User size={20} />
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              )}
              {sidebarOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut size={18} />
                </Button>
              )}
            </div>
          ) : (
            <Button
              variant="default"
              className={cn("w-full", !sidebarOpen && "p-2")}
              onClick={() => navigate('/login')}
            >
              {sidebarOpen ? 'Sign In' : <User size={20} />}
            </Button>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden absolute top-4 left-4 z-50"
          >
            <Menu size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px]">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">NB Institution</h1>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSheetOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </Button>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {filteredMenuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "flex items-center w-full p-2 rounded-md text-sm transition-all hover:bg-accent",
                  isActive(item.href) ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon size={20} className="mr-3" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="p-4 border-t border-border">
            {user ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                    <User size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    logout();
                    setSheetOpen(false);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                className="w-full"
                onClick={() => {
                  navigate('/login');
                  setSheetOpen(false);
                }}
              >
                Sign In
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 min-w-0 bg-background overflow-auto">
        <div className={cn(
          "container mx-auto py-8 px-4 md:px-8 animate-fade-in",
          location.pathname === '/' && "px-0 md:px-0 py-0"
        )}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
