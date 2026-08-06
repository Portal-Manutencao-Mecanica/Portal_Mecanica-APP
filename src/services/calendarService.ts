import type {
  CalendarResponseDto,
  CreateCalendarEventDto,
  UpdateCalendarEventDto,
} from "@/types/CalendarEvent";
import type { Page, PageQuery } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const calendarService = {
  async list(query: PageQuery = {}) {
    const { data } = await browserApi.get<Page<CalendarResponseDto>>("/eventos", {
      params: query,
    });
    return data;
  },

  async getById(id: string) {
    const { data } = await browserApi.get<CalendarResponseDto>(
      `/eventos/${encodeURIComponent(id)}`,
    );
    return data;
  },

  async create(event: CreateCalendarEventDto) {
    const { data } = await browserApi.post<CalendarResponseDto>("/eventos", event);
    return data;
  },

  async update(id: string, event: UpdateCalendarEventDto) {
    const { data } = await browserApi.patch<CalendarResponseDto>(
      `/eventos/${encodeURIComponent(id)}`,
      event,
    );
    return data;
  },

  async remove(id: string) {
    await browserApi.delete(`/eventos/${encodeURIComponent(id)}`);
  },
};
