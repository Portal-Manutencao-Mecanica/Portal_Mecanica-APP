import type {
  CalendarResponseDto,
  CreateCalendarEventDto,
} from "@/types/CalendarEvent";
import { browserApi } from "./httpService";

export const calendarService = {
  async list() {
    const { data } = await browserApi.get<CalendarResponseDto[]>("/eventos");
    return data;
  },

  async create(event: CreateCalendarEventDto) {
    const { data } = await browserApi.post<CalendarResponseDto>("/eventos", event);
    return data;
  },
};
