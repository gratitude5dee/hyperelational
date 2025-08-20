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
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Database,
  Brain,
  Settings,
  Sparkles,
  User,
  LogOut,
  Menu
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';

const navigationItems = [
  { 
    title: 'Dashboard', 
    url: '/', 
    icon: LayoutDashboard,
    description: 'AI Analytics Hub'
  },
  { 
    title: 'Chat Assistant', 
    url: '/chat', 
    icon: Brain,
    description: 'PQL Query Interface'
  },
  { 
    title: 'Graph Explorer', 
    url: '/graph', 
    icon: Sparkles,
    description: 'Relationship Networks'
  },
  { 
    title: 'Data Sources', 
    url: '/sources', 
    icon: Database,
    description: 'Connect Platforms'
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
    <Sidebar 
      className="glass-nav border-r border-border-light transition-all duration-300" 
      style={{ width: collapsed ? '4rem' : '16rem' }}
    >
      <SidebarHeader className={collapsed ? "p-2" : "p-6 pb-4"}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="glass-card p-2 rounded-xl flex-shrink-0">
              <img 
                src="/lovable-uploads/d854b317-ff5a-43b4-8eb6-ac8078baae77.png" 
                alt="Hyperelational" 
                className="h-6 w-6 animate-glow" 
              />
            </div>
            {!collapsed && (
              <div className="animate-fade-in">
                <h1 className="font-bold text-xl gradient-text">Hyperelational</h1>
                <p className="text-xs text-muted-foreground">AI-Powered Analytics</p>
              </div>
            )}
          </div>
          <SidebarTrigger className="glass-card p-2 rounded-lg hover-lift flex-shrink-0">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>
        </div>
      </SidebarHeader>

      <SidebarContent className={collapsed ? "px-2" : "px-4"}>
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 animate-fade-in">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`${getNavClassName(item.url)} border transition-all duration-200 rounded-lg ${
                        collapsed ? 'px-2 py-2.5 justify-center' : 'px-3 py-2.5'
                      } flex items-center gap-3 w-full group relative`}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex-1 min-w-0 animate-fade-in">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs opacity-75 truncate">{item.description}</div>
                        </div>
                      )}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2 py-1 bg-popover border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs opacity-75">{item.description}</div>
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

      <SidebarFooter className={collapsed ? "p-2 pt-2" : "p-4 pt-2"}>
        <GlassCard className={collapsed ? "p-2" : "p-3"}>
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'mb-3'} group relative`}>
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-white" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-sm font-medium truncate">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            )}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-popover border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                <p className="text-sm font-medium">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
          {!collapsed && (
            <div className="flex items-center justify-between mb-2 animate-fade-in">
              <div className="flex items-center gap-2">
                <img src="/lovable-uploads/69ad29f0-f8c0-4412-96b7-1081781f745b.png" alt="KumoRFM" className="h-4 w-auto" />
                <span className="text-xs text-muted-foreground">Powered by KumoRFM</span>
              </div>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 animate-fade-in"
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
