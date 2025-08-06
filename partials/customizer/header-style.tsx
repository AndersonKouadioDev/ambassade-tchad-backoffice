"use client";
import { useConfig } from "@/hooks/use-config";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { navBarType } from "@/lib/type";
const HeaderStyle = () => {
  const [config, setConfig] = useConfig();

  const { navbar } = config;

  return (
    <div className="-mx-6 p-6">
      <div className="text-sm font-medium mb-3">Type de header</div>
      <RadioGroup
        defaultValue={navbar}
        className="flex flex-wrap items-center gap-3"
        onValueChange={(value) => {
          setConfig({ ...config, navbar: value as navBarType });
        }}
      >
        {[
          { label: "Flotant", value: "floating" },
          { label: "Collant", value: "sticky" },
          { label: "Masquer", value: "hidden" },
          { label: "Par défaut", value: "default" },
        ].map(({ label, value }, index) => {
          return (
            <div className="flex items-center space-x-2" key={index}>
              <RadioGroupItem
                value={value}
                id={`header-style-${value}`}
                disabled={
                  config.layout === "horizontal" && value === "floating"
                }
              />
              <Label className="capitalize" htmlFor={`header-style-${value}`}>
                {label}
              </Label>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default HeaderStyle;
