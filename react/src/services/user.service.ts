import axios from "axios";
import type { IUser } from "../types/auth/user";
import { APP_TOKEN, baseUrl, UTIL_CONST } from "../utils";
import { MethodeService } from "./methode.service";
import type { IProfile } from "../types/profile";
import { profileService } from "./profile.service";
import { profileUserService } from "./profile-user.service";
import { apiClient } from "../utils/api";
import type { IAssetImport } from "../types/import/assets-import";

class UserService extends MethodeService {
    private endpoint = "User";
    async createsByAssetImport(assetImports: IAssetImport[]): Promise<void> {
        const userNames = [...new Set(assetImports.filter(ai => ai.user != undefined || ai.user != null).map(ai => {
            if (ai.user) {
                return ai.user.trim();
            }
        }))];
        console.log(userNames);

        for (const userName of userNames) {
            const user: Partial<IUser> = {
                name: userName,
                realname: userName,
                password2: userName,
                password: userName,
                api_token: userName,
            }

            await this.create(user);
        }
    }
    async logout() {
        await apiClient.get("/killSession");
        localStorage.removeItem(UTIL_CONST.user);
        localStorage.removeItem(UTIL_CONST.token);
    }
    async getProfilesById(idUser: number): Promise<IProfile[]> {
        const profile_users_ids = (await profileUserService.getByIdUser(idUser)).map(pu => pu.profiles_id);
        const profiles = await profileService.getAll();
        return profiles.filter(p => profile_users_ids.includes(p.id));
    }
    async login(username: string, password: string) {
        const base64Encoded = btoa(`${username}:${password}`)
        const loginApi = axios.create({
            baseURL: baseUrl,
            timeout: 10000,
            headers: {
                'App-Token': APP_TOKEN,
                'Accept': 'application/json',
                'Authorization': `Basic ${base64Encoded}`
            }
        });
        return loginApi.get("/initSession").then(async value => {
            const data = value.data;
            const token = data.session_token;
            localStorage.setItem(UTIL_CONST.token, token);
            const user = await this.getByName(username);
            if (!user) throw new Error("Utilisateur non trouvé");
            // const profileUsers =  await this.getProfilesById (user.id);
            // console.log(user);
            // console.log ("les Profiles de cette users: " ,  profileUsers)
            localStorage.setItem(UTIL_CONST.user, JSON.stringify(user));
            return user;
        }).catch(error => {
            const resp = error.response?.data?.error;
            console.error(error);
            throw resp;
        });
    }

    async getByName(userName: string): Promise<IUser | null> {
        const allUsers = await this.getAll();
        console.log("allUsers: ", allUsers);
        return allUsers.find(u => u.name === userName) ?? null;
    }
    async getAll() {
        return await this.get<IUser[]>(this.endpoint);
    }

    async getById(id: number) {
        return await this.get<IUser>(`${this.endpoint}/${id}`);
    }

    async create(data: Partial<IUser>) {
        return await this.post(this.endpoint, { ...data });
    }

    async update(id: number, data: any) {
        return await this.put(`${this.endpoint}/${id}`, { id, ...data });
    }

    async delete(id: number) {
        return await this.del(this.endpoint, id, false);
    }

    async purge() {
        const ids = (await this.getAll()).filter(u => u.id != 2 && u.id != 6).map(u => u.id);
        return await this.reset(this.endpoint, ids);
    }
}

export const userService = new UserService();