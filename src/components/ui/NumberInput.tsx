import { TextInput } from "./TextInput";

export function NumberInput({ label, ...props }: any) {
  return <TextInput label={label} type="number" {...props} />;
}
