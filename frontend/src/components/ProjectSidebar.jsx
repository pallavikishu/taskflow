import { useState } from 'react';

export default function ProjectSidebar({ projects, selectedProjectId, onSelect, onCreate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onCreate({ name, description });
    setName('');
    setDescription('');
    setShowForm(false);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Projects</h2>
        <button className="btn-icon" onClick={() => setShowForm((s) => !s)} title="New project">
          {showForm ? '×' : '+'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="project-form">
          <input
            placeholder="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
          <button type="submit" className="btn-primary btn-small">Create</button>
        </form>
      )}

      <ul className="project-list">
        {projects.length === 0 && !showForm && (
          <li className="empty-hint">No projects yet. Create your first one.</li>
        )}
        {projects.map((project) => (
          <li
            key={project.id}
            className={`project-item ${project.id === selectedProjectId ? 'active' : ''}`}
          >
            <span onClick={() => onSelect(project.id)} className="project-name">
              {project.name}
            </span>
            <button
              className="btn-icon-small"
              title="Delete project"
              onClick={() => onDelete(project.id)}
            >
              🗑
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
