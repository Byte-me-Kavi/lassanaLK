import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Package, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, city, total, created_at")
    .order("created_at", { ascending: false })
    .limit(3);

  // Fetch pending orders count
  const { count: pendingOrdersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "PENDING");

  // Fetch total products
  const { count: totalProductsCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  // Fetch low stock products
  const { data: lowStockProducts } = await supabase
    .from("products")
    .select("id, name, stock_quantity")
    .lt("stock_quantity", 5)
    .order("stock_quantity", { ascending: true })
    .limit(5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-brand-purple">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your store's performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (Placeholder)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs. 45,231</div>
            <p className="text-xs text-muted-foreground">Historical data not fully migrated</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrdersCount || 0}</div>
            <p className="text-xs text-muted-foreground">Orders awaiting processing</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProductsCount || 0}</div>
            <p className="text-xs text-muted-foreground">In catalog</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Reviews (Placeholder)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.9/5</div>
            <p className="text-xs text-muted-foreground">Based on reviews</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {(recentOrders || []).length > 0 ? (
                recentOrders?.map((order: any) => (
                  <div key={order.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Order {order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer_name} - {order.city}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">Rs. {order.total}</div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent orders found.</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {(lowStockProducts || []).length > 0 ? (
                lowStockProducts?.map((product: any) => (
                  <div key={product.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{product.name}</p>
                      <p className="text-sm text-red-500 font-medium">
                        {product.stock_quantity === 0 ? 'Out of stock' : `Only ${product.stock_quantity} left in stock`}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">All products are well stocked.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
