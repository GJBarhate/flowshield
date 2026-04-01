const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
};

const colors = {
  white: 'text-white',
  indigo: 'text-indigo-500',
};

/**
 * @param {{ size?: 'sm'|'md'|'lg', color?: 'white'|'indigo' }} props
 */
export default function Spinner({ size = 'md', color = 'white' }) {
  return (
    <svg
      className={`animate-spin ${sizes[size]} ${colors[color]}`}
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}
