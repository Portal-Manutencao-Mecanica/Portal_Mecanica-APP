import "server-only";

import axios from "axios";

import { getApiUrl } from "@/lib/api/config";

export const upstreamApi = axios.create({
  baseURL: getApiUrl(),
  timeout: 15_000,
  validateStatus: () => true,
});
