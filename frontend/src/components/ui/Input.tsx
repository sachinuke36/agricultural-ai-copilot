import { InputProps, SelectProps } from "@/types";

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-2 rounded-lg border
          ${error
            ? "border-red-500 focus:ring-red-500"
            : "border-zinc-300 dark:border-zinc-700 focus:ring-green-500"
          }
          bg-zinc-50 dark:bg-zinc-800
          text-zinc-900 dark:text-zinc-100 text-sm
          placeholder-zinc-500
          focus:outline-none focus:ring-2 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

export function Select({ label, options, className = "", ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-3 py-2 rounded-lg border
          border-zinc-300 dark:border-zinc-700
          bg-zinc-50 dark:bg-zinc-800
          text-zinc-900 dark:text-zinc-100 text-sm
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
