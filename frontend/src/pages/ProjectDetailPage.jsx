import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
import StatCard from '@/components/features/StatCard.jsx';
import EventTable from '@/components/features/EventTable.jsx';
import ApiKeyDisplay from '@/components/features/ApiKeyDisplay.jsx';
import Button from '@/components/ui/Button.jsx';
import { getEvents, getEventStats, retryEvent } from '@/api/events.api.js';
import { regenerateApiKey, getProjects } from '@/api/projects.api.js';
import { useEventStore } from '@/store/eventStore.js';
import { useProjectStore } from '@/store/projectStore.js';
import { useSocket } from '@/hooks/useSocket.js';
import { useToast } from '@/hooks/useToast.js';
import TestWebhook from "../components/features/TestWebhook";

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'success', label: 'Success' },
  { value: 'failed', label: 'Failed' },
  { value: 'retrying', label: 'Retrying' },
];

const DATE_RANGES = [
  { label: 'Today', days: 1 },
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: 'All time', days: null },
];

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { connected } = useSocket(projectId);

  const {
    events,
    setEvents,
    appendEvents,
    updateEvent,
    stats,
    setStats,
    loading,
    setLoading,
    pagination,
    setPagination,
  } = useEventStore();

  const { projects, setProjects, updateProject } = useProjectStore();

  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRangeDays, setDateRangeDays] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const project = projects.find((p) => p._id === projectId);

  const buildParams = useCallback(
    (page = 1) => {
      const params = { page, limit: 20 };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (dateRangeDays) {
        const start = new Date();
        start.setDate(start.getDate() - dateRangeDays);
        params.startDate = start.toISOString();
      }
      return params;
    },
    [statusFilter, dateRangeDays]
  );

  const loadAll = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const requests = [
          getEvents(projectId, buildParams(1)),
          getEventStats(projectId),
        ];
        if (projects.length === 0) {
          requests.push(getProjects());
        }
        const results = await Promise.all(requests);
        const [evtData, statsData, projs] = results;

        setEvents(evtData.events);
        setPagination(evtData.pagination);
        setStats(statsData);
        if (projs) setProjects(projs);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    },
    [projectId, buildParams, projects.length]
  );

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAll(true);
    setRefreshing(false);
  };

  const handleLoadMore = async () => {
    if (loadingMore || pagination.page >= pagination.pages) return;
    setLoadingMore(true);
    try {
      const data = await getEvents(projectId, buildParams(pagination.page + 1));
      appendEvents(data.events);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleRetry = async (eventId) => {
    try {
      const { event } = await retryEvent(eventId);
      updateEvent(event);
      toast.success('Event queued for retry');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRegenerate = async () => {
    if (
      !window.confirm(
        'Regenerate API key? The current key will stop working immediately.'
      )
    ) {
      return;
    }
    setRegenerating(true);
    try {
      const updated = await regenerateApiKey(projectId);
      updateProject(projectId, updated);
      toast.success('API key regenerated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setRegenerating(false);
    }
  };

  const hasMore = pagination.page < pagination.pages;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/projects")}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex-shrink-0"
          aria-label="Back to projects"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold text-white truncate">
            {project?.name || "Project Details"}
          </h1>
          {project?.description && (
            <p className="text-sm text-slate-400 truncate">
              {project.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`hidden sm:inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
              connected
                ? "text-green-400 bg-green-500/10"
                : "text-yellow-400 bg-yellow-500/10 animate-pulse"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {connected ? "Live" : "Reconnecting…"}
          </span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* API Key & Webhook URL */}
      {project && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">
            Endpoint Configuration
          </h3>
          <ApiKeyDisplay
            apiKey={project.apiKey}
            webhookUrl={project.webhookUrl}
            onRegenerate={handleRegenerate}
            regenerating={regenerating}
          />
        </div>
      )}

      {project && (
        <TestWebhook projectId={project._id} apiKey={project.apiKey} />
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total"
          value={stats.total}
          icon={Activity}
          color="indigo"
        />
        <StatCard
          title="Success"
          value={stats.success}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Failed"
          value={stats.failed}
          icon={XCircle}
          color="red"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="yellow"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status filter */}
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === value
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-slate-700 hidden sm:block" />

        {/* Date range filter */}
        <div className="flex flex-wrap gap-1.5">
          {DATE_RANGES.map(({ label, days }) => (
            <button
              key={label}
              onClick={() => setDateRangeDays(days)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                dateRangeDays === days
                  ? "bg-indigo-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Events table */}
      <EventTable
        events={events}
        loading={loading}
        onRetry={handleRetry}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadingMore={loadingMore}
      />
    </div>
  );
}
