import { getCollectionItems } from '@/lib/api/collections';
import type { Buy } from '@/lib/api/types';
import { browserApi } from './httpService';

export const buyService = {
  async list() {
    const { data } = await browserApi.get<unknown>('/compras', {
      params: { page: 0, size: 100 },
    });
    return getCollectionItems<Buy>(data, 'solicita\u00e7\u00f5es de compra');
  },

  async getById(id: string) {
    const { data } = await browserApi.get<Buy>(
      `/compras/${encodeURIComponent(id)}`,
    );
    return data;
  },
};
