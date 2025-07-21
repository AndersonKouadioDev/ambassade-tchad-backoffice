import { StatusBlock } from "@/components/blocks/status-block";
import DemandedList from "@/components/demande/demande-list";
import { Clock, CheckCircle2, XCircle, Archive } from "lucide-react";
import { useTranslations } from "next-intl";

export default function UserLispage() {
  const t = useTranslations("gestionDemande");

  return (
    <div className="container">
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12">
          <h1 className="text-2xl font-bold">{t("title")}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            <StatusBlock
              title={t("pending")}
              total="50"
              iconWrapperClass="bg-warning/10"
              chartColor="#fbbf24"
              icon={<Clock className="w-5 h-5 text-warning" />}
            />
            <StatusBlock
              title={t("approved")}
              total="150"
              iconWrapperClass="bg-success/10"
              chartColor="#10b981"
              icon={<CheckCircle2 className="w-5 h-5 text-success" />}
            />
            <StatusBlock
              title={t("rejected")}
              total="564"
              icon={<XCircle className="w-5 h-5 text-destructive" />}
              iconWrapperClass="bg-destructive/10"
              chartColor="#ef4444"
            />
            <StatusBlock
              title={t("archived")}
              total="150"
              icon={<Archive className="w-5 h-5 text-muted-foreground" />}
              iconWrapperClass="bg-muted/10"
              chartColor="#9ca3af"
            />
          </div>
        </div>

        <div className="col-span-12">
          <DemandedList />
        </div>
      </div>
    </div>
  );
}
