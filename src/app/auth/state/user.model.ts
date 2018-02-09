

export interface Roles {
    user?: boolean;
    dealer?: boolean;
    contentcreator?: boolean;
    admin?: boolean;
}

export interface Verified {
    links?: any;
    facebook?: boolean;
    twitter?: boolean;
    email?: boolean;
    phone?: boolean;
}

export interface Local {
    uid: string;
    country: string;
    city: string;
    lat_long: string;
    region: string;
    internetOrg: string;
    ip: string;
    admin?: boolean;
}

export interface User {
    uid: string;
    email: string;
    photoURL?: string;
    accountType?: string;
    displayName?: {
        username?: string;
        editCount: number;
        fullname?: string;
    };
    favoriteColor?: string;
    createdAt?: any;
    updatedAt?: any;
    view?: number;
    catchPhrase?: string;
    status?: string;
    roles?: Roles;
    verified?: Verified;
    bio?: string;
}