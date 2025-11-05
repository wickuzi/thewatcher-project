'use client';

import { useState, useEffect } from 'react';
import { Watch, User, AlertTriangle, ShoppingCart, ChevronDown, ChevronUp, X, PlusCircle, Edit, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RecentSales } from '@/components/admin/RecentSales';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
// Temporarily commenting out the missing import
// import { ActivityItem } from '@/components/activity/ActivityItem';

type ChangeDetail = {
  old: any;
  new: any;
};

interface Activity {
  id: string;
  type: 'watch_added' | 'stock_updated' | 'user_registered' | 'low_stock' | 'watch_updated' | 'watch_created' | 'watch_deleted' | 'watch_sold';
  user?: string;
  watch?: string;
  email?: string;
  details?: {
    changes?: {
      stock?: {
        old: number;
        new: number;
      };
      [key: string]: any;
    };
    watchName?: string;
    email?: string;
    fullName?: string;
    user?: string;
    remaining?: number | string;
    [key: string]: any; // Allow any other properties
  };
  changes?: {
    stock?: {
      old: number;
      new: number;
    };
    [key: string]: any;
  };
  stock?: {
    old: number;
    new: number;
  };
  old?: number;
  new?: number;
  watchName?: string;
  date: string | Date;
}

// Datos por defecto en caso de error
const defaultMetrics = {
  totalWatches: 0,
  totalUsers: 0,
  lowStockWatches: 0,
  recentActivity: []
};

async function loadRealData() {
  try {
    console.log('Fetching data from API...');
    const [watchesRes, usersRes, activityRes] = await Promise.all([
      fetch('http://localhost:3000/api/admin/watches/count', { cache: 'no-store' }),
      fetch('http://localhost:3000/api/admin/users/count', { cache: 'no-store' }),
      fetch('http://localhost:3000/api/admin/activity', { cache: 'no-store' })
    ]);

    const watchesData = await watchesRes.json();
    const usersData = await usersRes.json();
    const activityData = await activityRes.json();

    console.log('Watches data:', watchesData);
    console.log('Users data:', usersData);
    console.log('Activity data:', activityData);

    return {
      totalWatches: watchesData.count || 0,
      totalUsers: usersData.count || 0,
      lowStockWatches: watchesData.lowStockCount || 0,
      recentActivity: activityData.activities || []
    };
  } catch (error) {
    console.error('Error cargando datos:', error);
    return defaultMetrics; // Devuelve los valores por defecto en caso de error
  }
}

export default function DashboardPage() {
  const [realMetrics, setRealMetrics] = useState({
    totalWatches: 0,
    totalUsers: 0,
    lowStockWatches: 0,
    recentActivity: [] as Activity[]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  
  const initialItems = 5;
  const displayActivities = showAll 
    ? realMetrics.recentActivity 
    : realMetrics.recentActivity.slice(0, initialItems);
  const canShowMore = realMetrics.recentActivity.length > initialItems;

  // Load data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const metrics = await loadRealData();
        setRealMetrics(metrics);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getActivityText = (activity: Activity) => {
    // Skip if activity is empty or malformed
    if (!activity || !activity.type) return null;
    
    const watchName = activity.details?.watchName || activity.watch || 'un reloj';
    const user = activity.user || 'Un administrador';
    
    switch (activity.type) {
      case 'watch_added':
        return (
          <div className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4 text-blue-500" />
            <div className="inline">
              <span className="font-medium">{user}</span> agregó el reloj "{watchName}"
            </div>
          </div>
        );
      
      case 'watch_updated':
        if (activity.details?.changes?.stock) {
          const { old: oldStock, new: newStock } = activity.details.changes.stock;
          if (typeof oldStock === 'number' && typeof newStock === 'number') {
            const action = newStock > oldStock ? 'aumentó' : 'disminuyó';
            return (
              <div className="flex items-center gap-2">
                <Edit className="h-4 w-4 text-yellow-500" />
                <span>
                  <span className="font-medium">{user}</span> {action} el stock de "{watchName}" de {oldStock} a {newStock} unidades
                </span>
              </div>
            );
          }
        }
        
        // Handle other changes
        if (activity.details?.changes) {
          const changes = Object.entries(activity.details.changes)
            .map(([key, change]) => {
              if (!change) return null;
              const { old: oldVal, new: newVal } = change as ChangeDetail;
              if (oldVal === undefined || newVal === undefined) return null;
              
              switch (key) {
                case 'name': return `el nombre a "${newVal}"`;
                case 'price': return `el precio a $${newVal}`;
                case 'stock': return `el stock a ${newVal}`;
                default: return `${key} a ${newVal}`;
              }
            })
            .filter(Boolean);
          
          if (changes.length > 0) {
            return (
              <span>
                <span className="font-medium">{user}</span> actualizó {changes.join(', ')} de "{watchName}"
              </span>
            );
          }
        }
        
        // Fallback for generic update
        return (
          <div className="flex items-center gap-2">
            <Edit className="h-4 w-4 text-yellow-500" />
            <span>
              <span className="font-medium">{user}</span> actualizó el reloj "{watchName}"
            </span>
          </div>
        );
      
      case 'watch_sold':
        const remaining = activity.details?.remaining;
        const remainingText = remaining !== undefined && remaining !== null
          ? `Stock restante: ${remaining}`
          : '';
          
        return (
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-green-500" />
            <span>
              Se ha vendido un modelo del reloj "{watchName}"{remainingText && ` - ${remainingText}`}
            </span>
          </div>
        );
      
      case 'user_registered':
        // Get email from the most reliable source first
        const userEmail = activity.details?.email || activity.email || 'correo no disponible';
        
        // Try to get the name from different possible locations
        const userName = activity.details?.fullName || 
                        activity.details?.user || 
                        activity.user || 
                        'Usuario';
        
        return (
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-purple-500" />
            <span>
              {userName} se ha registrado con el correo: {userEmail}
            </span>
          </div>
        );
      
      default:
        return null; // Skip unknown activity types
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Panel de Administración</h1>
        <p className="text-muted-foreground">
          Resumen general de la aplicación y actividades recientes
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Relojes</CardTitle>
            <Watch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realMetrics.totalWatches}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Registrados</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realMetrics.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relojes con Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realMetrics.lowStockWatches}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Recientes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {realMetrics.recentActivity.filter((activity: Activity) => activity.type === 'watch_sold').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Actividad Reciente</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowClearDialog(true)}
            >
              Limpiar todo
            </Button>
            
            <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-xl">¿Estás seguro?</DialogTitle>
                  <DialogDescription className="text-base">
                    Esta acción eliminará permanentemente todo el historial de actividades y no se podrá deshacer.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowClearDialog(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/admin/activity/clear', {
                          method: 'DELETE',
                        });
                        
                        if (response.ok) {
                          toast({
                            title: 'Éxito',
                            description: 'Todas las actividades han sido eliminadas',
                            variant: 'default',
                          });
                          setShowClearDialog(false);
                          // Refresh the page to show empty state after a short delay
                          setTimeout(() => window.location.reload(), 1500);
                        } else {
                          const error = await response.json();
                          toast({
                            title: 'Error',
                            description: `Error al limpiar actividades: ${error.error || 'Error desconocido'}`,
                            variant: 'destructive',
                          });
                        }
                      } catch (error) {
                        console.error('Error clearing activities:', error);
                        toast({
                          title: 'Error de conexión',
                          description: 'No se pudo conectar con el servidor',
                          variant: 'destructive',
                        });
                      }
                    }}
                  >
                    Sí, limpiar todo
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {realMetrics.recentActivity.length > 0 ? (
                <>
                  {displayActivities.map((activity: Activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm">{getActivityText(activity)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                  ))}
                  {canShowMore && (
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
                            Mostrar más ({realMetrics.recentActivity.length - initialItems} más)
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">No hay actividad reciente</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Panel de Ventas Recientes */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
