/**
 * TanStack Form + Shadcn UI reusable form inputs.
 *
 * Each component receives a `field` prop (the render-prop argument from `form.Field`)
 * and a `label` prop displayed above the input. Errors are shown below automatically
 * from the field's validation state.
 *
 * @example
 * ```tsx
 * import { FormInput, FormCheckbox, FormRadioGroup, FormCheckboxGroup } from "#/components/form"
 *
 * <form.Field name="email">
 *   {(field) => <FormInput field={field} label="Email" type="email" />}
 * </form.Field>
 * ```
 */
export { FormInput, type FormInputProps } from "./form-input";
export { FormCheckbox, type FormCheckboxProps } from "./form-checkbox";
export { FormRadioGroup, type FormRadioGroupProps } from "./form-radio-group";
export { FormCheckboxGroup, type FormCheckboxGroupProps } from "./form-checkbox-group";
export { FormSelect, type FormSelectProps } from "./form-select";
export { FormTextarea, type FormTextareaProps } from "./form-textarea";
export { FormSwitch, type FormSwitchProps } from "./form-switch";
export { FormNumber, type FormNumberProps } from "./form-number";
export { FormPhotoUpload, type FormPhotoUploadProps } from "./form-photo-upload";
