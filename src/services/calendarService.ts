import type { Page } from "@/lib/api/types";
import type { CalendarResponseDto, CreateCalendarEventDto } from "@/types/CalendarEvent";
import { browserApi } from "./httpService";

export const calendarService = {
  async list(params?: { page?: number; size?: number; sort?: string }) {
    const { data } = await browserApi.get<Page<CalendarResponseDto>>("/eventos", {
      params,
    });
    return data;
  },

  async create(event: CreateCalendarEventDto) {
    const { data } = await browserApi.post<CalendarResponseDto>("/eventos", event);
    return data;
  },
};
