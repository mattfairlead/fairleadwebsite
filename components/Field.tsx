import clsx from "clsx";

type Base = {
  label: string;
  hint?: string;
  className?: string;
};

type InputProps = Base & { as?: "input" } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "className">;
type TextareaProps = Base & { as: "textarea" } & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className">;

/**
 * Underline field — §5.3 / §5.9. Label above, 1px resting rule, and a gold
 * rule that draws in from the left on focus (the `.field-wrap` recipe).
 */
export default function Field(props: InputProps | TextareaProps) {
  const { label, hint, className, ...rest } = props;
  return (
    <label className={clsx("field-wrap flex flex-col gap-2", className)}>
      <span className="flex items-baseline justify-between gap-4">
        <span className="label text-white-50">{label}</span>
        {hint && <span className="body-sm text-white-40">{hint}</span>}
      </span>
      {rest.as === "textarea" ? (
        <textarea className="field" {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input className="field" {...(rest as React.InputHTMLAttributes<HTMLInputElement>)} />
      )}
    </label>
  );
}
