"use client";
import React from 'react'
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from '@/i18n/routing';
import { Icon } from "@/components/ui/icon";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { cn } from "@/lib/utils"
import { Loader2, UserPlus, LogIn } from 'lucide-react';
import { useSignIn, useRegisterClient, useCreateUser } from '@/hooks/use-auth';

const loginSchema = z.object({
  email: z.string().email({ message: "Votre email est invalide." }),
  password: z.string().min(4, { message: "Le mot de passe doit contenir au moins 4 caractères." }),
});

const registerSchema = z.object({
  email: z.string().email({ message: "Votre email est invalide." }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
  confirmPassword: z.string(),
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères." }),
  lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  phoneNumber: z.string().min(8, { message: "Le numéro de téléphone doit contenir au moins 8 chiffres." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

const createUserSchema = z.object({
  email: z.string().email({ message: "Votre email est invalide." }),
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères." }),
  lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  phoneNumber: z.string().min(8, { message: "Le numéro de téléphone doit contenir au moins 8 chiffres." }),
  role: z.enum(["AGENT", "CHEF_SERVICE", "CONSUL", "ADMIN"], { message: "Veuillez sélectionner un rôle." }),
});



const LoginForm = () => {
  const [mode, setMode] = React.useState<'login' | 'register' | 'createUser'>('login');
  const [passwordType, setPasswordType] = React.useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = React.useState("password");

  // Hooks TanStack Query
  const signInMutation = useSignIn();
  const registerMutation = useRegisterClient();
  const createUserMutation = useCreateUser();

  const togglePasswordType = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const toggleConfirmPasswordType = () => {
    setConfirmPasswordType(confirmPasswordType === "password" ? "text" : "password");
  };

  // Form pour la connexion
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "all",
    defaultValues: {
      email: "ambassade@tchad.ci",
      password: "password",
    },
  });

  // Form pour l'inscription
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: registerErrors },
    reset: resetRegister,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "all",
  });

  // Form pour créer un utilisateur du personnel
  const {
    register: registerCreateUser,
    handleSubmit: handleSubmitCreateUser,
    formState: { errors: createUserErrors },
    reset: resetCreateUser,
  } = useForm({
    resolver: zodResolver(createUserSchema),
    mode: "all",
  });



  // Connexion directe avec email/password (sans OTP)
  const onSubmitLogin = (data: z.infer<typeof loginSchema>) => {
    signInMutation.mutate(data);
  };

  // Inscription
  const onSubmitRegister = (data: z.infer<typeof registerSchema>) => {
    registerMutation.mutate({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
    }, {
      onSuccess: () => {
        // Après inscription réussie, basculer vers connexion
        setMode('login');
        resetLogin();
        resetRegister();
      }
    });
  };

  // Créer un utilisateur du personnel
  const onSubmitCreateUser = (data: z.infer<typeof createUserSchema>) => {
    createUserMutation.mutate({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      role: data.role,
    }, {
      onSuccess: () => {
        // Après création réussie, basculer vers connexion
        setMode('login');
        resetLogin();
        resetCreateUser();
      }
    });
  };

  // Basculer entre les modes
  const switchMode = (newMode: 'login' | 'register' | 'createUser') => {
    setMode(newMode);
    resetLogin();
    resetRegister();
    resetCreateUser();
  };

  // Rendu du formulaire de connexion
  const renderLoginForm = () => (
    <form onSubmit={handleSubmitLogin(onSubmitLogin)} className="mt-5 2xl:mt-7 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="font-medium text-default-600">
          Adresse email{" "}
        </Label>
        <Input
          size="lg"
          disabled={signInMutation.isPending}
          {...registerLogin("email")}
          type="email"
          id="email"
          className={cn("", {
            "border-destructive": loginErrors.email,
          })}
        />
        {loginErrors.email && (
          <div className="text-destructive mt-2 text-sm">
            {loginErrors.email.message}
          </div>
        )}
      </div>

      <div className="mt-3.5 space-y-2">
        <Label htmlFor="password" className="mb-2 font-medium text-default-600">
          Mot de passe{" "}
        </Label>
        <div className="relative">
          <Input
            size="lg"
            disabled={signInMutation.isPending}
            {...registerLogin("password")}
            type={passwordType}
            id="password"
            className="peer"
            placeholder=" "
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
            onClick={togglePasswordType}
          >
            {passwordType === "password" ? (
              <Icon icon="heroicons:eye" className="w-5 h-5 text-default-400" />
            ) : (
              <Icon icon="heroicons:eye-slash" className="w-5 h-5 text-default-400" />
            )}
          </div>
        </div>
        {loginErrors.password && (
          <div className="text-destructive mt-2 text-sm">
            {loginErrors.password.message}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <Checkbox id="checkbox" defaultChecked />
          <Label htmlFor="checkbox">Rester connecté</Label>
        </div>
        <Link
          href="/auth/forgot-password"
          className="text-sm text-default-800 dark:text-default-400 leading-6 font-medium"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      <Button fullWidth disabled={signInMutation.isPending}>
        {signInMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {signInMutation.isPending ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );

  // Rendu du formulaire d'inscription client
  const renderRegisterForm = () => (
    <form onSubmit={handleSubmitSignup(onSubmitRegister)} className="mt-5 2xl:mt-7 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="registerFirstName" className="font-medium text-default-600">
            Prénom *
          </Label>
          <Input
            size="lg"
            disabled={registerMutation.isPending}
            {...registerSignup("firstName")}
            type="text"
            id="registerFirstName"
            className={cn("", {
              "border-destructive": registerErrors.firstName,
            })}
            placeholder="Votre prénom"
          />
          {registerErrors.firstName && (
            <div className="text-destructive text-sm">
              {registerErrors.firstName.message}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="registerLastName" className="font-medium text-default-600">
            Nom *
          </Label>
          <Input
            size="lg"
            disabled={registerMutation.isPending}
            {...registerSignup("lastName")}
            type="text"
            id="registerLastName"
            className={cn("", {
              "border-destructive": registerErrors.lastName,
            })}
            placeholder="Votre nom"
          />
          {registerErrors.lastName && (
            <div className="text-destructive text-sm">
              {registerErrors.lastName.message}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="registerEmail" className="font-medium text-default-600">
          Adresse email *
        </Label>
        <Input
          size="lg"
          disabled={registerMutation.isPending}
          {...registerSignup("email")}
          type="email"
          id="registerEmail"
          className={cn("", {
            "border-destructive": registerErrors.email,
          })}
          placeholder="votre@email.com"
        />
        {registerErrors.email && (
          <div className="text-destructive text-sm">
            {registerErrors.email.message}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="registerPhoneNumber" className="font-medium text-default-600">
          Numéro de téléphone *
        </Label>
        <Input
          size="lg"
          disabled={registerMutation.isPending}
          {...registerSignup("phoneNumber")}
          type="tel"
          id="registerPhoneNumber"
          className={cn("", {
            "border-destructive": registerErrors.phoneNumber,
          })}
          placeholder="+2250707070707"
        />
        {registerErrors.phoneNumber && (
          <div className="text-destructive text-sm">
            {registerErrors.phoneNumber.message}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="registerPassword" className="font-medium text-default-600">
          Mot de passe *
        </Label>
        <div className="relative">
          <Input
            size="lg"
            disabled={registerMutation.isPending}
            {...registerSignup("password")}
            type={passwordType}
            id="registerPassword"
            className={cn("", {
              "border-destructive": registerErrors.password,
            })}
            placeholder="Votre mot de passe"
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
            onClick={togglePasswordType}
          >
            {passwordType === "password" ? (
              <Icon icon="heroicons:eye" className="w-5 h-5 text-default-400" />
            ) : (
              <Icon icon="heroicons:eye-slash" className="w-5 h-5 text-default-400" />
            )}
          </div>
        </div>
        {registerErrors.password && (
          <div className="text-destructive text-sm">
            {registerErrors.password.message}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="registerConfirmPassword" className="font-medium text-default-600">
          Confirmer le mot de passe *
        </Label>
        <div className="relative">
          <Input
            size="lg"
            disabled={registerMutation.isPending}
            {...registerSignup("confirmPassword")}
            type={confirmPasswordType}
            id="registerConfirmPassword"
            className={cn("", {
              "border-destructive": registerErrors.confirmPassword,
            })}
            placeholder="Confirmez votre mot de passe"
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 cursor-pointer"
            onClick={toggleConfirmPasswordType}
          >
            {confirmPasswordType === "password" ? (
              <Icon icon="heroicons:eye" className="w-5 h-5 text-default-400" />
            ) : (
              <Icon icon="heroicons:eye-slash" className="w-5 h-5 text-default-400" />
            )}
          </div>
        </div>
        {registerErrors.confirmPassword && (
          <div className="text-destructive text-sm">
            {registerErrors.confirmPassword.message}
          </div>
        )}
      </div>

      <Button fullWidth disabled={registerMutation.isPending}>
        {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <UserPlus className="mr-2 h-4 w-4" />
        {registerMutation.isPending ? "Inscription..." : "Créer mon compte"}
      </Button>
    </form>
  );

  // Rendu du formulaire de création d'utilisateur du personnel
  const renderCreateUserForm = () => (
    <form onSubmit={handleSubmitCreateUser(onSubmitCreateUser)} className="mt-5 2xl:mt-7 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="createUserFirstName" className="font-medium text-default-600">
            Prénom *
          </Label>
          <Input
            size="lg"
            disabled={createUserMutation.isPending}
            {...registerCreateUser("firstName")}
            type="text"
            id="createUserFirstName"
            className={cn("", {
              "border-destructive": createUserErrors.firstName,
            })}
            placeholder="Prénom de l'utilisateur"
          />
          {createUserErrors.firstName && (
            <div className="text-destructive text-sm">
              {createUserErrors.firstName.message}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="createUserLastName" className="font-medium text-default-600">
            Nom *
          </Label>
          <Input
            size="lg"
            disabled={createUserMutation.isPending}
            {...registerCreateUser("lastName")}
            type="text"
            id="createUserLastName"
            className={cn("", {
              "border-destructive": createUserErrors.lastName,
            })}
            placeholder="Nom de l'utilisateur"
          />
          {createUserErrors.lastName && (
            <div className="text-destructive text-sm">
              {createUserErrors.lastName.message}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="createUserEmail" className="font-medium text-default-600">
          Adresse email *
        </Label>
        <Input
          size="lg"
          disabled={createUserMutation.isPending}
          {...registerCreateUser("email")}
          type="email"
          id="createUserEmail"
          className={cn("", {
            "border-destructive": createUserErrors.email,
          })}
          placeholder="email@ambassade.com"
        />
        {createUserErrors.email && (
          <div className="text-destructive text-sm">
            {createUserErrors.email.message}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="createUserPhoneNumber" className="font-medium text-default-600">
          Numéro de téléphone *
        </Label>
        <Input
          size="lg"
          disabled={createUserMutation.isPending}
          {...registerCreateUser("phoneNumber")}
          type="tel"
          id="createUserPhoneNumber"
          className={cn("", {
            "border-destructive": createUserErrors.phoneNumber,
          })}
          placeholder="+2250707070707"
        />
        {createUserErrors.phoneNumber && (
          <div className="text-destructive text-sm">
            {createUserErrors.phoneNumber.message}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="createUserRole" className="font-medium text-default-600">
          Rôle *
        </Label>
        <select
          {...registerCreateUser("role")}
          id="createUserRole"
          disabled={createUserMutation.isPending}
          className={cn(
            "flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            {
              "border-destructive": createUserErrors.role,
            }
          )}
        >
          <option value="">Sélectionner un rôle</option>
          <option value="AGENT">Agent</option>
          <option value="CHEF_SERVICE">Chef de Service</option>
          <option value="CONSUL">Consul</option>
          <option value="ADMIN">Administrateur</option>
        </select>
        {createUserErrors.role && (
          <div className="text-destructive text-sm">
            {createUserErrors.role.message}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Icon icon="heroicons:information-circle" className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Information importante :</p>
            <p>Un mot de passe temporaire sera généré automatiquement et fourni après la création de l'utilisateur.</p>
          </div>
        </div>
      </div>

      <Button fullWidth disabled={createUserMutation.isPending}>
        {createUserMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <UserPlus className="mr-2 h-4 w-4" />
        {createUserMutation.isPending ? "Création..." : "Créer l'utilisateur"}
      </Button>
    </form>
  );

  // Logique de rendu selon le mode (plus d'étape OTP)

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Connexion';
      case 'register':
        return 'Inscription Client';
      case 'createUser':
        return 'Créer un Utilisateur';
      default:
        return 'Connexion';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'login':
        return 'Connectez-vous à votre compte';
      case 'register':
        return 'Créez votre compte client';
      case 'createUser':
        return 'Créer un nouvel utilisateur du personnel';
      default:
        return 'Connectez-vous à votre compte';
    }
  };

  const renderCurrentForm = () => {
    switch (mode) {
      case 'login':
        return renderLoginForm();
      case 'register':
        return renderRegisterForm();
      case 'createUser':
        return renderCreateUserForm();
      default:
        return renderLoginForm();
    }
  };

  return (
    <div className="space-y-6">
      {/* Toggle entre les différents modes */}
      <div className="flex rounded-lg bg-default-100 p-1">
        <button
          type="button"
          onClick={() => switchMode('login')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-md py-2 px-3 text-sm font-medium transition-all",
            mode === 'login'
              ? "bg-white text-default-900 shadow-sm"
              : "text-default-600 hover:text-default-900"
          )}
        >
          <LogIn className="w-4 h-4" />
          Connexion
        </button>
        <button
          type="button"
          onClick={() => switchMode('register')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-md py-2 px-3 text-sm font-medium transition-all",
            mode === 'register'
              ? "bg-white text-default-900 shadow-sm"
              : "text-default-600 hover:text-default-900"
          )}
        >
          <UserPlus className="w-4 h-4" />
          Client
        </button>
        <button
          type="button"
          onClick={() => switchMode('createUser')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-md py-2 px-3 text-sm font-medium transition-all",
            mode === 'createUser'
              ? "bg-white text-default-900 shadow-sm"
              : "text-default-600 hover:text-default-900"
          )}
        >
          <UserPlus className="w-4 h-4" />
          Personnel
        </button>
      </div>

      {/* Titre et description dynamiques */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-default-900">
          {getTitle()}
        </h2>
        <p className="text-base text-default-600">
          {getDescription()}
        </p>
      </div>

      {/* Formulaire selon le mode */}
      {renderCurrentForm()}
    </div>
  );
};

export default LoginForm;
