import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Database,
  Brain,
  Settings,
  Sparkles,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';

const navigationItems = [
  { 
    title: 'Dashboard', 
    url: '/', 
    icon: LayoutDashboard,
    description: 'Overview & Analytics'
  },
  { 
    title: 'Data Sources', 
    url: '/sources', 
    icon: Database,
    description: 'Connect Platforms'
  },
  { 
    title: 'Predictions', 
    url: '/predict', 
    icon: Brain,
    description: 'AI Insights'
  },
  { 
    title: 'Settings', 
    url: '/settings', 
    icon: Settings,
    description: 'Preferences'
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const collapsed = state === 'collapsed';
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    return isActive(path) 
      ? "bg-primary/20 text-primary border-primary/30 shadow-lg shadow-primary/20" 
      : "hover:bg-muted/50 hover:text-foreground text-muted-foreground border-transparent";
  };

  return (
    <Sidebar className="glass-nav border-r border-border-light">
      <SidebarHeader className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="glass-card p-2 rounded-xl">
            <Sparkles className="h-6 w-6 text-primary animate-glow" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-xl gradient-text">Hyperelational</h1>
              <p className="text-xs text-muted-foreground">AI-Powered BI</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`${getNavClassName(item.url)} border transition-all duration-200 rounded-lg px-3 py-2.5 flex items-center gap-3 w-full`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs opacity-75 truncate">{item.description}</div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 pt-2">
        <GlassCard className="p-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
          
          {!collapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          )}
        </GlassCard>
      </SidebarFooter>
    </Sidebar>
  );
}