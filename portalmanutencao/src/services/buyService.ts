import type { Buy, Page } from "@/lib/api/types";
import { browserApi } from "./httpService";
export const buyService = { async list() { const { data } = await browserApi.get<Page<Buy>>("/compras"); return data; }, async getById(id: string) { const { data } = await browserApi.get<Buy>(`/compras/${encodeURIComponent(id)}`); return data; } };