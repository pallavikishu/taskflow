import client from './client';

export const getProjects = () => client.get('/projects').then((res) => res.data);

export const getProject = (projectId) =>
  client.get(`/projects/${projectId}`).then((res) => res.data);

export const createProject = (data) =>
  client.post('/projects', data).then((res) => res.data);

export const updateProject = (projectId, data) =>
  client.put(`/projects/${projectId}`, data).then((res) => res.data);

export const deleteProject = (projectId) =>
  client.delete(`/projects/${projectId}`).then((res) => res.data);
