"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { evenementSchema, EvenementDTO } from "../../schemas/evenement.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IEvenement } from "@/types/evenement.types";
import { ImageUploadField } from "./image-upload-field";

interface EvenementFormProps {
  evenement?: IEvenement;
  onSubmit: (data: EvenementDTO) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const EvenementForm: React.FC<EvenementFormProps> = ({
  evenement,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const t = useTranslations("contenu.gestionEvenement");

  const form = useForm<EvenementDTO>({
    resolver: zodResolver(evenementSchema),
    defaultValues: {
      title: evenement?.title || "",
      description: evenement?.description || "",
      eventDate: evenement?.eventDate ? new Date(evenement.eventDate).toISOString().split('T')[0] : "",
      location: evenement?.location || "",
      imageUrl: evenement?.imageUrl || [],
      published: evenement?.published || false,
    },
  });

  const handleSubmit = async (data: EvenementDTO) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {evenement ? t("form.edit_title") : t("form.create_title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.title")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("fields.title_placeholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.description")}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t("fields.description_placeholder")}
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.event_date")}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.location")}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t("fields.location_placeholder")}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.image")}</FormLabel>
                  <FormControl>
                    <ImageUploadField
                      value={Array.isArray(field.value) ? field.value : []}
                      onChange={field.onChange}
                      maxImages={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("fields.published")}</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ? "true" : "false"}
                      onValueChange={(value) => field.onChange(value === "true")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">{t("status.publie")}</SelectItem>
                        <SelectItem value="false">{t("status.brouillon")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                {t("actions.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-embassy-blue-600 hover:bg-embassy-blue-700"
              >
                {isLoading ? t("actions.saving") : (evenement ? t("actions.update") : t("actions.create"))}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}; 