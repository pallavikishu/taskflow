const PRIORITY_COLORS = {
  LOW: '#5b8def',
  MEDIUM: '#e8a33d',
  HIGH: '#e85d5d',
};

export default function TaskCard({ task, onDragStart, onDelete, onEdit }) {
  return (
    <div
      className="task-card"
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onEdit(task)}
    >
      <div className="task-card-top">
        <span
          className="priority-dot"
          style={{ backgroundColor: PRIORITY_COLORS[task.priority] || '#999' }}
          title={`${task.priority} priority`}
        />
        <button
          className="btn-icon-small task-delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          title="Delete task"
        >
          ×
        </button>
      </div>
      <p className="task-title">{task.title}</p>
      {task.dueDate && (
        <p className="task-due">Due {new Date(task.dueDate).toLocaleDateString()}</p>
      )}
    </div>
  );
}
