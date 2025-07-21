// "use client"

// import { Fragment } from "react"
// import { Dialog, Transition } from "@headlessui/react"
// import { Input } from "@/components/ui/input"

// type FormData = {
//   user: { name: string; image: string }
//   service: string
//   post: string
//   role: string
// }

// type Props = {
//   isOpen: boolean
//   setIsOpen: (open: boolean) => void
//   formData: FormData
//   setFormData: React.Dispatch<React.SetStateAction<FormData>>
//   onSubmit: (e: React.FormEvent) => void
// }

// export default function AddUserModal({
//   isOpen,
//   setIsOpen,
//   formData,
//   setFormData,
//   onSubmit,
// }: Props) {
//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-200"
//           enterFrom="opacity-0 scale-95"
//           enterTo="opacity-100 scale-100"
//           leave="ease-in duration-150"
//           leaveFrom="opacity-100 scale-100"
//           leaveTo="opacity-0 scale-95"
//         >
//           <div className="fixed inset-0 bg-black/25" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-200"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-150"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl">
//                 <Dialog.Title className="text-lg font-medium text-gray-900">
//                   Ajouter un utilisateur
//                 </Dialog.Title>

//                 <form className="mt-4 space-y-4" onSubmit={onSubmit}>
//                   <Input
//                     placeholder="Nom complet"
//                     value={formData.user.name}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         user: { ...prev.user, name: e.target.value },
//                       }))
//                     }
//                     required
//                   />
//                   <Input
//                     placeholder="Image URL"
//                     value={formData.user.image}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         user: { ...prev.user, image: e.target.value },
//                       }))
//                     }
//                   />
//                   <Input
//                     placeholder="Service"
//                     value={formData.service}
//                     onChange={(e) =>
//                       setFormData((prev) => ({ ...prev, service: e.target.value }))
//                     }
//                     required
//                   />
//                   <Input
//                     placeholder="Poste"
//                     value={formData.post}
//                     onChange={(e) =>
//                       setFormData((prev) => ({ ...prev, post: e.target.value }))
//                     }
//                     required
//                   />
//                   <Input
//                     placeholder="Rôle"
//                     value={formData.role}
//                     onChange={(e) =>
//                       setFormData((prev) => ({ ...prev, role: e.target.value }))
//                     }
//                     required
//                   />
//                   <div className="flex justify-end gap-2">
//                     <button
//                       type="button"
//                       onClick={() => setIsOpen(false)}
//                       className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md"
//                     >
//                       Annuler
//                     </button>
//                     <button
//                       type="submit"
//                       className="px-4 py-2 text-sm text-white bg-primary rounded-md"
//                     >
//                       Ajouter
//                     </button>
//                   </div>
//                 </form>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   )
// }
