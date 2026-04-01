import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderKanban } from 'lucide-react';
import ProjectCard from '@/components/features/ProjectCard.jsx';
import CreateProjectModal from '@/components/features/CreateProjectModal.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';
import Button from '@/components/ui/Button.jsx';
import { getProjects } from '@/api/projects.api.js';
import { useProjectStore } from '@/store/projectStore.js';
import { useToast } from '@/hooks/useToast.js';

export default function ProjectsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const { projects, setProjects, loading, setLoading } = useProjectStore();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">My Projects</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {loading
              ? 'Loading…'
              : `${projects.length} project${projects.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 animate-pulse space-y-4"
            >
              <div className="flex justify-between">
                <div className="h-5 bg-slate-700 rounded w-1/3" />
                <div className="h-5 bg-slate-700 rounded w-12" />
              </div>
              <div className="h-10 bg-slate-700 rounded" />
              <div className="h-10 bg-slate-700 rounded" />
              <div className="flex justify-between pt-2">
                <div className="h-4 bg-slate-700 rounded w-1/4" />
                <div className="h-8 bg-slate-700 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && projects.length === 0 && (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to generate a webhook URL and API key."
          action={
            <Button variant="primary" onClick={() => setShowCreate(true)}>
              <Plus className="w-4 h-4" />
              Create Project
            </Button>
          }
        />
      )}

      {/* Project grid */}
      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onViewEvents={(id) => navigate(`/projects/${id}`)}
            />
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
      />
    </div>
  );
}
