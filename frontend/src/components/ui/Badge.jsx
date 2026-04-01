const styles = {
  pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  success: 'bg-green-500/20 text-green-400 border border-green-500/30',
  failed: 'bg-red-500/20 text-red-400 border border-red-500/30',
  retrying: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  processing: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
};

const sizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
};

/**
 * @param {{ status: string, size?: 'sm'|'md' }} props
 */
export default function Badge({ status, size = 'sm' }) {
  const style = styles[status] || styles.pending;
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${style} ${sizes[size] || sizes.sm}`}
    >
      <span className="text-[10px] leading-none">●</span>
      {label}
    </span>
  );
}
