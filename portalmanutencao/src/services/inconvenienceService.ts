import { getCollectionItems } from '@/lib/api/collections';
import type { Inconvenience5S } from '@/lib/api/types';
import { browserApi } from './httpService';

export const inconvenienceService = {
  async list() {
    const { data } = await browserApi.get<unknown>('/5s', {
      params: { page: 0, size: 100 },
    });
    return getCollectionItems<Inconvenience5S>(data, 'inconveni\u00eancias 5S');
  },

  async getById(id: string) {
    const { data } = await browserApi.get<Inconvenience5S>(
      `/5s/${encodeURIComponent(id)}`,
    );
    return data;
  },

  async create(payload: {
    inconvenience: string;
    placeId: string;
    notifiedTeacherId: string;
    classGroupId: string;
    involvedStudentIds: string[];
    description: string;
    registrationPeriod: string;
  }) {
    const { data } = await browserApi.post<Inconvenience5S>('/5s', payload);
    return data;
  },
};
