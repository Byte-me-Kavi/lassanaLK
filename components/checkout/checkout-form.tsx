"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Truck, AlertCircle } from "lucide-react";

import { useCartStore } from "@/stores/cart-store";
import { checkoutFormSchema, type CheckoutFormValues } from "@/lib/validators/checkout";
import { SRI_LANKAN_DISTRICTS } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function CheckoutForm() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerWhatsapp: "",
      customerEmail: "",
      address: "",
      city: "",
      district: "" as any,
      postalCode: "",
      notes: "",
      codConfirmed: undefined, // ensure they have to check it
    },
  });

  const districtValue = watch("district");
  const codConfirmed = watch("codConfirmed");

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) {
      setError("Your cart is empty. Please add items before checking out.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Mock API call to create order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: data,
          items: items,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const result = await response.json();
      
      // Clear cart on success
      clearCart();
      
      // Redirect to confirmation page
      router.push(`/order-confirmed/${result.orderNumber}`);
      
    } catch (err) {
      setError("Something went wrong while placing your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Customer Information */}
      <div className="space-y-5 rounded-2xl border border-border/40 bg-white p-6">
        <h3 className="font-heading text-xl font-semibold border-b border-border/40 pb-4">
          Contact Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="customerName">Full Name *</Label>
            <Input id="customerName" {...register("customerName")} className={errors.customerName ? "border-red-500" : ""} />
            {errors.customerName && <p className="text-xs text-red-500">{errors.customerName.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone Number *</Label>
            <Input id="customerPhone" {...register("customerPhone")} placeholder="07XXXXXXXX" className={errors.customerPhone ? "border-red-500" : ""} />
            {errors.customerPhone && <p className="text-xs text-red-500">{errors.customerPhone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerWhatsapp">WhatsApp Number (Optional)</Label>
            <Input id="customerWhatsapp" {...register("customerWhatsapp")} placeholder="Same as phone if left empty" />
            {errors.customerWhatsapp && <p className="text-xs text-red-500">{errors.customerWhatsapp.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email (Optional)</Label>
            <Input id="customerEmail" type="email" {...register("customerEmail")} placeholder="For order receipts" />
            {errors.customerEmail && <p className="text-xs text-red-500">{errors.customerEmail.message}</p>}
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="space-y-5 rounded-2xl border border-border/40 bg-white p-6">
        <h3 className="font-heading text-xl font-semibold border-b border-border/40 pb-4">
          Delivery Address
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input id="address" {...register("address")} placeholder="House number and street name" className={errors.address ? "border-red-500" : ""} />
            {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label htmlFor="city">City / Town *</Label>
              <Input id="city" {...register("city")} className={errors.city ? "border-red-500" : ""} />
              {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="district">District *</Label>
              <Select 
                value={districtValue} 
                onValueChange={(val) => setValue("district", val as any, { shouldValidate: true })}
              >
                <SelectTrigger id="district" className={errors.district ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {SRI_LANKAN_DISTRICTS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.district && <p className="text-xs text-red-500">{errors.district.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code (Optional)</Label>
              <Input id="postalCode" {...register("postalCode")} />
              {errors.postalCode && <p className="text-xs text-red-500">{errors.postalCode.message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Order Notes (Optional)</Label>
        <Textarea 
          id="notes" 
          {...register("notes")} 
          placeholder="Notes about your order, e.g. special notes for delivery." 
          className="resize-none h-24"
        />
      </div>

      {/* COD Confirmation */}
      <div className="rounded-xl border border-brand-purple/20 bg-brand-cream/30 p-5 space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox 
            id="codConfirmed" 
            checked={codConfirmed} 
            onCheckedChange={(checked) => setValue("codConfirmed", checked === true ? true : undefined as any, { shouldValidate: true })}
            className="mt-1"
          />
          <div className="space-y-1 leading-none">
            <Label 
              htmlFor="codConfirmed" 
              className="text-base font-semibold text-brand-purple cursor-pointer"
            >
              Confirm Cash on Delivery Order *
            </Label>
            <p className="text-sm text-muted-foreground">
              By checking this, you agree to pay the total amount in cash to the courier upon delivery of your items.
            </p>
          </div>
        </div>
        {errors.codConfirmed && <p className="text-xs text-red-500 font-medium pl-7">{errors.codConfirmed.message}</p>}
      </div>

      <Button 
        type="submit" 
        size="lg" 
        disabled={isSubmitting || items.length === 0}
        className="w-full h-14 text-lg font-bold bg-brand-purple hover:bg-brand-purple-deep transition-all"
      >
        {isSubmitting ? "Processing Order..." : "Place COD Order"}
        {!isSubmitting && <Truck className="ml-2 h-5 w-5" />}
      </Button>
    </form>
  );
}
