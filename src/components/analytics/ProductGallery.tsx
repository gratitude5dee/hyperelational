import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Import product images
import tshirtBlack from '@/assets/products/tshirt-black.jpg';
import hoodieNavy from '@/assets/products/hoodie-navy.jpg';
import capWhite from '@/assets/products/cap-white.jpg';
import posterVintage from '@/assets/products/poster-vintage.jpg';
import vinylRecord from '@/assets/products/vinyl-record.jpg';
import pinEnamel from '@/assets/products/pin-enamel.jpg';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  revenue: number;
  totalSold: number;
  inventoryStatus: 'low' | 'good' | 'overstocked';
  imageUrl: string;
}

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Tour T-Shirt',
    category: 'Apparel',
    price: 25,
    revenue: 31250,
    totalSold: 1250,
    inventoryStatus: 'good',
    imageUrl: tshirtBlack
  },
  {
    id: '2',
    name: 'Limited Edition Hoodie',
    category: 'Apparel',
    price: 60,
    revenue: 28800,
    totalSold: 480,
    inventoryStatus: 'low',
    imageUrl: hoodieNavy
  },
  {
    id: '3',
    name: 'Branded Baseball Cap',
    category: 'Accessories',
    price: 20,
    revenue: 17800,
    totalSold: 890,
    inventoryStatus: 'good',
    imageUrl: capWhite
  },
  {
    id: '4',
    name: 'Concert Poster',
    category: 'Collectibles',
    price: 20,
    revenue: 6400,
    totalSold: 320,
    inventoryStatus: 'overstocked',
    imageUrl: posterVintage
  },
  {
    id: '5',
    name: 'Vinyl Album',
    category: 'Music',
    price: 30,
    revenue: 22500,
    totalSold: 750,
    inventoryStatus: 'good',
    imageUrl: vinylRecord
  },
  {
    id: '6',
    name: 'Enamel Pin Set',
    category: 'Accessories',
    price: 10,
    revenue: 14500,
    totalSold: 1450,
    inventoryStatus: 'low',
    imageUrl: pinEnamel
  }
];

const INVENTORY_COLORS = {
  low: 'bg-destructive',
  good: 'bg-success',
  overstocked: 'bg-warning'
};

export function ProductGallery() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Gallery</CardTitle>
        <CardDescription>Visual overview of your merchandise collection</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {SAMPLE_PRODUCTS.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="mt-2 space-y-1">
                <div className="font-medium text-sm truncate">{product.name}</div>
                <div className="text-xs text-muted-foreground">{product.category}</div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">${product.price}</span>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${INVENTORY_COLORS[product.inventoryStatus]} text-white`}
                  >
                    {product.inventoryStatus}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {product.totalSold} sold • ${product.revenue.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}