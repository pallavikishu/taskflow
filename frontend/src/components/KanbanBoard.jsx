import { useState } from 'react';
import TaskCard from './TaskCard';

const COLUMNS = [
  { key: 'TODO', label: 'To Do' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'DONE', label: 'Done' },
];

export default function KanbanBoard({ tasks, onStatusChange, onDelete, onEdit, onAddTask }) {
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e, columnKey) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    setDragOverColumn(null);
    if (taskId) {
      onStatusChange(taskId, columnKey);
    }
  };

  const tasksByStatus = (status) => tasks.filter((t) => t.status === status);

  return (
    <div className="kanban-board">
      {COLUMNS.map((col) => (
        <div
          key={col.key}
          className={`kanban-column ${dragOverColumn === col.key ? 'drag-over' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverColumn(col.key);
          }}
          onDragLeave={() => setDragOverColumn(null)}
          onDrop={(e) => handleDrop(e, col.key)}
        >
          <div className="kanban-column-header">
            <h3>{col.label}</h3>
            <span className="task-count">{tasksByStatus(col.key).length}</span>
          </div>

          <div className="kanban-column-body">
            {tasksByStatus(col.key).map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDragStart={handleDragStart}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </div>

          {col.key === 'TODO' && (
            <button className="btn-add-task" onClick={onAddTask}>
              + Add task
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
