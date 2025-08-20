import React, { useState } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { Activity, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/useAppStore';

interface ActivityHeatmapWidgetProps {
  size?: 'mini' | 'medium' | 'large' | 'full';
}

export function ActivityHeatmapWidget({ size = 'full' }: ActivityHeatmapWidgetProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const { industryMode } = useAppStore();

  const generateHeatmapData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return days.flatMap(day => 
      hours.map(hour => ({
        day,
        hour,
        value: Math.floor(Math.random() * 100),
        label: industryMode === 'fashion' ? 'purchases' : 'streams'
      }))
    );
  };

  const heatmapData = generateHeatmapData();
  const maxValue = Math.max(...heatmapData.map(d => d.value));

  const getColor = (value: number) => {
    const intensity = value / maxValue;
    const hue = industryMode === 'fashion' ? '262' : '200'; // Purple for fashion, Blue for music
    return `hsla(${hue}, 80%, 60%, ${intensity})`;
  };

  const getTooltipContent = (dataPoint: any) => {
    return `${dataPoint.day} ${dataPoint.hour}:00 - ${dataPoint.value} ${dataPoint.label}`;
  };

  const renderMiniVersion = () => {
    const peakHour = heatmapData.reduce((max, current) => 
      current.value > max.value ? current : max
    );

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Activity Heatmap</span>
          </div>
          <span className="text-xs text-muted-foreground">7 days</span>
        </div>
        
        <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{peakHour.value}</div>
            <div className="text-xs text-muted-foreground">Peak Activity</div>
            <div className="text-xs text-muted-foreground">
              {peakHour.day} at {peakHour.hour}:00
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-muted-foreground mb-1">{day}</div>
              <div className="space-y-1">
                {[0, 6, 12, 18].map(hour => {
                  const dataPoint = heatmapData.find(d => 
                    d.day.startsWith(day) && d.hour === hour
                  );
                  return (
                    <div
                      key={hour}
                      className="h-2 rounded-sm"
                      style={{ backgroundColor: getColor(dataPoint?.value || 0) }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFullVersion = () => (
    <div className="space-y-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-foreground">Activity Patterns</h4>
          <p className="text-sm text-muted-foreground">
            {industryMode === 'fashion' ? 'Customer purchase patterns' : 'Fan engagement patterns'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === 'week' ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedPeriod('week')}
          >
            Week
          </Button>
          <Button
            variant={selectedPeriod === 'month' ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedPeriod('month')}
          >
            Month
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Hour labels */}
          <div className="grid grid-cols-25 gap-1 mb-2">
            <div></div>
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="text-xs text-muted-foreground text-center">
                {i === 0 ? '12a' : i === 12 ? '12p' : i > 12 ? `${i-12}p` : `${i}a`}
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="grid grid-cols-25 gap-1 mb-1">
              <div className="text-xs text-muted-foreground py-2 pr-2 text-right">{day}</div>
              {Array.from({ length: 24 }, (_, hour) => {
                const dataPoint = heatmapData.find(d => d.day === day && d.hour === hour);
                return (
                  <div
                    key={`${day}-${hour}`}
                    className="aspect-square rounded cursor-pointer hover:ring-2 hover:ring-primary/50 
                      transition-all duration-200 flex items-center justify-center relative group"
                    style={{ backgroundColor: getColor(dataPoint?.value || 0) }}
                    title={getTooltipContent(dataPoint)}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                      bg-card border border-border rounded px-2 py-1 text-xs whitespace-nowrap
                      opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                      {getTooltipContent(dataPoint)}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend and insights */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Less</span>
          <div className="flex gap-1">
            {[0.2, 0.4, 0.6, 0.8, 1].map(intensity => (
              <div
                key={intensity}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: getColor(maxValue * intensity) }}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">More</span>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Peak: <span className="text-foreground font-medium">
            {industryMode === 'fashion' ? 'Weekdays 2-4 PM' : 'Evenings 7-9 PM'}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <WidgetContainer
      title="Activity Heatmap"
      icon={Activity}
      size={size}
      controls={
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
      }
    >
      {size === 'mini' ? renderMiniVersion() : renderFullVersion()}
    </WidgetContainer>
  );
}