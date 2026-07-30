import 'server-only';

import axios from 'axios';
import { cookies } from 'next/headers';

import { getCollectionItems } from '@/lib/api/collections';
import { AUTH_COOKIE, getApiUrl } from '@/lib/api/config';
import type { ClassGroup } from '@/lib/api/types';

async function getAuthorizationHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const classGroupService = {
  async list() {
    const { data } = await axios.get<unknown>(`${getApiUrl()}/turma`, {
      headers: await getAuthorizationHeader(),
      params: { page: 0, size: 100 },
      timeout: 15_000,
    });
    return getCollectionItems<ClassGroup>(data, 'turmas');
  },

  async getById(id: string) {
    const { data } = await axios.get<ClassGroup>(
      `${getApiUrl()}/turma/${encodeURIComponent(id)}`,
      {
        headers: await getAuthorizationHeader(),
        timeout: 15_000,
      },
    );
    return data;
  },
};
