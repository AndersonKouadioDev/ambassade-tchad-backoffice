// "use client";

// import { CalendarIcon } from "lucide-react";
// import { Button } from "@heroui/react";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { format } from "date-fns";
// import { Controller, useFormContext } from "react-hook-form";
// import { cn } from "@heroui/react";
// import { EvenementDTO } from "../schemas/evenement.schema";

// interface EventDatePickerProps {
//   name: keyof EvenementDTO;
//   label?: string;
//   className?: string;
// }

// export const EventDatePicker = ({
//   name,
//   label,
//   className,
// }: EventDatePickerProps) => {
//   const { control, formState } = useFormContext<EvenementDTO>();

//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field }) => (
//         <div className={className}>
//           {label && <label className="block text-sm font-medium mb-1">{label}</label>}
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="bordered"
//                 className={cn(
//                   "w-full justify-start text-left font-normal",
//                   !field.value && "text-muted-foreground"
//                 )}
//               >
//                 <CalendarIcon className="mr-2 h-4 w-4" />
//                 {field.value ? (
//                   format(new Date(field.value), "PPP")
//                 ) : (
//                   <span>Choisir une date</span>
//                 )}
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-auto p-0">
//               <Calendar
//                 mode="single"
//                 selected={field.value ? new Date(field.value) : undefined}
//                 onSelect={(date) => field.onChange(date?.toISOString())}
//                 initialFocus
//               />
//             </PopoverContent>
//           </Popover>
//           {formState.errors[name] && (
//             <p className="text-sm text-red-500">
//               {formState.errors[name]?.message}
//             </p>
//           )}
//         </div>
//       )}
//     />
//   );
// };