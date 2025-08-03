"use client";

import * as React from "react";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Upload,
  X,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import type { FieldPath, FieldValues, Control } from "react-hook-form";
import { format, isValid, parse } from "date-fns";
import type { Locale } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getDefaultClassNames } from "react-day-picker";

const defaultErrorClassName =
  "bg-red-100 py-0.5 px-2 rounded-sm text-red-600 text-xs absolute right-0 -bottom-6 trasition-all duration-300";

// Base interface for common props
interface BaseFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
}

// Custom error display component
interface CustomErrorProps {
  error?: string;
  className?: string;
}

function CustomError({ error, className }: CustomErrorProps) {
  if (!error) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-sm text-destructive mt-1",
        className
      )}
    >
      <AlertCircle className="h-4 w-4" />
      <span>{error}</span>
    </div>
  );
}

// FormInput Component
interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormProps<TFieldValues, TName> {
  placeholder?: string;
  type?: string;
  inputClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  maxLength?: number;
  autoComplete?: string;
}

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder = "",
  type = "text",
  description,
  className = "relative",
  labelClassName,
  descriptionClassName,
  errorClassName = defaultErrorClassName,
  inputClassName,
  disabled = false,
  readOnly = false,
  leftIcon,
  rightIcon,
  maxLength,
  autoComplete,
}: FormInputProps<TFieldValues, TName>) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {type !== "hidden" && label && (
            <FormLabel className={labelClassName}>{label}</FormLabel>
          )}
          <FormControl>
            <div className="relative">
              {leftIcon && (
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10">
                  {leftIcon}
                </div>
              )}
              <Input
                {...field}
                className={cn(
                  leftIcon && "pl-10",
                  (rightIcon || isPassword) && "pr-10",
                  fieldState.error &&
                    "border-destructive focus-visible:ring-destructive",
                  inputClassName
                )}
                type={isPassword ? (showPassword ? "text" : "password") : type}
                placeholder={placeholder}
                onChange={(e) => {
                  if (type === "number") {
                    const value = e.target.valueAsNumber;
                    field.onChange(isNaN(value) ? undefined : value);
                  } else {
                    field.onChange(e.target.value);
                  }
                }}
                disabled={disabled}
                readOnly={readOnly}
                maxLength={maxLength}
                autoComplete={autoComplete}
                value={field.value || ""}
              />
              {isPassword && (
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={disabled || readOnly}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
              {rightIcon && !isPassword && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  {rightIcon}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage className={cn("text-destructive", errorClassName)} />
          {description && (
            <FormDescription className={descriptionClassName}>
              {description}
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}

// FormTextarea Component
interface FormTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormProps<TFieldValues, TName> {
  placeholder?: string;
  rows?: number;
  textareaClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  resize?: boolean;
}

export function FormTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder = "",
  rows = 3,
  description,
  className = "relative",
  labelClassName,
  descriptionClassName,
  errorClassName = defaultErrorClassName,
  textareaClassName,
  disabled = false,
  readOnly = false,
  maxLength,
  showCharCount = false,
  resize = true,
}: FormTextareaProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
          <FormControl>
            <div className="relative">
              <Textarea
                {...field}
                className={cn(
                  !resize && "resize-none",
                  fieldState.error &&
                    "border-destructive focus-visible:ring-destructive",
                  textareaClassName
                )}
                placeholder={placeholder}
                rows={rows}
                disabled={disabled}
                readOnly={readOnly}
                maxLength={maxLength}
                value={field.value || ""}
              />
              {showCharCount && maxLength && (
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background px-1 rounded">
                  {(field.value || "").length}/{maxLength}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage className={cn("text-destructive", errorClassName)} />
          {description && (
            <FormDescription className={descriptionClassName}>
              {description}
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}

// FormSelect Component
interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormProps<TFieldValues, TName> {
  variant?: "normal" | "searchable";
  placeholder?: string;
  options: SelectOption[];
  selectClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
}

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  variant = "normal",
  placeholder = "Select an option",
  options,
  description,
  className = "relative",
  labelClassName,
  descriptionClassName,
  errorClassName = defaultErrorClassName,
  selectClassName,
  disabled = false,
  readOnly = false,
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
}: FormSelectProps<TFieldValues, TName>) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
          {variant === "normal" ? (
            <Select
              onValueChange={readOnly ? undefined : field.onChange}
              value={field.value || ""}
              disabled={disabled || readOnly}
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    fieldState.error &&
                      "border-destructive focus-visible:ring-destructive",
                    selectClassName
                  )}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Popover open={open && !readOnly} onOpenChange={setOpen}>
              <PopoverTrigger
                asChild
                className="bg-white !border-1 border-black/20"
              >
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground",
                      fieldState.error &&
                        "border-destructive focus-visible:ring-destructive",
                      selectClassName
                    )}
                    disabled={disabled || readOnly}
                  >
                    {field.value
                      ? options.find((option) => option.value === field.value)
                          ?.label
                      : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Command
                  filter={(value, search) =>
                    options
                      .find((option) => option.value === value)
                      ?.label.toLowerCase()
                      .includes(search.toLowerCase())
                      ? 1
                      : 0
                  }
                >
                  <CommandInput
                    placeholder={searchPlaceholder}
                    className="h-full w-full !border-hidden"
                  />
                  <CommandList>
                    <CommandEmpty>{emptyMessage}</CommandEmpty>
                    <CommandGroup className="max-h-64 w-full overflow-y-auto">
                      {options.map((option) => (
                        <CommandItem
                          className="text-black hover:!bg-blue-100 data-[selected=true]:bg-primary/10"
                          key={option.value}
                          value={option.value}
                          onSelect={(currentValue) => {
                            field.onChange(
                              currentValue === field.value ? "" : currentValue
                            );
                            setOpen(false);
                          }}
                          disabled={option.disabled}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 text-primary",
                              field.value === option.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
          <FormMessage className={cn("text-destructive", errorClassName)} />
          {description && (
            <FormDescription className={descriptionClassName}>
              {description}
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}

// FormDatePicker Component
interface FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormProps<TFieldValues, TName> {
  placeholder?: string;
  dateClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  dateFormat?: string;
  dateDisplayFormat?: string;
  returnFormat?: "date" | "string";
  closeOnSelect?: boolean;
  showWeekNumbers?: boolean;
  fixedWeeks?: boolean;
  locale?: Locale;
  yearRange?: { from: number; to: number };
}

export function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder = "Pick a date",
  description,
  className = "relative",
  labelClassName,
  descriptionClassName,
  errorClassName = defaultErrorClassName,
  dateClassName,
  disabled = false,
  readOnly = false,
  dateFormat = "PPP",
  dateDisplayFormat = "PPP",
  returnFormat = "string",
  closeOnSelect = true,
  showWeekNumbers = false,
  fixedWeeks = true,
  locale,
}: FormDatePickerProps<TFieldValues, TName>) {
  const [open, setOpen] = React.useState(false);

  const formatMap: Record<string, string> = {
    "dd-mm-yyyy": "dd-MM-yyyy",
    "mm-dd-yyyy": "MM-dd-yyyy",
    "yyyy-mm-dd": "yyyy-MM-dd",
    "dd/mm/yyyy": "dd/MM/yyyy",
    "mm/dd/yyyy": "MM/dd/yyyy",
    "yyyy/mm/dd": "yyyy/MM/dd",
    "dd.mm.yyyy": "dd.MM.yyyy",
    "mm.dd.yyyy": "MM.dd.yyyy",
    "yyyy.mm.dd": "yyyy.MM.dd",
    short: "dd/MM/yyyy",
    medium: "dd MMM yyyy",
    long: "dd MMMM yyyy",
    full: "EEEE, dd MMMM yyyy",
    iso: "yyyy-MM-dd",
    "iso-date": "yyyy-MM-dd",
    "iso-datetime": "yyyy-MM-dd'T'HH:mm:ss",
  };

  const actualFormat = formatMap[dateFormat.toLowerCase()] || dateFormat;

  const getFormattedDate = (date: Date, formatPattern: string) => {
    return isValid(date) ? format(date, formatPattern, { locale }) : "";
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState.error;

        const isValidDate = (val: any): val is Date =>
          typeof val === "object" && val instanceof Date && isValid(val);

        const selectedDate =
          typeof field.value === "string"
            ? (() => {
                try {
                  const parsed = parse(field.value, actualFormat, new Date(), {
                    locale,
                  });
                  return isValid(parsed) ? parsed : undefined;
                } catch {
                  return undefined;
                }
              })()
            : isValidDate(field.value)
            ? field.value
            : undefined;

        const handleKeyDown = (e: React.KeyboardEvent) => {
          if (readOnly) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(!open);
          }
          if (e.key === "Escape") setOpen(false);
        };

        const handleDateSelect = (date: Date | undefined) => {
          if (readOnly) return;
          if (!date) {
            field.onChange(null);
            return;
          }
          const formatted =
            returnFormat === "string"
              ? getFormattedDate(date, actualFormat)
              : date;
          field.onChange(formatted);
          if (closeOnSelect) setOpen(false);
        };

        const defaultClassNames = getDefaultClassNames();
        return (
          <FormItem className={cn("flex flex-col", className)}>
            {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
            <Popover open={open && !readOnly} onOpenChange={setOpen}>
              <PopoverTrigger
                asChild
                className="bg-white !border-1 border-black/20"
              >
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal justify-start",
                      !selectedDate && "text-muted-foreground",
                      "hover:bg-accent hover:text-accent-foreground",
                      hasError &&
                        "border-destructive focus-visible:ring-destructive",
                      dateClassName
                    )}
                    disabled={disabled || readOnly}
                    onKeyDown={handleKeyDown}
                    aria-expanded={open}
                    aria-haspopup="dialog"
                    aria-invalid={hasError}
                  >
                    {selectedDate
                      ? getFormattedDate(selectedDate, dateDisplayFormat)
                      : placeholder}
                    <CalendarIcon className="ms-auto h-4 w-4" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  captionLayout="dropdown"
                  timeZone="Asia/Kolkata"
                  mode="single"
                  selected={selectedDate}
                  onDayClick={handleDateSelect}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  showWeekNumber={showWeekNumbers}
                  fixedWeeks={fixedWeeks}
                  locale={locale}
                  showOutsideDays
                  autoFocus
                  classNames={{
                    today: `border-black border-1 rounded-sm`, // Add a border to today's date
                    selected: `rounded-sm`, // Highlight the selected day
                    root: `${defaultClassNames.root} shadow-lg p-5`, // Add a shadow to the root element
                    day_button: `hover:bg-black/10 data-[selected-single=true]:!bg-black data-[selected-single=true]:!text-white`,
                    day: `border-0 shadow-0`,
                    weekday: `${defaultClassNames.weekday} justify-between w-full border-0 border-b border-black/20`,
                    button: ``,
                  }}
                />
              </PopoverContent>
            </Popover>
            <FormMessage className={cn("text-destructive", errorClassName)} />
            {description && (
              <FormDescription className={descriptionClassName}>
                {description}
              </FormDescription>
            )}
          </FormItem>
        );
      }}
    />
  );
}

// FormCheckbox Component
interface FormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormProps<TFieldValues, TName> {
  checkboxLabel?: string;
  checkboxClassName?: string;
  disabled?: boolean;
}

export function FormCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  checkboxLabel,
  description,
  className = "relative",
  labelClassName,
  descriptionClassName,
  errorClassName = defaultErrorClassName,
  checkboxClassName,
  disabled = false,
}: FormCheckboxProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem
          className={cn(
            "flex flex-row items-start space-x-3 space-y-0",
            className
          )}
        >
          <FormControl>
            <Checkbox
              className={cn(
                fieldState.error &&
                  "border-destructive focus-visible:ring-destructive",
                checkboxClassName
              )}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none flex-1">
            {(label || checkboxLabel) && (
              <FormLabel className={labelClassName}>
                {checkboxLabel || label}
              </FormLabel>
            )}
            {description && (
              <FormDescription className={descriptionClassName}>
                {description}
              </FormDescription>
            )}
            <FormMessage className={cn("text-destructive", errorClassName)} />
          </div>
        </FormItem>
      )}
    />
  );
}

// FormRadioGroup Component
interface RadioOption {
  value: string;
  label: string;
}

interface FormRadioGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormProps<TFieldValues, TName> {
  options: RadioOption[];
  radioClassName?: string;
  disabled?: boolean;
}

export function FormRadioGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  options,
  description,
  className = "relative",
  labelClassName,
  descriptionClassName,
  errorClassName = defaultErrorClassName,
  radioClassName,
  disabled = false,
}: FormRadioGroupProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value || ""}
              className={cn(
                "flex flex-col space-y-1",
                fieldState.error &&
                  "border-destructive focus-visible:ring-destructive rounded-md p-2",
                radioClassName
              )}
              disabled={disabled}
            >
              {options.map((option) => (
                <FormItem
                  key={option.value}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <FormLabel className="font-normal">{option.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage className={cn("text-destructive", errorClassName)} />
          {description && (
            <FormDescription className={descriptionClassName}>
              {description}
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}

// FormSwitch Component
interface FormSwitchProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormProps<TFieldValues, TName> {
  switchLabel?: string;
  switchClassName?: string;
  disabled?: boolean;
}

export function FormSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  switchLabel,
  description,
  className = "relative",
  labelClassName,
  descriptionClassName,
  errorClassName = defaultErrorClassName,
  switchClassName,
  disabled = false,
}: FormSwitchProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem
          className={cn(
            "flex flex-row items-center justify-between rounded-lg border p-4",
            fieldState.error &&
              "border-destructive focus-visible:ring-destructive",
            className
          )}
        >
          <div className="space-y-0.5 flex-1">
            {(label || switchLabel) && (
              <FormLabel className={cn("text-base", labelClassName)}>
                {switchLabel || label}
              </FormLabel>
            )}
            {description && (
              <FormDescription className={descriptionClassName}>
                {description}
              </FormDescription>
            )}
            <FormMessage className={cn("text-destructive", errorClassName)} />
          </div>
          <FormControl>
            <Switch
              className={cn(
                fieldState.error &&
                  "border-destructive focus-visible:ring-destructive",
                switchClassName
              )}
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

// FormMultiSelect Component
interface FormMultiSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormProps<TFieldValues, TName> {
  options: SelectOption[];
  multiSelectClassName?: string;
  disabled?: boolean;
}

export function FormMultiSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  options,
  description,
  className = "relative",
  labelClassName,
  descriptionClassName,
  errorClassName = defaultErrorClassName,
  multiSelectClassName,
  disabled = false,
}: FormMultiSelectProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
          <FormControl>
            <div
              className={cn(
                "space-y-2",
                fieldState.error &&
                  "border-destructive focus-visible:ring-destructive rounded-md p-2",
                multiSelectClassName
              )}
            >
              {options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${name}-${option.value}`}
                    checked={field.value?.includes(option.value) || false}
                    onCheckedChange={(checked) => {
                      const currentValue = field.value || [];
                      if (checked) {
                        field.onChange([...currentValue, option.value]);
                      } else {
                        field.onChange(
                          currentValue.filter(
                            (value: string) => value !== option.value
                          )
                        );
                      }
                    }}
                    disabled={disabled}
                  />
                  <Label
                    htmlFor={`${name}-${option.value}`}
                    className="text-sm font-normal"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </FormControl>
          <FormMessage className={cn("text-destructive", errorClassName)} />
          {description && (
            <FormDescription className={descriptionClassName}>
              {description}
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}

// FormSlider Component
interface FormSliderProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormProps<TFieldValues, TName> {
  min?: number;
  max?: number;
  step?: number;
  sliderClassName?: string;
  disabled?: boolean;
}

export function FormSlider<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  min = 0,
  max = 100,
  step = 1,
  description,
  className = "relative",
  labelClassName,
  descriptionClassName,
  errorClassName = defaultErrorClassName,
  sliderClassName,
  disabled = false,
}: FormSliderProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
          <FormControl>
            <div className="space-y-2">
              <Slider
                className={cn(
                  fieldState.error && "accent-destructive",
                  sliderClassName
                )}
                min={min}
                max={max}
                step={step}
                value={[field.value || min]}
                onValueChange={(value) => field.onChange(value[0])}
                disabled={disabled}
              />
              <div className="text-center text-sm text-muted-foreground">
                {field.value || min}
              </div>
            </div>
          </FormControl>
          <FormMessage className={cn("text-destructive", errorClassName)} />
          {description && (
            <FormDescription className={descriptionClassName}>
              {description}
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}

// FormFileUpload Component
interface FormFileUploadProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends BaseFormProps<TFieldValues, TName> {
  accept?: string;
  multiple?: boolean;
  fileClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  maxSize?: number;
  dragAndDrop?: boolean;
  showPreview?: boolean;
}

export function FormFileUpload<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  accept,
  multiple = false,
  description,
  className = "relative",
  labelClassName,
  descriptionClassName,
  errorClassName = defaultErrorClassName,
  fileClassName,
  disabled = false,
  readOnly = false,
  maxSize = 10,
  dragAndDrop = true,
  showPreview = true,
}: FormFileUploadProps<TFieldValues, TName>) {
  const [dragActive, setDragActive] = React.useState(false);
  const [fileError, setFileError] = React.useState<string>("");

  const validateFile = (file: File) => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `File "${file.name}" is too large. Maximum size is ${maxSize}MB`;
    }
    if (accept) {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      const mimeType = file.type;
      const isValidType = acceptedTypes.some((acceptedType) => {
        if (acceptedType.startsWith(".")) {
          return acceptedType.toLowerCase() === fileExtension;
        }
        return mimeType.match(acceptedType.replace("*", ".*"));
      });
      if (!isValidType) {
        return `File "${file.name}" type is not supported. Accepted types: ${accept}`;
      }
    }
    return null;
  };

  const serializeFile = (file: File) => {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    };
  };

  const handleFiles = (
    files: FileList | null,
    onChange: (value: any) => void
  ) => {
    if (!files) return;
    const fileArray = Array.from(files);
    setFileError("");
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        setFileError(error);
        return;
      }
    }
    if (multiple) {
      const serializedFiles = fileArray.map(serializeFile);
      onChange(serializedFiles);
    } else {
      const serializedFile = serializeFile(fileArray[0]);
      onChange(serializedFile || null);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value, ...field }, fieldState }) => (
        <FormItem className={className}>
          {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
          <div className="space-y-4">
            <FormControl>
              {dragAndDrop ? (
                <div
                  className={cn(
                    "relative border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors",
                    dragActive && "border-primary bg-primary/5",
                    (disabled || readOnly) && "opacity-50 cursor-not-allowed",
                    (fieldState.error || fileError) &&
                      "border-destructive focus-visible:ring-destructive bg-destructive/5",
                    fileClassName
                  )}
                  onDragEnter={(e) => {
                    if (disabled || readOnly) return;
                    e.preventDefault();
                    e.stopPropagation();
                    setDragActive(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDragActive(false);
                  }}
                  onDragOver={(e) => {
                    if (readOnly) return;
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    if (disabled || readOnly) return;
                    e.preventDefault();
                    e.stopPropagation();
                    setDragActive(false);
                    handleFiles(e.dataTransfer.files, onChange);
                  }}
                >
                  <div className="text-center">
                    <Upload
                      className={cn(
                        "mx-auto h-12 w-12",
                        fieldState.error || fileError
                          ? "text-destructive"
                          : "text-muted-foreground"
                      )}
                    />
                    <div className="mt-4">
                      <Label
                        htmlFor={name}
                        className={cn(
                          "cursor-pointer text-sm font-medium text-primary hover:text-primary/80",
                          readOnly && "cursor-not-allowed opacity-50"
                        )}
                      >
                        Click to upload
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        or drag and drop
                      </p>
                      {maxSize && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Max file size: {maxSize}MB
                        </p>
                      )}
                      {accept && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Accepted types: {accept}
                        </p>
                      )}
                    </div>
                    <Input
                      {...field}
                      id={name}
                      type="file"
                      accept={accept}
                      multiple={multiple}
                      className="sr-only"
                      onChange={(e) => handleFiles(e.target.files, onChange)}
                      disabled={disabled || readOnly}
                      readOnly={readOnly}
                      value=""
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    {...field}
                    id={name}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    className={cn(
                      (fieldState.error || fileError) &&
                        "border-destructive focus-visible:ring-destructive",
                      fileClassName
                    )}
                    onChange={(e) => handleFiles(e.target.files, onChange)}
                    disabled={disabled || readOnly}
                    readOnly={readOnly}
                    value=""
                  />
                  {maxSize && (
                    <p className="text-xs text-muted-foreground">
                      Max file size: {maxSize}MB
                    </p>
                  )}
                  {accept && (
                    <p className="text-xs text-muted-foreground">
                      Accepted types: {accept}
                    </p>
                  )}
                </div>
              )}
            </FormControl>

            {showPreview && value && (
              <div className="space-y-2">
                {multiple && Array.isArray(value) ? (
                  value.map((file: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-muted p-3 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {file.type?.startsWith("image/") ? "IMG" : "FILE"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium truncate max-w-[200px]">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (readOnly) return;
                          const newFiles = value.filter(
                            (_: any, i: number) => i !== index
                          );
                          onChange(newFiles.length > 0 ? newFiles : null);
                          setFileError("");
                        }}
                        disabled={disabled || readOnly}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {(value as any)?.type?.startsWith("image/")
                            ? "IMG"
                            : "FILE"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate max-w-[200px]">
                          {(value as any)?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {((value as any)?.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (readOnly) return;
                        onChange(null);
                        setFileError("");
                      }}
                      disabled={disabled || readOnly}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {fileError && (
            <CustomError error={fileError} className={errorClassName} />
          )}
          <FormMessage className={cn("text-destructive", errorClassName)} />
          {description && (
            <FormDescription className={descriptionClassName}>
              {description}
            </FormDescription>
          )}
        </FormItem>
      )}
    />
  );
}
