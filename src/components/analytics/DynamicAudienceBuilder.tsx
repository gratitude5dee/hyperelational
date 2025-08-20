import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Plus, X, Users, Target, Download, Code, Wand2, Lightbulb } from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { useToast } from '@/hooks/use-toast';

interface FilterCondition {
  id: string;
  entity: string;
  field: string;
  operator: string;
  value: string;
  type: 'standard' | 'predictive';
}

interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  conditions: FilterCondition[];
  estimatedSize: number;
  lastUpdated: string;
}

interface FieldConfig {
  label: string;
  type: 'string' | 'number' | 'date' | 'select';
  prefix?: string;
  options?: string[];
}

interface EntityConfig {
  name: string;
  fields: Record<string, FieldConfig>;
}

const ENTITIES: Record<string, EntityConfig> = {
  customers: {
    name: 'Customers',
    fields: {
      age: { label: 'Age', type: 'number' },
      city: { label: 'City', type: 'string' },
      segment: { label: 'Segment', type: 'select', options: ['premium', 'regular', 'new'] },
      lifetime_value: { label: 'Lifetime Value', type: 'number', prefix: '$' },
      last_purchase: { label: 'Last Purchase', type: 'date' }
    }
  },
  orders: {
    name: 'Orders',
    fields: {
      amount: { label: 'Order Amount', type: 'number', prefix: '$' },
      created_at: { label: 'Order Date', type: 'date' },
      quantity: { label: 'Item Quantity', type: 'number' }
    }
  },
  products: {
    name: 'Products',
    fields: {
      category: { label: 'Category', type: 'string' },
      price: { label: 'Price', type: 'number', prefix: '$' },
      brand: { label: 'Brand', type: 'string' }
    }
  }
};

const PREDICTIVE_CONDITIONS = [
  { 
    label: 'Predicted Churn Risk', 
    field: 'churn_probability',
    description: 'Likelihood of customer churning in next 90 days'
  },
  { 
    label: 'Predicted LTV', 
    field: 'predicted_ltv',
    description: 'Estimated future lifetime value'
  },
  { 
    label: 'Purchase Propensity', 
    field: 'purchase_probability',
    description: 'Likelihood to make a purchase in next 30 days'
  }
];

const OPERATORS = {
  string: [
    { value: 'equals', label: 'equals' },
    { value: 'not_equals', label: 'does not equal' },
    { value: 'contains', label: 'contains' },
    { value: 'starts_with', label: 'starts with' }
  ],
  number: [
    { value: 'equals', label: '=' },
    { value: 'greater_than', label: '>' },
    { value: 'less_than', label: '<' },
    { value: 'greater_or_equal', label: '>=' },
    { value: 'less_or_equal', label: '<=' }
  ],
  date: [
    { value: 'after', label: 'after' },
    { value: 'before', label: 'before' },
    { value: 'last_days', label: 'in last X days' },
    { value: 'next_days', label: 'in next X days' }
  ]
};

export function DynamicAudienceBuilder() {
  const [conditions, setConditions] = useState<FilterCondition[]>([]);
  const [savedSegments, setSavedSegments] = useState<AudienceSegment[]>([]);
  const [segmentName, setSegmentName] = useState('');
  const [previewSize, setPreviewSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentProject } = useAppStore();
  const { toast } = useToast();

  const addCondition = (type: 'standard' | 'predictive' = 'standard') => {
    const newCondition: FilterCondition = {
      id: crypto.randomUUID(),
      entity: type === 'standard' ? 'customers' : 'predictive',
      field: type === 'standard' ? 'age' : 'churn_probability',
      operator: 'greater_than',
      value: '',
      type
    };
    setConditions([...conditions, newCondition]);
  };

  const updateCondition = (id: string, updates: Partial<FilterCondition>) => {
    setConditions(conditions.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ));
  };

  const removeCondition = (id: string) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const previewAudience = async () => {
    if (conditions.length === 0) {
      toast({
        title: "No Conditions",
        description: "Add at least one condition to preview the audience.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call for preview
    setTimeout(() => {
      const estimatedSize = Math.floor(Math.random() * 10000) + 500;
      setPreviewSize(estimatedSize);
      setLoading(false);
      
      toast({
        title: "Audience Preview Ready",
        description: `Found approximately ${estimatedSize.toLocaleString()} matching users.`,
      });
    }, 1500);
  };

  const saveSegment = () => {
    if (!segmentName.trim()) {
      toast({
        title: "Segment Name Required",
        description: "Please enter a name for this audience segment.",
        variant: "destructive"
      });
      return;
    }

    if (conditions.length === 0) {
      toast({
        title: "No Conditions",
        description: "Add at least one condition before saving.",
        variant: "destructive"
      });
      return;
    }

    const newSegment: AudienceSegment = {
      id: crypto.randomUUID(),
      name: segmentName,
      description: generateSegmentDescription(),
      conditions: [...conditions],
      estimatedSize: previewSize || 0,
      lastUpdated: new Date().toISOString()
    };

    setSavedSegments([...savedSegments, newSegment]);
    setSegmentName('');
    setConditions([]);
    setPreviewSize(null);

    toast({
      title: "Segment Saved",
      description: `"${newSegment.name}" has been saved to your audience library.`,
    });
  };

  const generateSegmentDescription = () => {
    if (conditions.length === 0) return '';
    
    const descriptions = conditions.map(condition => {
      if (condition.type === 'predictive') {
        const predictive = PREDICTIVE_CONDITIONS.find(p => p.field === condition.field);
        return `${predictive?.label || 'Unknown'} ${condition.operator} ${condition.value}`;
      } else {
        const entity = ENTITIES[condition.entity];
        const field = entity?.fields?.[condition.field];
        return `${entity?.name || 'Unknown'} ${field?.label || 'Unknown'} ${condition.operator} ${condition.value}`;
      }
    });

    return descriptions.join(' AND ');
  };

  const exportSegment = (segment: AudienceSegment) => {
    toast({
      title: "Export Started",
      description: "Your audience segment is being prepared for export to CSV.",
    });
    
    // In a real implementation, this would call an API to generate and download the CSV
    console.log('Exporting segment:', segment);
  };

  const renderConditionBuilder = (condition: FilterCondition) => {
    if (condition.type === 'predictive') {
      const predictiveField = PREDICTIVE_CONDITIONS.find(p => p.field === condition.field);
      
      return (
        <div key={condition.id} className="glass-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-primary" />
              <Badge variant="secondary">Predictive</Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeCondition(condition.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm">Prediction Type</Label>
              <Select
                value={condition.field}
                onValueChange={(value) => updateCondition(condition.id, { field: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PREDICTIVE_CONDITIONS.map(pred => (
                    <SelectItem key={pred.field} value={pred.field}>
                      {pred.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {predictiveField && (
                <p className="text-xs text-muted-foreground mt-1">
                  {predictiveField.description}
                </p>
              )}
            </div>
            
            <div>
              <Label className="text-sm">Operator</Label>
              <Select
                value={condition.operator}
                onValueChange={(value) => updateCondition(condition.id, { operator: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OPERATORS.number.map(op => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm">Value</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                max="1"
                placeholder="0.75"
                value={condition.value}
                onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {condition.field.includes('probability') ? '0 = 0%, 1 = 100%' : 'Dollar amount'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Standard condition rendering
    const entity = ENTITIES[condition.entity];
    const field = entity?.fields?.[condition.field];
    const operators = field?.type ? OPERATORS[field.type] || OPERATORS.string : OPERATORS.string;

    return (
      <div key={condition.id} className="glass-card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="outline">Standard Filter</Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeCondition(condition.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-sm">Entity</Label>
            <Select
              value={condition.entity}
              onValueChange={(value) => {
                const newEntity = ENTITIES[value];
                const firstFieldKey = Object.keys(newEntity?.fields || {})[0];
                updateCondition(condition.id, { 
                  entity: value, 
                  field: firstFieldKey || 'age'
                });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ENTITIES).map(([key, entity]) => (
                  <SelectItem key={key} value={key}>
                    {entity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm">Field</Label>
            <Select
              value={condition.field}
              onValueChange={(value) => updateCondition(condition.id, { field: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(entity?.fields || {}).map(([key, field]) => (
                  <SelectItem key={key} value={key}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm">Operator</Label>
            <Select
              value={condition.operator}
              onValueChange={(value) => updateCondition(condition.id, { operator: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {operators.map(op => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm">Value</Label>
            <div className="relative">
              {field?.prefix && (
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                  {field.prefix}
                </span>
              )}
              <Input
                type={field?.type === 'number' ? 'number' : field?.type === 'date' ? 'date' : 'text'}
                className={field?.prefix ? 'pl-8' : ''}
                placeholder={
                  field?.type === 'number' ? '100' : 
                  field?.type === 'date' ? '2024-01-01' : 
                  'Enter value'
                }
                value={condition.value}
                onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Dynamic Audience Builder
          </CardTitle>
          <CardDescription>
            Create highly specific audience segments using both historical data and AI predictions.
            Perfect for targeted marketing campaigns on Meta, Google Ads, and email platforms.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Condition Builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Build Your Audience</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addCondition('standard')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Filter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addCondition('predictive')}
                  className="bg-primary/5 border-primary/20"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Add Prediction
                </Button>
              </div>
            </div>

            {conditions.length === 0 ? (
              <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertDescription>
                  Start building your audience by adding filters and predictive conditions. 
                  For example: "Customers who purchased in the last 60 days AND have churn risk &gt; 70%"
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {conditions.map((condition, index) => (
                  <div key={condition.id}>
                    {index > 0 && (
                      <div className="flex items-center justify-center py-2">
                        <Badge variant="secondary">AND</Badge>
                      </div>
                    )}
                    {renderConditionBuilder(condition)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview Section */}
          {conditions.length > 0 && (
            <div className="space-y-4">
              <Separator />
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Preview Audience</h3>
                <Button onClick={previewAudience} disabled={loading}>
                  {loading ? 'Calculating...' : 'Preview Size'}
                </Button>
              </div>

              {previewSize !== null && (
                <Alert>
                  <Users className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{previewSize.toLocaleString()}</strong> users match your criteria.
                    This audience would be great for targeted campaigns.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Segment Name</Label>
                  <Input
                    placeholder="e.g., High-Value At-Risk Customers"
                    value={segmentName}
                    onChange={(e) => setSegmentName(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={saveSegment} className="w-full">
                    Save Segment
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved Segments */}
      {savedSegments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Audience Segments</CardTitle>
            <CardDescription>
              Manage and export your saved audience segments for marketing campaigns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savedSegments.map((segment) => (
                <div key={segment.id} className="glass-card p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{segment.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {segment.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {segment.estimatedSize.toLocaleString()} users
                        </span>
                        <span className="text-muted-foreground">
                          Updated {new Date(segment.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportSegment(segment)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(segment.conditions, null, 2));
                          toast({ title: "Copied", description: "Segment conditions copied to clipboard" });
                        }}
                      >
                        <Code className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}