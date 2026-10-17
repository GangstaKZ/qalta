import { formatKzt } from "@/lib/format";

export function AmountText({
  value,
  className = "text-4xl font-semibold tabular",
  negative = false,
}: {
  value: number;
  className?: string;
  negative?: boolean;
}) {
  if (negative) {
    return (
      <span className={`${className} text-danger`}>
        −{formatKzt(Math.abs(value))}
      </span>
    );
  }
  return <span className={className}>{formatKzt(value)}</span>;
}
