"use client";

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Sale {
  id: string;
  type: string;
  watchName: string;
  watchId: string;
  price?: number;
  cost?: number;
  details: {
    watchName?: string;
    remaining?: number;
    stock?: number;
    quantity?: number;
    price?: number;
    cost?: number;
  };
  date: string | Date;
  soldBy?: string;
}

export function RecentSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const itemsPerPage = 3; // Número de elementos a mostrar inicialmente

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch('/api/admin/sales');
        const data = await response.json();
        if (response.ok) {
          setSales(data.sales || []);
        }
      } catch (error) {
        console.error('Error fetching sales:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Filter out any invalid sales
  const validSales = sales.filter(sale => 
    sale && 
    sale.id && 
    (sale.watchName || (sale.details?.watchName)) &&
    sale.date
  );

  // Calculate total sales, total amount and total profit
  const { totalSales, totalAmount, totalProfit } = sales.reduce((acc, sale) => {
    if (sale.type !== 'watch_sold') return acc;
    
    const quantity = sale.details?.quantity || 1;
    
    // Get price from either sale.price or sale.details.price, default to 0 if not available
    const price = typeof sale.price === 'number' ? sale.price : 
                 (sale.details?.price ? Number(sale.details.price) : 0);
    
    // Get cost from either sale.cost or sale.details.cost, default to 0 if not available
    const cost = typeof sale.cost === 'number' ? sale.cost : 
                (sale.details?.cost ? Number(sale.details.cost) : 0);
    
    // Ensure we have valid numbers
    const validPrice = isNaN(price) ? 0 : Number(price);
    const validCost = isNaN(cost) ? 0 : Number(cost);
    
    const saleRevenue = validPrice * quantity;
    const saleCost = validCost * quantity;
    const saleProfit = saleRevenue - saleCost;
    
    // Debug log for each sale
    console.log('Sale:', {
      watch: sale.watchName || sale.details?.watchName,
      price: validPrice,
      cost: validCost,
      quantity,
      revenue: saleRevenue,
      profit: saleProfit
    });
    
    return {
      totalSales: acc.totalSales + quantity, // Count each item sold
      totalAmount: acc.totalAmount + saleRevenue,
      totalProfit: acc.totalProfit + saleProfit
    };
  }, { totalSales: 0, totalAmount: 0, totalProfit: 0 });
  
  // Debug logs
  console.log('Sales data:', sales);
  console.log('Total items sold:', totalSales);
  console.log('Total revenue:', totalAmount);
  console.log('Total profit:', totalProfit);
  
  // Format the amounts as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const formattedAmount = formatCurrency(totalAmount);
  const formattedProfit = formatCurrency(totalProfit);

  return (
    <Card className="col-span-3">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Ventas Recientes</CardTitle>
          <div className="flex flex-col items-end">
            <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
              {totalSales} {totalSales === 1 ? 'venta' : 'ventas'}
            </div>
            <div className="mt-1 space-y-1">
              {totalAmount > 0 ? (
                <div className="text-green-600 font-medium text-sm">
                  Ventas: +{formattedAmount}
                </div>
              ) : (
                <div className="text-gray-500 text-xs">Sin ventas registradas</div>
              )}
              {totalProfit !== 0 && (
                <div className={`text-sm ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  {totalProfit >= 0 ? 'Ganancia' : 'Pérdida'}: {totalProfit >= 0 ? '+' : ''}{formattedProfit}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {validSales.length > 0 ? (
          <div className="divide-y">
            {validSales.slice(0, showAll ? validSales.length : itemsPerPage).map((sale) => {
              const watchName = sale.details?.watchName || sale.watchName || 'un reloj';
              // Try to get the remaining stock from different possible locations
              const availableStock = 
                sale.details?.remaining ?? // Check details.remaining first
                (sale.details?.stock !== undefined ? sale.details.stock : null); // Then check details.stock
              
              const remainingText = availableStock !== null && availableStock !== undefined
                ? `Stock restante: ${availableStock}`
                : '';
              
              let formattedDate;
              try {
                formattedDate = format(new Date(sale.date), 'PPPp');
              } catch (e) {
                console.error('Error formatting date:', sale.date, e);
                formattedDate = 'Fecha no disponible';
              }

              return (
                <div key={sale.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">
                        Venta de {watchName}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {remainingText}
                      </p>
                      <p className="text-xl font-bold">{totalSales} {totalSales === 1 ? 'unidad' : 'unidades'}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formattedDate}
                      </p>
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full self-center">
                      Vendido
                    </div>
                  </div>
                </div>
              );
            })}
            {validSales.length > itemsPerPage && (
              <div className="flex justify-center mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Mostrar menos
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Mostrar más ({validSales.length - itemsPerPage} más)
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            No hay ventas recientes
          </div>
        )}
      </CardContent>
    </Card>
  );
}
