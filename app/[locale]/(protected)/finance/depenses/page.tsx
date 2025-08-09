import { StatusBlock } from "@/components/blocks/status-block";
import { DollarSign, CalendarDays, BarChart2, Clock3 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DepenseListPage() {
  const t = useTranslations("finance.depenses");

  return (
    <div className="container">
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-12">
          <h1 className="text-2xl font-bold">{t("title")}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            <StatusBlock
              title={t("total_depense")}
              total="500000"
              iconWrapperClass="bg-primary/10"
              chartColor="#0ea5e9"
              icon={<DollarSign className="w-5 h-5 text-primary" />}
            />
            <StatusBlock
              title={t("depenses_mensuelles")}
              total="5100"
              iconWrapperClass="bg-info/10"
              chartColor="#00EBFF"
              icon={<CalendarDays className="w-5 h-5 text-info" />}
            />
            <StatusBlock
              title={t("depenses_annuelles")}
              total="45800"
              iconWrapperClass="bg-success/10"
              chartColor="#10b981"
              icon={<BarChart2 className="w-5 h-5 text-success" />}
            />
            <StatusBlock
              title={t("depenses_hebdomadaires")}
              total="7000"
              iconWrapperClass="bg-warning/10"
              chartColor="#facc15"
              icon={<Clock3 className="w-5 h-5 text-warning" />}
            />
          </div>
        </div>

        <div className="col-span-12">
          {/* <DepenseList /> */}
        </div>
      </div>
    </div>
  );
}
