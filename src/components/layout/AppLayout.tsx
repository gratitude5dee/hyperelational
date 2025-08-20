import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import CloudShader from '@/components/CloudShader';
interface AppLayoutProps {
  children: React.ReactNode;
}
export function AppLayout({
  children
}: AppLayoutProps) {
  return <SidebarProvider>
      {/* UniversalAI WebGL Background */}
      <CloudShader />
      
      <div className="flex min-h-screen w-full relative">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-40 glass-nav border-b border-border-light">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <img src="/lovable-uploads/69ad29f0-f8c0-4412-96b7-1081781f745b.png" alt="KumoRFM" className="h-8 w-auto" />
              </div>
              <div className="flex items-center gap-4">
                <div className="ml-auto">
                  {/* Import and use DualModeToggle */}
                </div>
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
    </SidebarProvider>;
}