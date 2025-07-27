"use client";
import React from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from '@/i18n/routing';
import { Icon } from "@/components/ui/icon";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { cn } from "@/lib/utils"
import { Loader2 } from 'lucide-react';
import { toast } from "sonner"
import { useRouter } from '@/components/navigation';

const schema = z.object({
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères." }),
  lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Votre email est invalide." }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
  confirmPassword: z.string().min(6, { message: "Veuillez confirmer votre mot de passe." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

const RegisterForm = () => {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const [passwordType, setPasswordType] = React.useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = React.useState("password");

  const togglePasswordType = () => {
    if (passwordType === "text") {
      setPasswordType("password");
    } else if (passwordType === "password") {
      setPasswordType("text");
    }
  };

  const toggleConfirmPasswordType = () => {
    if (confirmPasswordType === "text") {
      setConfirmPasswordType("password");
    } else if (confirmPasswordType === "password") {
      setConfirmPasswordType("text");
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    startTransition(async () => {
      try {
        // Simulation d'une inscription réussie
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast.success("Inscription réussie", {
          description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
        });
        
        // Redirection vers la page de connexion
        router.push('/');
        reset();
      } catch (err: any) {
        toast.error("Erreur lors de l'inscription", {
          description: "Une erreur est survenue. Veuillez réessayer.",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="font-medium text-default-600">
            Prénom
          </Label>
          <Input 
            size="lg"
            disabled={isPending}
            {...register("firstName")}
            type="text"
            id="firstName"
            className={cn("", {
              "border-destructive ": errors.firstName,
            })}
          />
          {errors.firstName && (
            <div className="text-destructive mt-1 text-sm">
              {errors.firstName.message}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName" className="font-medium text-default-600">
            Nom
          </Label>
          <Input 
            size="lg"
            disabled={isPending}
            {...register("lastName")}
            type="text"
            id="lastName"
            className={cn("", {
              "border-destructive ": errors.lastName,
            })}
          />
          {errors.lastName && (
            <div className="text-destructive mt-1 text-sm">
              {errors.lastName.message}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="font-medium text-default-600">
          Adresse email
        </Label>
        <Input 
          size="lg"
          disabled={isPending}
          {...register("email")}
          type="email"
          id="email"
          className={cn("", {
            "border-destructive ": errors.email,
          })}
        />
        {errors.email && (
          <div className="text-destructive mt-1 text-sm">
            {errors.email.message}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="font-medium text-default-600">
          Mot de passe
        </Label>
        <div className="relative">
          <Input 
            size="lg"
            disabled={isPending}
            {...register("password")}
            type={passwordType}
            id="password"
            className={cn("", {
              "border-destructive ": errors.password,
            })}
            placeholder=" "
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
            onClick={togglePasswordType}
          >
            {passwordType === "password" ? (
              <Icon icon="heroicons:eye" className="w-5 h-5 text-default-400" />
            ) : (
              <Icon
                icon="heroicons:eye-slash"
                className="w-5 h-5 text-default-400"
              />
            )}
          </div>
        </div>
        {errors.password && (
          <div className="text-destructive mt-1 text-sm">
            {errors.password.message}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="font-medium text-default-600">
          Confirmer le mot de passe
        </Label>
        <div className="relative">
          <Input 
            size="lg"
            disabled={isPending}
            {...register("confirmPassword")}
            type={confirmPasswordType}
            id="confirmPassword"
            className={cn("", {
              "border-destructive ": errors.confirmPassword,
            })}
            placeholder=" "
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
            onClick={toggleConfirmPasswordType}
          >
            {confirmPasswordType === "password" ? (
              <Icon icon="heroicons:eye" className="w-5 h-5 text-default-400" />
            ) : (
              <Icon
                icon="heroicons:eye-slash"
                className="w-5 h-5 text-default-400"
              />
            )}
          </div>
        </div>
        {errors.confirmPassword && (
          <div className="text-destructive mt-1 text-sm">
            {errors.confirmPassword.message}
          </div>
        )}
      </div>

      <Button fullWidth disabled={isPending} className="mt-6">
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? "Inscription..." : "S'inscrire"}
      </Button>
      
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Vous avez déjà un compte ?{" "}
          <Link href="/" className="text-embassy-blue-600 hover:text-embassy-blue-700 font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </form>
  );
};

export default RegisterForm;