import React, {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

type ValidationMessage = string;
type ValidationContextValue = {
  clientValidationMessages: ValidationMessage[];
  updateClientValidationMessages: Dispatch<SetStateAction<ValidationMessage[]>>;
};
const ValidationContext = React.createContext<
  ValidationContextValue | undefined
>(undefined);

export const ValidationProvider = ({ children }: { children: ReactNode }) => {
  const [clientValidationMessages, updateClientValidationMessages] =
    React.useState<ValidationMessage[]>([]);

  return (
    <ValidationContext.Provider
      value={{ clientValidationMessages, updateClientValidationMessages }}
    >
      {children}
    </ValidationContext.Provider>
  );
};

export function useValidation(): readonly [
  ValidationMessage[],
  Dispatch<SetStateAction<ValidationMessage[]>>,
] {
  const ctx = React.useContext(ValidationContext);

  if (!ctx) {
    throw new Error('useValidation must be used within ValidationProvider');
  }
  return [
    ctx.clientValidationMessages,
    ctx.updateClientValidationMessages,
  ] as const;
}
