'use client';

import UserList from "@/components/archive/archive-list";
import { StatusBlock } from "@/components/blocks/status-block";
import { useTranslations } from "next-intl";
import { useUsers } from "@/hooks/use-users";
import {
  User,
  CheckCircle,
  PauseCircle,
  Ban,
} from "lucide-react";

export default function UserLispage() {
  const t = useTranslations("gestionUtilisateur");
  
  // Récupérer les statistiques des utilisateurs
  const { data: usersData } = useUsers();
  const { data: activeUsers } = useUsers({ status: 'ACTIVE' });
  const { data: inactiveUsers } = useUsers({ status: 'INACTIVE' });
  const { data: personnelUsers } = useUsers({ type: 'PERSONNEL' });

  return (
    <div className="container">
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12">
          <h1 className="text-2xl font-bold">{t("title")}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            <StatusBlock
              title={t("total_utilisateur")}
              total={usersData?.total?.toString() || "0"}
              iconWrapperClass="bg-primary/10"
              chartColor="#0ea5e9"
              icon={<User className="w-5 h-5 text-primary" />}
            />
            <StatusBlock
              title={t("utilisateur_actif")}
              total={activeUsers?.total?.toString() || "0"}
              iconWrapperClass="bg-success/10"
              chartColor="#10b981"
              icon={<CheckCircle className="w-5 h-5 text-success" />}
            />
            <StatusBlock
              title={t("utilisateur_inactif")}
              total={inactiveUsers?.total?.toString() || "0"}
              iconWrapperClass="bg-warning/10"
              chartColor="#facc15"
              icon={<PauseCircle className="w-5 h-5 text-warning" />}
            />
            <StatusBlock
              title="Personnel"
              total={personnelUsers?.total?.toString() || "0"}
              iconWrapperClass="bg-destructive/10"
              chartColor="#ef4444"
              icon={<Ban className="w-5 h-5 text-destructive" />}
            />
          </div>
        </div>

        <div className="col-span-12">
          <UserList />
        </div>
      </div>
    </div>
  );
}
