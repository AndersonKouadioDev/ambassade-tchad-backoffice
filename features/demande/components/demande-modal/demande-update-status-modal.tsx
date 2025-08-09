"use client";

import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { getEnumValues } from "@/utils/getEnumValues";
import { DemandeStatus, IDemande } from "../../types/demande.type";
import { useUpdateDemandStatusMutation } from "../../queries/demande.mutation";
import {
  DemandUpdateDTO,
  DemandUpdateSchema,
} from "../../schema/demande.schema";
import { getDemandeStatusLabel } from "../../utils/getDemandeStatusLabel";
import { areShowReasonObservation } from "../../utils/areShowReasonObservation";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  demande: IDemande | null;
};

export function DemandeUpdateStatusModal({
  isOpen,
  setIsOpen,
  demande,
}: Props) {
  const { mutateAsync: updateDemandStatusMutation, isPending } =
    useUpdateDemandStatusMutation();

  const statusOptions = useMemo(
    () =>
      getEnumValues(DemandeStatus).filter(
        (status) => status !== demande?.status
      ),
    [demande?.status]
  );

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<DemandUpdateDTO>({
    resolver: zodResolver(DemandUpdateSchema),
    mode: "onChange",
  });

  const handleClose = useCallback(() => {
    if (!isPending) {
      setIsOpen(false);
      setTimeout(
        () =>
          reset({
            status: undefined,
            reason: undefined,
            observation: undefined,
          }),
        200
      );
    }
  }, [isPending, setIsOpen, reset]);

  const onSubmit = useCallback(
    async (data: DemandUpdateDTO) => {
      try {
        await updateDemandStatusMutation({ id: demande?.id || "", data });
        handleClose();
        toast.success("Statut de la demande modifié avec succès.");
      } catch (error) {
        toast.error("Erreur : ", {
          description:
            error instanceof Error ? error.message : "Erreur inconnue",
        });
      }
    },
    [updateDemandStatusMutation, handleClose, demande]
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      setValue("status", value as DemandeStatus, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  const verifyIfReasonObservationShow = useMemo(
    () => areShowReasonObservation(watch("status")),
    [watch]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le statut de la demande</DialogTitle>
          <DialogDescription>
            {`Statut actuel : ${getDemandeStatusLabel(demande?.status!).label}`}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Select
              onValueChange={handleStatusChange}
              disabled={isPending}
              value={watch("status")}
            >
              <SelectTrigger
                className={`w-full ${errors.status ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Choisir un statut" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status.toString()}>
                    {getDemandeStatusLabel(status).label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500 mt-1">
                {errors.status.message}
              </p>
            )}
          </div>
          {verifyIfReasonObservationShow.reason && (
            <Textarea {...register("reason")} placeholder="La raison" />
          )}
          {verifyIfReasonObservationShow.observation && (
            <Textarea {...register("observation")} placeholder="Observation" />
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isPending || !isValid}>
              {isPending ? "Modification..." : "Modifier"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
