"use client";
import React, { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/routing";
import { Icon } from "@/components/ui/icon";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "@/components/navigation";
import { useTranslations } from "next-intl";
import { LoginDTO, loginSchema } from "../schemas/auth.schema";
import { login } from "../actions/auth.action";

const LoginForm = () => {
  const t = useTranslations("LoginForm");

  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [passwordType, setPasswordType] = useState("password");

  const togglePasswordType = () => {
    if (passwordType === "text") {
      setPasswordType("password");
    } else if (passwordType === "password") {
      setPasswordType("text");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginDTO) => {
    startTransition(async () => {
      const response = await login(data);
      if (!response.success) {
        toast.error("Erreur de connexion", {
          description: response.message,
        });
      } else {
        router.push("/dashboard/analytics");
        toast.success("Connexion réussie");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-5 2xl:mt-7 space-y-4">
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className=" font-medium text-default-600 dark:text-gray-300"
        >
          {t("email_label")}{" "}
        </Label>
        <Input
          size="lg"
          disabled={isPending}
          {...register("email")}
          type="email"
          id="email"
          placeholder="ambassade@tchad.ci"
          className={cn("", {
            "border-destructive ": errors.email,
          })}
        />
      </div>
      {errors.email && (
        <div className=" text-destructive mt-2 text-sm">
          {errors.email.message}
        </div>
      )}

      <div className="mt-3.5 space-y-2">
        <Label
          htmlFor="password"
          className="mb-2 font-medium text-default-600 dark:text-gray-300"
        >
          {t("password_label")}{" "}
        </Label>
        <div className="relative">
          <Input
            size="lg"
            disabled={isPending}
            {...register("password")}
            type={passwordType}
            id="password"
            className="peer  "
            placeholder="password01@ "
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
      </div>
      {errors.password && (
        <div className=" text-destructive mt-2 text-sm">
          {errors.password.message}
        </div>
      )}

      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <Checkbox id="checkbox" defaultChecked />
          <Label htmlFor="checkbox" className="dark:text-gray-300">
            {t("remember_me")}
          </Label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm text-default-800 dark:text-gray-300 leading-6 font-medium hover:text-embassy-blue-600 dark:hover:text-embassy-blue-400 transition-colors"
        >
          {t("forgot_password")}
        </Link>
      </div>
      <Button fullWidth disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? t("signing_in") : t("sign_in")}
      </Button>
    </form>
  );
};
export default LoginForm;
