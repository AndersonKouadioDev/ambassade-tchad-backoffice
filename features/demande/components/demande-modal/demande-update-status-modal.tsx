"use client";

import { Fragment, useCallback, useMemo } from "react";
import {
  Dialog,
  Transition,
  DialogTitle,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { getEnumValues } from "@/utils/getEnumValues";
import { Button } from "@heroui/react";
import { DemandeStatus, IDemande } from "../../types/demande.type";
import { useUpdateDemandStatusMutation } from "../../queries/demande.mutation";
import {
  DemandUpdateDTO,
  DemandUpdateSchema,
} from "../../schema/demande.schema";
import { getDemandeStatusLabel } from "../../utils/getDemandeStatusLabel";
import { Textarea } from "@/components/ui/textarea";
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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle className="text-lg font-medium text-gray-900 mb-4">
                  {`Modifier le statut de la demande`}
                </DialogTitle>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <Select
                      onValueChange={handleStatusChange}
                      disabled={isPending}
                    >
                      <SelectTrigger
                        className={`w-full ${
                          errors.status ? "border-red-500" : ""
                        }`}
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
                    <Textarea
                      {...register("observation")}
                      placeholder="Observation"
                    />
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="bordered"
                      onPress={handleClose}
                      disabled={isPending}
                      className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending || !isValid}
                      className="px-4 py-2 text-sm text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
                    >
                      {isPending ? "Modification..." : "Modifier"}
                    </Button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
