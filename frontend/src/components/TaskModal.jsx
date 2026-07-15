import { useState, useEffect } from 'react';

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

export default function TaskModal({ task, onClose, onSave, onDelete }) {
  const isEditing = Boolean(task?.id);

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState(task?.status || 'TODO');
  const [priority, setPriority] = useState(task?.priority || 'MEDIUM');
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? task.dueDate.substring(0, 10) : ''
  );

  useEffect(() => {
    setTitle(task?.title || '');
    setDescription(task?.description || '');
    setStatus(task?.status || 'TODO');
    setPriority(task?.priority || 'MEDIUM');
    setDueDate(task?.dueDate ? task.dueDate.substring(0, 10) : '');
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{isEditing ? 'Edit Task' : 'New Task'}</h3>
        <form onSubmit={handleSubmit} className="task-form">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />

          <label>Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="form-row">
            <div>
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label>Due date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

          <div className="modal-actions">
            {isEditing && (
              <button
                type="button"
                className="btn-danger"
                onClick={() => onDelete(task.id)}
              >
                Delete
              </button>
            )}
            <div className="modal-actions-right">
              <button type="button" className="btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {isEditing ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
