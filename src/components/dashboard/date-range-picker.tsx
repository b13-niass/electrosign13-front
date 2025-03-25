"use client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/shadcn-ui/button"
import { Calendar } from "@/components/shadcn-ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn-ui/popover"

interface DateRangePickerProps {
    date: DateRange | undefined
    setDate: (date: DateRange | undefined) => void
    className?: string
}

export function DateRangePicker({ date, setDate, className }: DateRangePickerProps) {
    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "d MMMM yyyy", { locale: fr })} - {format(date.to, "d MMMM yyyy", { locale: fr })}
                                </>
                            ) : (
                                format(date.from, "d MMMM yyyy", { locale: fr })
                            )
                        ) : (
                            <span>Sélectionner une période</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                        locale={fr}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

