/**
 * @param {{
 *   label?: string,
 *   name: string,
 *   type?: string,
 *   placeholder?: string,
 *   error?: string,
 *   register?: Function,
 *   className?: string,
 *   disabled?: boolean,
 *   helpText?: string,
 *   icon?: React.ComponentType,
 * }} props
 */
export default function Input({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  register,
  className = '',
  disabled = false,
  helpText,
  icon: Icon,
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        )}
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          {...(register ? register(name) : {})}
          className={[
            'w-full bg-slate-800 border text-white rounded-lg px-4 py-2.5 text-sm',
            'placeholder:text-slate-500 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-red-500' : 'border-slate-600 hover:border-slate-500',
            Icon ? 'pl-10' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      {helpText && !error && <p className="text-xs text-slate-500">{helpText}</p>}
    </div>
  );
}
