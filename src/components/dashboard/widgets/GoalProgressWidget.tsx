import React from 'react';
import { motion } from 'framer-motion';
import { WidgetContainer } from '../WidgetContainer';
import { Target, TrendingUp, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/useAppStore';

interface GoalProgressWidgetProps {
  size?: 'mini' | 'medium' | 'large' | 'full';
}

export function GoalProgressWidget({ size = 'medium' }: GoalProgressWidgetProps) {
  const { industryMode } = useAppStore();

  const getGoals = () => {
    if (industryMode === 'fashion') {
      return [
        { 
          name: 'Monthly Revenue', 
          current: 75000, 
          target: 100000, 
          unit: '$',
          icon: TrendingUp,
          color: 'hsl(var(--primary))'
        },
        { 
          name: 'New Customers', 
          current: 450, 
          target: 500, 
          unit: '',
          icon: Target,
          color: 'hsl(var(--secondary))'
        },
        { 
          name: 'Conversion Rate', 
          current: 3.2, 
          target: 4.0, 
          unit: '%',
          icon: TrendingUp,
          color: 'hsl(var(--accent))'
        },
        { 
          name: 'Avg Order Value', 
          current: 127, 
          target: 150, 
          unit: '$',
          icon: Target,
          color: 'hsl(var(--success))'
        }
      ];
    } else {
      return [
        { 
          name: 'Monthly Streams', 
          current: 2500000, 
          target: 3000000, 
          unit: '',
          icon: TrendingUp,
          color: 'hsl(var(--primary))'
        },
        { 
          name: 'New Fans', 
          current: 8500, 
          target: 10000, 
          unit: '',
          icon: Target,
          color: 'hsl(var(--secondary))'
        },
        { 
          name: 'Engagement Rate', 
          current: 6.8, 
          target: 8.0, 
          unit: '%',
          icon: TrendingUp,
          color: 'hsl(var(--accent))'
        },
        { 
          name: 'Concert Revenue', 
          current: 45000, 
          target: 60000, 
          unit: '$',
          icon: Target,
          color: 'hsl(var(--success))'
        }
      ];
    }
  };

  const goals = getGoals();

  const formatValue = (value: number, unit: string) => {
    if (value >= 1000000) {
      return `${unit}${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${unit}${(value / 1000).toFixed(1)}K`;
    }
    return `${unit}${value.toLocaleString()}`;
  };

  return (
    <WidgetContainer
      title="Goal Progress"
      icon={Target}
      size={size}
    >
      <div className="space-y-6">
        {goals.map((goal, index) => {
          const progress = (goal.current / goal.target) * 100;
          const isAhead = progress >= 100;
          const Icon = goal.icon;
          
          return (
            <motion.div
              key={goal.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: `${goal.color}20` }}
                  >
                    <Icon 
                      className="h-4 w-4" 
                      style={{ color: goal.color }}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{goal.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatValue(goal.current, goal.unit)} / {formatValue(goal.target, goal.unit)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isAhead && <CheckCircle className="h-4 w-4 text-success" />}
                  <Badge variant={isAhead ? "default" : "secondary"}>
                    {progress.toFixed(1)}%
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <Progress 
                  value={Math.min(progress, 100)} 
                  className="h-2"
                />
                
                <div className="flex items-center justify-between text-xs">
                  <span className={`${isAhead ? 'text-success' : 'text-muted-foreground'}`}>
                    {progress.toFixed(1)}% Complete
                  </span>
                  {isAhead && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-success font-medium"
                    >
                      Goal Achieved! 🎉
                    </motion.span>
                  )}
                  {!isAhead && (
                    <span className="text-muted-foreground">
                      {formatValue(goal.target - goal.current, goal.unit)} remaining
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
        
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
            <span className="text-sm font-semibold text-foreground">
              {((goals.reduce((acc, goal) => acc + (goal.current / goal.target), 0) / goals.length) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
}