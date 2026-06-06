import type { IProfile } from "../types/profile";
import { MethodeService } from "./methode.service";

class ProfileService extends MethodeService {
    private endpoint = "Profile";

    // async getBy

    async getAll() {
        return await this.get<IProfile[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<IProfile>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<IProfile>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<IProfile>) {
        return await this.put(`${this.endpoint}/${id}`, { id, ...data });
    }

    async delete(id: number) {
        return await this.del(this.endpoint, id);
    }

    async purge(ids: number[]) {
        return await this.reset(this.endpoint, ids);
    }
}

export const profileService = new ProfileService();
