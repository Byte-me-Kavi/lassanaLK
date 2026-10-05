"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";

const STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PROCESSING", label: "Processing" },
  { value: "READY_TO_SHIP", label: "Ready to Ship" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (status === currentStatus) return;
    
    setIsUpdating(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);
        
      if (error) throw error;
      
      toast.add({ title: "Success", description: "Status updated successfully!", type: "success" });
      router.refresh();
    } catch (error: any) {
      toast.add({ title: "Error", description: "Failed to update status: " + error.message, type: "error" });
      setStatus(currentStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Select value={status} onValueChange={(val: string | null) => val && setStatus(val)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        onClick={handleUpdate} 
        disabled={isUpdating || status === currentStatus}
        className="w-full bg-brand-purple hover:bg-brand-purple-deep"
      >
        <Check className="h-4 w-4 mr-2" />
        {isUpdating ? "Updating..." : "Update Status"}
      </Button>
    </div>
  );
}
