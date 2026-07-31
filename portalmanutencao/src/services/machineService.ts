import type { Machine, Page } from "@/lib/api/types";
import { browserApi } from "./httpService";

export const machineService = {
    async list(): Promise<Page<Machine>> {
        const { data } = await browserApi.get<Page<Machine>>("/maquinas");

        return data;
    },

    async getById(id: string): Promise<Machine> {
        const { data } = await browserApi.get<Machine>(
            `/maquinas/${encodeURIComponent(id)}`,
        );

        return data;
    },

    async create(machine: {
        name: string;
        patrimony: string;
        condition: Machine["condition"];
        tag: string;
        placeId: string;
    }): Promise<Machine> {
        const { data } = await browserApi.post<Machine>("/maquinas", machine);

        return data;
    },

    async update(
        id: string,
        machine: Pick<Machine, "name" | "patrimony" | "condition" | "tag">,
    ): Promise<Machine> {
        const { data } = await browserApi.patch<Machine>(
            `/maquinas/${encodeURIComponent(id)}`,
            machine,
        );

        return data;
    },

    async remove(id: string): Promise<void> {
        await browserApi.delete(`/maquinas/${encodeURIComponent(id)}`);
    },
};