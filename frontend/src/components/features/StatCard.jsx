import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
  indigo: 'bg-indigo-500/20 text-indigo-400',
  green: 'bg-green-500/20 text-green-400',
  red: 'bg-red-500/20 text-red-400',
  yellow: 'bg-yellow-500/20 text-yellow-400',
};

/**
 * @param {{
 *   title: string,
 *   value: string|number,
 *   icon?: React.ComponentType,
 *   trend?: string,
 *   color?: 'indigo'|'green'|'red'|'yellow',
 * }} props
 */
export default function StatCard({ title, value, icon: Icon, trend, color = 'indigo' }) {
  const isPositive = trend && trend.startsWith('+');
  const iconClass = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-400 mb-1 truncate">{title}</p>
          <p className="text-3xl font-bold text-white tabular-nums">{value ?? '—'}</p>
          {trend && (
            <span
              className={`inline-flex items-center gap-1 text-xs mt-1.5 font-medium ${
                isPositive ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend}
            </span>
          )}
        </div>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconClass}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
