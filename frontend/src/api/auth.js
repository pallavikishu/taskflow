import client from './client';

export const registerUser = (username, email, password) =>
  client.post('/auth/register', { username, email, password }).then((res) => res.data);

export const loginUser = (username, password) =>
  client.post('/auth/login', { username, password }).then((res) => res.data);
