const paddings = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

/**
 * @param {{
 *   children: React.ReactNode,
 *   className?: string,
 *   padding?: 'sm'|'md'|'lg',
 *   hoverable?: boolean,
 * }} props
 */
export default function Card({ children, className = '', padding = 'md', hoverable = false }) {
  return (
    <div
      className={[
        'bg-slate-800 border border-slate-700 rounded-xl',
        paddings[padding] || paddings.md,
        hoverable ? 'hover:border-indigo-500/50 transition-colors cursor-pointer' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
