import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '@/components/ui/Modal.jsx';
import Input from '@/components/ui/Input.jsx';
import Button from '@/components/ui/Button.jsx';
import { createProjectSchema } from '@/utils/validators.js';
import { createProject } from '@/api/projects.api.js';
import { useProjectStore } from '@/store/projectStore.js';
import { useToast } from '@/hooks/useToast.js';

/**
 * @param {{ isOpen: boolean, onClose: Function }} props
 */
export default function CreateProjectModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const addProject = useProjectStore((s) => s.addProject);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: '', description: '' },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const project = await createProject(values.name, values.description || '');
      addProject(project);
      toast.success('Project created successfully!');
      reset();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Project" size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Project Name"
          name="name"
          placeholder="e.g. Payment Webhooks"
          register={register}
          error={errors.name?.message}
          helpText="Min 3 characters, max 50"
        />
        <Input
          label="Description"
          name="description"
          placeholder="Optional description..."
          register={register}
          error={errors.description?.message}
          helpText="Optional, max 200 characters"
        />
        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            fullWidth
            onClick={handleClose}
            type="button"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button variant="primary" fullWidth type="submit" loading={loading}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
}
