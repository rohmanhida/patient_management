import { useAuthStore } from '@/lib/auth';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const token = useAuthStore.getState().token;

export async function getData(uri: string) {
  const res = await fetch(`${API_URL}${uri}`, {
    cache: 'no-store',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  if (!res.ok)
    throw new Error(`Failed to fetch data ${res.status} ${res.statusText}`);
  if (res.status === 403) window.location.href = '/auth/login';
  return res.json();
}

export async function postData(uri: string, payload: any) {
  const res = await fetch(`${API_URL}${uri}`, {
    method: 'POST',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok)
    throw new Error(`Failed to create data ${res.status} ${res.statusText}`);
  if (res.status === 403) window.location.href = '/auth/login';
  return res.json();
}

export async function updateData(uri: string, id: number, payload: any) {
  const res = await fetch(`${API_URL}${uri}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok)
    throw new Error(`Failed to update data ${res.status} ${res.statusText}`);
  if (res.status === 403) window.location.href = '/auth/login';

  return res.json();
}

export async function deleteData(uri: string, id: number) {
  const res = await fetch(`${API_URL}${uri}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  if (!res.ok)
    throw new Error(`Failed to delete data ${res.status} ${res.statusText}`);
  if (res.status === 403) window.location.href = '/auth/login';

  return res.json();
}
