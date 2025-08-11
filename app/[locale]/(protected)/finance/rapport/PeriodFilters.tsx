import React from "react";
import { Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterOptions } from "./types";

interface PeriodFiltersProps {
  filters: FilterOptions;
  onFilterChange: (key: keyof FilterOptions, value: any) => void;
}

export const PeriodFilters: React.FC<PeriodFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const quarters = [
    { value: 1, label: "Q1 (Jan-Mar)" },
    { value: 2, label: "Q2 (Apr-Jun)" },
    { value: 3, label: "Q3 (Jul-Sep)" },
    { value: 4, label: "Q4 (Oct-Dec)" },
  ];

  const years = [2024, 2023, 2022];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <span>Period Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="period-select">Analysis Period</Label>
            <Select
              value={filters.period}
              onValueChange={(value: "month" | "quarter" | "year") =>
                onFilterChange("period", value)
              }
            >
              <SelectTrigger id="period-select">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="quarter">Quarterly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="year-select">Year</Label>
            <Select
              value={filters.year.toString()}
              onValueChange={(value) => onFilterChange("year", parseInt(value))}
            >
              <SelectTrigger id="year-select">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filters.period === "month" && (
            <div className="space-y-2">
              <Label htmlFor="month-select">Month</Label>
              <Select
                value={(filters.month || 1).toString()}
                onValueChange={(value) =>
                  onFilterChange("month", parseInt(value))
                }
              >
                <SelectTrigger id="month-select">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {filters.period === "quarter" && (
            <div className="space-y-2">
              <Label htmlFor="quarter-select">Quarter</Label>
              <Select
                value={(filters.quarter || 1).toString()}
                onValueChange={(value) =>
                  onFilterChange("quarter", parseInt(value))
                }
              >
                <SelectTrigger id="quarter-select">
                  <SelectValue placeholder="Select quarter" />
                </SelectTrigger>
                <SelectContent>
                  {quarters.map((quarter) => (
                    <SelectItem
                      key={quarter.value}
                      value={quarter.value.toString()}
                    >
                      {quarter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
