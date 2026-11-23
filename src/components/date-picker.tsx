import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  id?: string
  value: Date | undefined
  onChange: (date: Date) => void
  placeholder?: string
  /** Earliest selectable month in the dropdowns. */
  fromYear?: number
  /** Latest selectable month in the dropdowns. */
  toYear?: number
  "aria-describedby"?: string
}

export function DatePicker({
  id,
  value,
  onChange,
  placeholder = "Pick a date",
  fromYear = 1900,
  toYear = new Date().getFullYear() + 10,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          data-empty={!value}
          className="h-10 w-full justify-start font-normal data-[empty=true]:text-muted-foreground"
          aria-describedby={props["aria-describedby"]}
        >
          <CalendarIcon className="text-muted-foreground" />
          {value ? format(value, "EEE, d MMMM yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          defaultMonth={value}
          captionLayout="dropdown"
          startMonth={new Date(fromYear, 0)}
          endMonth={new Date(toYear, 11)}
          onSelect={(date) => {
            if (!date) return
            onChange(date)
            setOpen(false)
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
