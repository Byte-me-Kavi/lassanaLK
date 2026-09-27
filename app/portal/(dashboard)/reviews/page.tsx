import { Search, CheckCircle, XCircle, Star, Edit, Trash2 } from "lucide-react";
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

const renderStars = (rating: number) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`h-4 w-4 ${star <= rating ? "text-brand-gold fill-brand-gold" : "text-gray-300"}`} />
      ))}
    </div>
  );
};

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data: rawReviews } = await supabase
    .from("reviews")
    .select("id, customer_name, rating, review_text, created_at, is_featured, is_approved, product:products(name)")
    .order("created_at", { ascending: false });

  const reviews = (rawReviews || []).map((r: any) => ({
    id: r.id,
    customer: r.customer_name,
    product: r.product?.name || "Unknown Product",
    rating: r.rating,
    text: r.review_text,
    date: new Date(r.created_at).toLocaleDateString(),
    status: r.is_featured ? "Featured" : r.is_approved ? "Approved" : "Pending",
  }));
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-brand-purple">Reviews</h1>
          <p className="text-muted-foreground mt-1">Moderate customer reviews before they appear on the store.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border/40 overflow-hidden">
        <div className="p-4 border-b border-border/40 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search reviews..." className="pl-9 bg-brand-cream/30" />
          </div>
          <div className="hidden sm:flex gap-2 overflow-x-auto">
            <Button variant="outline" size="sm" className="bg-brand-cream/30">All</Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">Pending</Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">Approved</Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">Featured</Button>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Review</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="max-w-xs">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{review.customer}</p>
                    {renderStars(review.rating)}
                    <p className="text-sm text-muted-foreground line-clamp-2">{review.text}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{review.product}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{review.date}</TableCell>
                <TableCell>
                  <Badge 
                    variant={review.status === "Pending" ? "secondary" : "default"} 
                    className={
                      review.status === "Pending" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                      review.status === "Featured" ? "bg-brand-gold text-white hover:bg-brand-gold" : 
                      "bg-green-100 text-green-700 hover:bg-green-100"
                    }
                  >
                    {review.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {review.status === "Pending" && (
                      <>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" title="Approve">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" title="Reject">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-brand-purple">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
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
