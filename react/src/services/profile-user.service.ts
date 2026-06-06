import type { IProfileUser } from "../types/profile-user";
import { MethodeService } from "./methode.service";

class ProfileUserService extends MethodeService {
    private endpoint = "Profile_User";
    
    async getByIdUser(idUser: number): Promise<IProfileUser[]> {
        const resp = await this.getAll();
        return resp.filter(pu => pu.users_id === idUser);
    }
    async getAll() {
        return await this.get<IProfileUser[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<IProfileUser>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<IProfileUser>) {
        return await this.post(this.endpoint, data);
    }

    async update(id: number, data: Partial<IProfileUser>) {
        return await this.put(`${this.endpoint}/${id}`, { id, ...data });
    }

    async delete(id: number) {
        return await this.del(this.endpoint, id);
    }

    async purge(ids: number[]) {
        return await this.reset(this.endpoint, ids);
    }
}

export const profileUserService = new ProfileUserService();
