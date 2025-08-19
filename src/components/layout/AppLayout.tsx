import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { GlassCard } from '@/components/ui/glass-card';
import { Menu } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-bg">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-40 glass-nav border-b border-border-light">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="glass-card p-2 rounded-lg hover-lift">
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="flex-1 overflow-auto">
            <div className="container mx-auto p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}