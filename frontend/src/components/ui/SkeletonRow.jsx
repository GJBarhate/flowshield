/**
 * Animated placeholder table row
 * @param {{ cols?: number }} props
 */
export default function SkeletonRow({ cols = 6 }) {
  const widths = ['w-20', 'w-28', 'w-24', 'w-24', 'w-12', 'w-16'];
  return (
    <tr className="border-b border-slate-700/50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className={`px-4 py-3 ${i >= 3 && i <= 4 ? 'hidden md:table-cell' : ''}`}>
          <div
            className={`h-4 bg-slate-700/80 rounded animate-pulse ${widths[i] || 'w-20'}`}
          />
        </td>
      ))}
    </tr>
  );
}
