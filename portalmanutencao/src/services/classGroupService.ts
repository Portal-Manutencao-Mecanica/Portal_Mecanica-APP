import "server-only";

import axios from "axios";
import { cookies } from "next/headers";

import { AUTH_COOKIE, getApiUrl } from "@/lib/api/config";
import type { ClassGroup } from "@/lib/api/types";

async function getAuthorizationHeader() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const classGroupService = {
  async list() {
    const { data } = await axios.get<ClassGroup[]>(`${getApiUrl()}/turma`, {
      headers: await getAuthorizationHeader(),
      timeout: 15_000,
    });
    return data;
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
