import { useId } from "react"
import { Field, FieldContent, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

interface SwitchFieldProps {
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

/** A labelled switch laid out as a horizontal field. */
export function SwitchField({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: SwitchFieldProps) {
  const id = useId()
  return (
    <Field orientation="horizontal" data-disabled={disabled}>
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {description ? <FieldDescription>{description}</FieldDescription> : null}
      </FieldContent>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </Field>
  )
}
