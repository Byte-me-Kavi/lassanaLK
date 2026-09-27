import Link from "next/link";
import { Search, Edit, Eye, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: rawOrders } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, customer_phone, total, status, created_at")
    .order("created_at", { ascending: false });

  const orders = (rawOrders || []).map((o: any) => ({
    id: o.id,
    order_number: o.order_number,
    customer: o.customer_name,
    phone: o.customer_phone,
    date: new Date(o.created_at).toLocaleDateString(),
    total: o.total,
    status: o.status,
  }));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "CONFIRMED": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Confirmed</Badge>;
      case "PROCESSING": return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Processing</Badge>;
      case "READY_TO_SHIP": return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Ready to Ship</Badge>;
      case "SHIPPED": return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Shipped</Badge>;
      case "DELIVERED": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Delivered</Badge>;
      case "CANCELLED": return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-brand-purple">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage Cash on Delivery orders and track fulfillment.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border/40 overflow-hidden">
        <div className="p-4 border-b border-border/40 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by order number or phone..." className="pl-9 bg-brand-cream/30" />
          </div>
          <div className="hidden sm:flex gap-2 overflow-x-auto">
            <Button variant="outline" size="sm" className="bg-brand-cream/30">All</Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">Pending</Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">Confirmed</Button>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <span className="font-medium text-brand-purple">{order.order_number}</span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{order.date}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.phone}</p>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-right font-medium">Rs. {order.total}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" title="Contact via WhatsApp">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-brand-purple">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
