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
  /** Show the gold script preview under name fields (name pendants only) */
  showNamePreview?: boolean;
}

// Fields that hold the words being engraved get a live script preview
const ENGRAVING_FIELD = /name|text|engrav|word|initial/i;

const fieldClass =
  "h-12 rounded-xl border-input bg-white px-4 text-base focus-visible:border-brand-purple focus-visible:ring-3 focus-visible:ring-brand-purple/15";

export function ProductCustomizer({ fields, onChange, showNamePreview = false }: ProductCustomizerProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    onChange(newValues);
  };

  if (fields.length === 0) return null;

  return (
    <div className="rounded-2xl border border-brand-purple/12 bg-white p-5 md:p-6">
      <h2 className="text-2xl">Personalize it</h2>
      <p className="mt-1 text-[15px] text-muted-foreground">
        Fields marked <span className="text-destructive">*</span> are needed before you can add this to your cart.
      </p>

      <div className="mt-5 space-y-5">
        {fields.map((field) => {
          const value = values[field.field_name] || "";
          const showPreview =
            showNamePreview &&
            field.field_type === "text" &&
            ENGRAVING_FIELD.test(`${field.field_name} ${field.field_label}`);

          return (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id} className="text-[15px] font-semibold text-foreground">
                {field.field_label}
                {field.is_required && <span className="text-destructive">*</span>}
              </Label>

              {field.field_type === "text" && (
                <Input
                  id={field.id}
                  placeholder={field.placeholder || ""}
                  value={value}
                  maxLength={field.max_length || undefined}
                  onChange={(e) => handleChange(field.field_name, e.target.value)}
                  className={fieldClass}
                />
              )}

              {field.field_type === "textarea" && (
                <Textarea
                  id={field.id}
                  placeholder={field.placeholder || ""}
                  value={value}
                  maxLength={field.max_length || undefined}
                  onChange={(e) => handleChange(field.field_name, e.target.value)}
                  className="min-h-24 rounded-xl border-input bg-white px-4 py-3 text-base focus-visible:border-brand-purple focus-visible:ring-3 focus-visible:ring-brand-purple/15"
                />
              )}

              {field.field_type === "select" && field.options && (
                <Select value={value} onValueChange={(val) => handleChange(field.field_name, val || "")}>
                  <SelectTrigger id={field.id} className="h-12 w-full rounded-xl bg-white px-4 text-base">
                    <SelectValue placeholder={field.placeholder || "Choose an option"} />
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

              {field.max_length && (field.field_type === "text" || field.field_type === "textarea") && (
                <p className="tabular text-right text-xs text-muted-foreground">
                  {value.length}/{field.max_length}
                </p>
              )}

              {showPreview && value.trim() && (
                <div className="flex min-h-24 items-center justify-center overflow-hidden rounded-xl bg-brand-purple-deep px-4 py-4">
                  <span
                    className="gold-foil font-script whitespace-nowrap text-5xl leading-[1.2] md:text-6xl"
                    style={{ animation: "fade-blur-in 400ms var(--ease-out) both" }}
                  >
                    {value.trim()}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
