"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";

export function ProductRowActions({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete ${productName}?`)) {
      setIsDeleting(true);
      try {
        const supabase = createClient();
        const { error } = await supabase.from("products").delete().eq("id", productId);
        if (error) throw error;
        router.refresh();
        toast.add({ title: "Success", description: "Product deleted.", type: "success" });
      } catch (error: any) {
        toast.add({ title: "Error", description: "Failed to delete product: " + error.message, type: "error" });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/portal/products/${productId}/edit`}>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-brand-purple">
          <Edit className="h-4 w-4" />
        </Button>
      </Link>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDelete}
        disabled={isDeleting}
        className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
