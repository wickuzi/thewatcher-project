'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Watch, User, AlertTriangle, ShoppingCart, Plus, Edit, Trash2, Tag, UserPlus, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { RecentSales } from '@/components/admin/RecentSales';

// Componente para mostrar una actividad individual
function ActivityItem({ activity }: { activity: any }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'watch_created':
      case 'watch_added':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'watch_updated':
      case 'stock_updated':
        return <Edit className="h-4 w-4 text-blue-500" />;
      case 'watch_deleted':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      case 'user_registered':
        return <UserPlus className="h-4 w-4 text-purple-500" />;
      case 'low_stock':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'watch_sold':
        return <ShoppingCart className="h-4 w-4 text-emerald-500" />;
      case 'price_updated':
        return <Tag className="h-4 w-4 text-orange-500" />;
      default:
        return <Plus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case 'watch_added':
        return (
          <span>
            <span className="font-medium">{activity.user}</span> agregó el reloj "{activity.watch}"
          </span>
        );
      case 'watch_updated':
        if (activity.details?.changes?.stock) {
          const { old: oldStock, new: newStock } = activity.details.changes.stock;
          const watchName = activity.details.watchName || activity.watch || 'un reloj';
          const action = newStock > oldStock ? 'aumentó' : 'disminuyó';
          
          return (
            <span>
              <span className="font-medium">{activity.user || 'Un administrador'}</span> {action} el stock de "{watchName}" de {oldStock} a {newStock} unidades
            </span>
          );
        }
        return (
          <span>
            <span className="font-medium">{activity.user || 'Un administrador'}</span> actualizó un reloj
          </span>
        );
      case 'watch_created':
        return `Se ha añadido el reloj "${activity.details?.watchName || activity.watch || 'nuevo reloj'}"`;
      case 'watch_deleted':
        return `Se ha eliminado un reloj`;
      case 'user_registered':
        const email = activity.details?.email || activity.email || 'correo no disponible';
        const userName = activity.details?.fullName || activity.user || 'Nuevo usuario';
        return (
          <span>
            <span className="font-medium">{userName}</span> se ha registrado ({email})
          </span>
        );
      case 'low_stock': {
        const remainingStock = activity.details?.remaining || 'algunas';
        const watchName = activity.details?.watchName || activity.watch || 'un reloj';
        return (
          <span>
            ¡Atención! Stock bajo en "{watchName}" - Quedan {remainingStock} unidades
          </span>
        );
      }
      case 'watch_sold': {
        const watchName = activity.details?.watchName || activity.watch || 'un reloj';
        const remaining = activity.details?.remaining ?? 'algunas';
        return (
          <span>
            Se ha vendido un modelo del reloj "{watchName}" - Quedan {remaining} en stock
          </span>
        );
      }
      default:
        return '';
    }
  };

  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-1">
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm font-medium leading-snug">
          {getActivityText(activity)}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {format(new Date(activity.date), 'PPPp')}
          </p>
          <Badge variant="outline" className="text-xs ml-2">
            {activity.type === 'watch_sold' ? 'Venta' : 
             activity.type === 'watch_created' ? 'Nuevo' :
             activity.type === 'watch_updated' ? 'Actualizado' :
             activity.type === 'watch_deleted' ? 'Eliminado' :
             activity.type === 'user_registered' ? 'Usuario' :
             activity.type === 'low_stock' ? 'Stock' : activity.type}
          </Badge>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPageClient({ realMetrics }: { realMetrics: any }) {
  const [showAll, setShowAll] = useState(false);
  const initialItems = 5;
  const activities = realMetrics.recentActivity || [];
  const displayActivities = showAll ? activities : activities.slice(0, initialItems);
  const canShowMore = activities.length > initialItems;

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
              {activities.filter((a: any) => a.type === 'watch_sold').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activities.length > 0 ? (
                <>
                  {displayActivities.map((activity: any) => (
                    <ActivityItem key={activity.id} activity={activity} />
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
                            Mostrar más ({activities.length - initialItems} más)
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
