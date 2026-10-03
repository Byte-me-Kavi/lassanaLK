"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { CustomizationFieldWithOptions } from "@/lib/types";

interface ProductCustomizerProps {
  fields: CustomizationFieldWithOptions[];
  onChange: (values: Record<string, string>) => void;
}

export function ProductCustomizer({ fields, onChange }: ProductCustomizerProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    onChange(newValues);
  };

  if (fields.length === 0) return null;

  return (
    <div className="space-y-5 bg-brand-cream/50 p-5 rounded-xl border border-border/40">
      <h3 className="font-semibold text-brand-purple">Personalize Your Item</h3>
      
      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id} className="text-foreground font-medium">
            {field.field_label} {field.is_required && <span className="text-red-500">*</span>}
          </Label>
          
          {field.field_type === "text" && (
            <Input
              id={field.id}
              placeholder={field.placeholder || ""}
              value={values[field.field_name] || ""}
              onChange={(e) => handleChange(field.field_name, e.target.value)}
              className="bg-white border-border/40 focus-visible:ring-brand-purple"
            />
          )}

          {field.field_type === "textarea" && (
            <Textarea
              id={field.id}
              placeholder={field.placeholder || ""}
              value={values[field.field_name] || ""}
              onChange={(e) => handleChange(field.field_name, e.target.value)}
              className="bg-white border-border/40 focus-visible:ring-brand-purple min-h-20"
            />
          )}

          {field.field_type === "select" && field.options && (
            <Select
              value={values[field.field_name] || ""}
              onValueChange={(val) => handleChange(field.field_name, val || "")}
            >
              <SelectTrigger id={field.id} className="bg-white border-border/40 focus:ring-brand-purple">
                <SelectValue placeholder={field.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {field.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      ))}
    </div>
  );
}
