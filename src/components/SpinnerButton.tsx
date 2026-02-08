import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

export function SpinnerButton({
  text,
  disabled,
  isLoading,
  setState,
}: {
  text: string;
  disabled: boolean;
  isLoading: boolean;
  setState: CallableFunction;
}) {
  return (
    <Button variant="secondary" disabled={disabled} onClick={() => setState()}>
      {text}
      {isLoading && <Spinner data-icon="inline-start" />}
    </Button>
  );
}
