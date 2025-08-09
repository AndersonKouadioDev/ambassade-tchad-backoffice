"use client";

import va from "@vercel/analytics";
import { z } from "zod";

type AllowedPropertyValues = string | number | boolean | null;

const eventSchema = z.object({
  name: z.enum([
    "copy_npm_command",
    "copy_usage_import_code",
    "copy_usage_code",
    "copy_primitive_code",
    "copy_theme_code",
    "copy_block_code",
    "copy_chunk_code",
    "enable_lift_mode",
    "copy_chart_code",
    "copy_chart_theme",
    "copy_chart_data",
    "copy_color",
  ]),
  properties: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

export type Event = z.infer<typeof eventSchema>;

export function trackEvent(input: Event): void {
  const result = eventSchema.safeParse(input);

  if (result.success) {
    const event = result.data;
    const properties = event.properties ?? {};
    va.track(event.name, properties as Record<string, AllowedPropertyValues>);
  } else {
    console.error("Erreur de validation de l'événement:", result.error);
  }
}