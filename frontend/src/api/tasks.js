import client from './client';

export const getTasksForProject = (projectId) =>
  client.get(`/projects/${projectId}/tasks`).then((res) => res.data);

export const createTask = (projectId, data) =>
  client.post(`/projects/${projectId}/tasks`, data).then((res) => res.data);

export const updateTask = (taskId, data) =>
  client.put(`/tasks/${taskId}`, data).then((res) => res.data);

export const updateTaskStatus = (taskId, status) =>
  client.patch(`/tasks/${taskId}/status`, { status }).then((res) => res.data);

export const deleteTask = (taskId) =>
  client.delete(`/tasks/${taskId}`).then((res) => res.data);
