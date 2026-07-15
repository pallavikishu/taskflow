import { useEffect, useState, useCallback } from 'react';
import Navbar from '../components/Navbar';
import ProjectSidebar from '../components/ProjectSidebar';
import KanbanBoard from '../components/KanbanBoard';
import TaskModal from '../components/TaskModal';
import { getProjects, createProject, deleteProject } from '../api/projects';
import {
  getTasksForProject,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '../api/tasks';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [modalTask, setModalTask] = useState(null); // null = closed, {} = new task, {...} = editing
  const [error, setError] = useState('');

  const loadProjects = useCallback(async () => {
    try {
      const data = await getProjects();
      setProjects(data);
      if (data.length > 0 && !selectedProjectId) {
        setSelectedProjectId(data[0].id);
      }
    } catch (err) {
      setError('Could not load projects.');
    }
  }, [selectedProjectId]);

  const loadTasks = useCallback(async (projectId) => {
    if (!projectId) {
      setTasks([]);
      return;
    }
    setLoadingTasks(true);
    try {
      const data = await getTasksForProject(projectId);
      setTasks(data);
    } catch (err) {
      setError('Could not load tasks for this project.');
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadTasks(selectedProjectId);
  }, [selectedProjectId, loadTasks]);

  const handleCreateProject = async (payload) => {
    const created = await createProject(payload);
    setProjects((prev) => [...prev, created]);
    setSelectedProjectId(created.id);
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    await deleteProject(projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
      setTasks([]);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      setError('Could not update task status.');
      loadTasks(selectedProjectId);
    }
  };

  const handleSaveTask = async (payload) => {
    try {
      if (modalTask?.id) {
        const updated = await updateTask(modalTask.id, payload);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      } else {
        const created = await createTask(selectedProjectId, payload);
        setTasks((prev) => [...prev, created]);
      }
      setModalTask(null);
    } catch (err) {
      setError('Could not save task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setModalTask(null);
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-body">
        <ProjectSidebar
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelect={setSelectedProjectId}
          onCreate={handleCreateProject}
          onDelete={handleDeleteProject}
        />

        <main className="board-area">
          {error && <div className="error-banner">{error}</div>}

          {!selectedProject && (
            <div className="empty-state">
              <h2>No project selected</h2>
              <p>Create or select a project from the sidebar to see its board.</p>
            </div>
          )}

          {selectedProject && (
            <>
              <div className="board-header">
                <h2>{selectedProject.name}</h2>
                {selectedProject.description && <p>{selectedProject.description}</p>}
              </div>

              {loadingTasks ? (
                <p className="loading-text">Loading tasks...</p>
              ) : (
                <KanbanBoard
                  tasks={tasks}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                  onEdit={setModalTask}
                  onAddTask={() => setModalTask({})}
                />
              )}
            </>
          )}
        </main>
      </div>

      {modalTask !== null && (
        <TaskModal
          task={modalTask}
          onClose={() => setModalTask(null)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}
