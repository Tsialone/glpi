export interface IProfilUserLink {
    rel: string;
    href: string;
}

export interface IProfileUser {
    id: number;
    users_id: number;
    profiles_id: number;
    entities_id: number;
    is_recursive: number;
    is_dynamic: number;
    is_default_profile: number;
    links: IProfilUserLink[];
}
