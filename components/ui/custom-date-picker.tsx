"use client";

import * as React from "react";
import { format, isAfter, isBefore, isToday, startOfDay, endOfDay, addDays, addWeeks, addMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO, isValid, isSameDay, getDaysInMonth, getDay, setDate } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, X, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types pour la configuration du date picker
export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface TimeValue {
  hour: string;
  minute: string;
}

export interface DatePreset {
  label: string;
  value: DateRange | Date;
  shortcut?: string;
}

export interface CustomDatePickerProps {
  // Valeurs
  value?: Date | DateRange;
  defaultValue?: Date | DateRange;
  onChange?: (value: Date | DateRange | undefined) => void;
  
  // Configuration de base
  mode?: 'single' | 'range';
  includeTime?: boolean;
  placeholder?: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  
  // Validation
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  disabledDaysOfWeek?: number[]; // 0 = dimanche, 6 = samedi
  
  // Apparence
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  showIcon?: boolean;
  showClearButton?: boolean;
  fullWidth?: boolean;
  
  // Fonctionnalités avancées
  showPresets?: boolean;
  presets?: DatePreset[];
  showShortcuts?: boolean;
  allowManualInput?: boolean;
  format?: string;
  
  // États
  error?: string;
  success?: string;
  
  // Positionnement
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'bottom' | 'left' | 'right';
  
  // Callbacks
  onFocus?: () => void;
  onBlur?: () => void;
  onOpenChange?: (open: boolean) => void;
  
  // Classes personnalisées
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

// Présets par défaut
const defaultPresets: DatePreset[] = [
  {
    label: "Aujourd'hui",
    value: new Date(),
    shortcut: "T"
  },
  {
    label: "Hier",
    value: addDays(new Date(), -1),
  },
  {
    label: "Cette semaine",
    value: {
      from: startOfWeek(new Date(), { locale: fr }),
      to: endOfWeek(new Date(), { locale: fr })
    }
  },
  {
    label: "Semaine dernière",
    value: {
      from: startOfWeek(addWeeks(new Date(), -1), { locale: fr }),
      to: endOfWeek(addWeeks(new Date(), -1), { locale: fr })
    }
  },
  {
    label: "Ce mois",
    value: {
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date())
    }
  },
  {
    label: "Mois dernier",
    value: {
      from: startOfMonth(addMonths(new Date(), -1)),
      to: endOfMonth(addMonths(new Date(), -1))
    }
  },
  {
    label: "7 derniers jours",
    value: {
      from: addDays(new Date(), -7),
      to: new Date()
    }
  },
  {
    label: "30 derniers jours",
    value: {
      from: addDays(new Date(), -30),
      to: new Date()
    }
  }
];

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  defaultValue,
  onChange,
  mode = 'single',
  includeTime = false,
  placeholder = "Sélectionner une date",
  label,
  description,
  required = false,
  disabled = false,
  readOnly = false,
  minDate,
  maxDate,
  disabledDates = [],
  disabledDaysOfWeek = [],
  size = 'md',
  variant = 'outline',
  showIcon = true,
  showClearButton = true,
  fullWidth = false,
  showPresets = false,
  presets = defaultPresets,
  showShortcuts = false,
  allowManualInput = true,
  format: formatString,
  error,
  success,
  align = 'start',
  side = 'bottom',
  onFocus,
  onBlur,
  onOpenChange,
  className,
  triggerClassName,
  contentClassName
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<Date | DateRange | undefined>(defaultValue);
  const [tempValue, setTempValue] = React.useState<Date | DateRange | undefined>();
  const [timeValue, setTimeValue] = React.useState<TimeValue>({ hour: "00", minute: "00" });
  const [inputValue, setInputValue] = React.useState("");
  const [selectedMonth, setSelectedMonth] = React.useState(new Date());

  const currentValue = value !== undefined ? value : internalValue;

  // Format par défaut selon le mode et les options
  const getDefaultFormat = React.useCallback(() => {
    if (formatString) return formatString;
    
    if (mode === 'range') {
      return includeTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy";
    }
    return includeTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy";
  }, [mode, includeTime, formatString]);

  // Formatage de l'affichage
  const formatDisplay = React.useCallback((val: Date | DateRange | undefined) => {
    if (!val) return "";
    
    const fmt = getDefaultFormat();
    
    if (mode === 'range' && typeof val === 'object' && 'from' in val) {
      const { from, to } = val as DateRange;
      if (from && to) {
        return `${format(from, fmt, { locale: fr })} - ${format(to, fmt, { locale: fr })}`;
      } else if (from) {
        return format(from, fmt, { locale: fr });
      }
      return "";
    } else if (val instanceof Date) {
      return format(val, fmt, { locale: fr });
    }
    
    return "";
  }, [mode, getDefaultFormat]);

  // Gestion des classes CSS selon la taille
  const getSizeClasses = React.useCallback(() => {
    switch (size) {
      case 'sm':
        return "h-8 px-2 text-xs";
      case 'lg':
        return "h-12 px-4 text-base";
      default:
        return "h-10 px-3 text-sm";
    }
  }, [size]);

  // Vérification si une date est désactivée
  const isDateDisabled = React.useCallback((date: Date) => {
    if (minDate && isBefore(date, startOfDay(minDate))) return true;
    if (maxDate && isAfter(date, endOfDay(maxDate))) return true;
    if (disabledDaysOfWeek.includes(date.getDay())) return true;
    if (disabledDates.some(disabledDate => 
      format(date, 'yyyy-MM-dd') === format(disabledDate, 'yyyy-MM-dd')
    )) return true;
    return false;
  }, [minDate, maxDate, disabledDates, disabledDaysOfWeek]);

  // Gestion du changement de valeur
  const handleValueChange = React.useCallback((newValue: Date | DateRange | undefined) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  }, [value, onChange]);

  // Application d'un preset
  const applyPreset = React.useCallback((preset: DatePreset) => {
    handleValueChange(preset.value);
    if (mode === 'single') {
      setIsOpen(false);
    }
  }, [handleValueChange, mode]);

  // Gestion des raccourcis clavier
  React.useEffect(() => {
    if (!showShortcuts || !isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const preset = presets.find(p => p.shortcut === e.key.toUpperCase());
        if (preset) {
          e.preventDefault();
          applyPreset(preset);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showShortcuts, isOpen, presets, applyPreset]);

  // Mise à jour de l'input value quand la valeur change
  React.useEffect(() => {
    setInputValue(formatDisplay(currentValue));
  }, [currentValue, formatDisplay]);

  // Parsing de l'input manuel
  const parseManualInput = React.useCallback((input: string) => {
    try {
      // Essayer différents formats
      const formats = [
        'dd/MM/yyyy',
        'dd-MM-yyyy',
        'yyyy-MM-dd',
        'dd/MM/yyyy HH:mm',
        'dd-MM-yyyy HH:mm',
        'yyyy-MM-dd HH:mm'
      ];

      for (const fmt of formats) {
        try {
          const parsed = parseISO(input) || new Date(input);
          if (isValid(parsed) && !isDateDisabled(parsed)) {
            return parsed;
          }
        } catch {
          // Continue to next format
        }
      }
    } catch {
      // Invalid input
    }
    return null;
  }, [isDateDisabled]);

  // Gestion de l'input manuel
  const handleManualInput = React.useCallback((input: string) => {
    setInputValue(input);
    
    if (allowManualInput && input.trim()) {
      const parsed = parseManualInput(input);
      if (parsed) {
        handleValueChange(parsed);
      }
    }
  }, [allowManualInput, parseManualInput, handleValueChange]);

  // Effacer la valeur
  const clearValue = React.useCallback(() => {
    handleValueChange(undefined);
    setInputValue("");
  }, [handleValueChange]);

  // Sélection d'une date dans le calendrier
  const handleDateSelect = React.useCallback((date: Date) => {
    if (isDateDisabled(date)) return;

    if (mode === 'single') {
      handleValueChange(date);
      setIsOpen(false);
    } else {
      // Mode range
      const currentRange = currentValue as DateRange;
      if (!currentRange?.from || (currentRange.from && currentRange.to)) {
        // Premier clic ou reset
        handleValueChange({ from: date, to: undefined });
      } else {
        // Deuxième clic
        const from = currentRange.from;
        if (isBefore(date, from)) {
          handleValueChange({ from: date, to: from });
        } else {
          handleValueChange({ from, to: date });
        }
      }
    }
  }, [mode, currentValue, handleValueChange, isDateDisabled]);

  // Vérifier si une date est sélectionnée
  const isDateSelected = React.useCallback((date: Date) => {
    if (mode === 'single') {
      return currentValue instanceof Date && isSameDay(date, currentValue);
    } else {
      const range = currentValue as DateRange;
      if (range?.from && range?.to) {
        return (isSameDay(date, range.from) || isSameDay(date, range.to) || 
                (isAfter(date, range.from) && isBefore(date, range.to)));
      } else if (range?.from) {
        return isSameDay(date, range.from);
      }
    }
    return false;
  }, [mode, currentValue]);

  // Vérifier si une date est dans la plage (pour le style)
  const isDateInRange = React.useCallback((date: Date) => {
    if (mode === 'range') {
      const range = currentValue as DateRange;
      if (range?.from && range?.to) {
        return isAfter(date, range.from) && isBefore(date, range.to);
      }
    }
    return false;
  }, [mode, currentValue]);

  // Générer les jours du calendrier
  const generateCalendarDays = React.useCallback(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month, getDaysInMonth(firstDay));
    
    // Premier jour de la semaine (lundi = 1, dimanche = 0)
    const startDate = startOfWeek(firstDay, { weekStartsOn: 1 });
    const endDate = endOfWeek(lastDay, { weekStartsOn: 1 });
    
    const days = [];
    let current = startDate;
    
    while (current <= endDate) {
      days.push(new Date(current));
      current = addDays(current, 1);
    }
    
    return days;
  }, [selectedMonth]);

  // Rendu du calendrier
  const renderCalendar = () => {
    const days = generateCalendarDays();
    const currentMonth = selectedMonth.getMonth();
    
    return (
      <div className="space-y-4">
        {/* En-tête du calendrier */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
            <div key={index} className="p-2 text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        {/* Grille des jours */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentMonth;
            const isSelected = isDateSelected(day);
            const isInRange = isDateInRange(day);
            const isDisabled = isDateDisabled(day);
            const isTodayDate = isToday(day);
            
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleDateSelect(day)}
                disabled={isDisabled}
                className={cn(
                  "h-9 w-9 text-sm font-normal rounded-md transition-colors",
                  "hover:bg-embassy-yellow-100 hover:text-embassy-yellow-900",
                  "focus:outline-none focus:ring-2 focus:ring-embassy-yellow-500",
                  
                  // État de sélection
                  isSelected && [
                    "bg-embassy-yellow-500 text-white font-semibold",
                    "hover:bg-embassy-yellow-600"
                  ],
                  
                  // Dans la plage (mode range)
                  isInRange && !isSelected && [
                    "bg-embassy-yellow-100 text-embassy-yellow-900"
                  ],
                  
                  // Aujourd'hui
                  isTodayDate && !isSelected && [
                    "bg-embassy-red-100 text-embassy-red-900 font-semibold"
                  ],
                  
                  // Mois actuel vs autres mois
                  isCurrentMonth ? "text-foreground" : "text-muted-foreground/50",
                  
                  // État désactivé
                  isDisabled && [
                    "opacity-30 cursor-not-allowed",
                    "hover:bg-transparent hover:text-muted-foreground/50"
                  ]
                )}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Rendu du contenu du calendrier
  const renderCalendarContent = () => (
    <div className={cn(
      "p-4 space-y-4 bg-background border rounded-lg shadow-lg",
      "min-w-[320px] max-w-[800px]",
      contentClassName
    )}>
      {/* Présets */}
      {showPresets && presets.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Sélection rapide</h4>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={cn(
                  "justify-start text-xs h-8",
                  "hover:bg-embassy-yellow-100 hover:text-embassy-yellow-800",
                  "dark:hover:bg-embassy-yellow-900/20 dark:hover:text-embassy-yellow-200"
                )}
                onClick={() => applyPreset(preset)}
              >
                {preset.label}
                {preset.shortcut && showShortcuts && (
                  <Badge className="ml-auto text-xs">
                    Ctrl+{preset.shortcut}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Calendrier principal */}
      <div className="space-y-3">
        {/* Navigation des mois */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setSelectedMonth(addMonths(selectedMonth, -1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h3 className="text-sm font-semibold capitalize">
            {format(selectedMonth, "MMMM yyyy", { locale: fr })}
          </h3>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendrier */}
        {renderCalendar()}
      </div>

      {/* Sélecteur de temps */}
      {includeTime && (
        <div className="border-t pt-3 space-y-2">
          <h4 className="text-sm font-medium">Heure</h4>
          <div className="flex items-center space-x-2">
            <Select value={timeValue.hour} onValueChange={(hour) => setTimeValue(prev => ({ ...prev, hour }))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => (
                  <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                    {i.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <span className="text-muted-foreground">:</span>
            
            <Select value={timeValue.minute} onValueChange={(minute) => setTimeValue(prev => ({ ...prev, minute }))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 60 }, (_, i) => (
                  <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                    {i.toString().padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Actions */}
      {mode === 'range' && (
        <div className="border-t pt-3 flex justify-between">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            Annuler
          </Button>
          <Button 
            size="sm"
            className="bg-embassy-yellow-500 hover:bg-embassy-yellow-600 text-white"
            onClick={() => setIsOpen(false)}
          >
            Appliquer
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("space-y-2", fullWidth && "w-full", className)}>
      {/* Label et description */}
      {(label || description) && (
        <div className="space-y-1">
          {label && (
            <Label className="text-sm font-medium">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Trigger du date picker */}
      <div className="relative">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={variant}
              className={cn(
                "justify-start text-left font-normal",
                getSizeClasses(),
                fullWidth && "w-full",
                !currentValue && "text-muted-foreground",
                error && "border-destructive focus-visible:ring-destructive",
                success && "border-green-500 focus-visible:ring-green-500",
                triggerClassName
              )}
              disabled={disabled}
              onFocus={onFocus}
              onBlur={onBlur}
            >
              {showIcon && <CalendarIcon className="mr-2 h-4 w-4" />}
              {inputValue || placeholder}
              {includeTime && <Clock className="ml-auto h-4 w-4" />}
            </Button>
          </PopoverTrigger>
          
          <PopoverContent 
            className="w-auto p-0" 
            align={align}
            side={side}
          >
            {renderCalendarContent()}
          </PopoverContent>
        </Popover>

        {/* Bouton clear */}
        {showClearButton && currentValue && !disabled && !readOnly && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={clearValue}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Input manuel (optionnel) */}
      {allowManualInput && (
        <Input
          type="text"
          placeholder={`Format: ${getDefaultFormat()}`}
          value={inputValue}
          onChange={(e) => handleManualInput(e.target.value)}
          disabled={disabled}
          readOnly={readOnly}
          className={cn(
            "text-xs",
            error && "border-destructive",
            success && "border-green-500"
          )}
        />
      )}

      {/* Messages d'erreur et succès */}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
      {success && (
        <p className="text-xs text-green-600">{success}</p>
      )}
    </div>
  );
}; 