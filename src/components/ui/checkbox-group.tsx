"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

export function CheckboxGroup({
  control,
  name,
  label,
  options,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
  name: string;
  label: string;
  options: string[];
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="grid grid-cols-2 gap-2">
            {options.map((option) => (
              <FormItem key={option} className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes(option)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...field.value, option])
                        : field.onChange(
                            field.value.filter((v: string) => v !== option)
                          );
                    }}
                  />
                </FormControl>
                <FormLabel className="font-normal">{option}</FormLabel>
              </FormItem>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
