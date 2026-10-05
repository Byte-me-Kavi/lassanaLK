import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, User, Calendar, CreditCard, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { OrderStatusUpdater } from "@/components/admin/order-status-updater";

export const metadata = {
  title: "Order Details | Lassana LK Admin",
};

export default async function OrderDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const orderId = params.id;
  const supabase = await createClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(
        *,
        customizations:order_item_customizations(*)
      )
    `)
    .eq("id", orderId)
    .single();

  if (error || !order) {
    notFound();
  }

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
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/portal/orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-brand-purple flex flex-wrap items-center gap-3">
              Order {order.order_number}
              {getStatusBadge(order.status)}
            </h1>
            <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
              <Calendar className="h-3 w-3" />
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {order.customer_whatsapp || order.customer_phone ? (
            <a href={`https://wa.me/${(order.customer_whatsapp || order.customer_phone).replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp Customer
              </Button>
            </a>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4 border-b border-border/40 pb-6 last:border-0 last:pb-0">
                    {item.product_image_url ? (
                      <div className="h-20 w-20 rounded-md overflow-hidden bg-slate-100 shrink-0">
                        <img src={item.product_image_url} alt={item.product_name} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-20 w-20 rounded-md bg-slate-100 shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-brand-purple">{item.product_name}</h4>
                        <p className="font-medium">Rs. {item.total}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Rs. {item.price} x {item.quantity}
                      </p>
                      
                      {item.customizations && item.customizations.length > 0 && (
                        <div className="mt-3 bg-brand-cream/30 p-3 rounded-md border border-border/40 space-y-1">
                          <p className="text-xs font-semibold text-brand-purple uppercase tracking-wider mb-2">Personalization</p>
                          {item.customizations.map((c: any) => (
                            <div key={c.id} className="text-sm flex">
                              <span className="text-muted-foreground w-32 shrink-0">{c.field_label}:</span>
                              <span className="font-medium break-all">{c.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rs. {order.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>Rs. {order.delivery_fee}</span>
                </div>
                <div className="border-t border-border/50 pt-2 mt-2 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-brand-purple">Rs. {order.total}</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Payment Method:</span>
                  <Badge variant="outline">{order.payment_method}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-brand-purple shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{order.customer_name}</p>
                  {order.customer_email && <p className="text-sm text-muted-foreground">{order.customer_email}</p>}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-brand-purple shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">{order.customer_phone}</p>
                  {order.customer_whatsapp && order.customer_whatsapp !== order.customer_phone && (
                    <p className="text-xs text-muted-foreground">WA: {order.customer_whatsapp}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-purple shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                  <p>{order.address}</p>
                  <p>{order.city}, {order.district}</p>
                  {order.postal_code && <p>{order.postal_code}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
