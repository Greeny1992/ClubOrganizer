export interface User {
    id?: number;
    firstname: string;
    lastname: string;
    username: string;
    password:string;
    email:string;
    role:string;
    active:boolean
}

export interface UserPatch {
    firstname: string;
    lastname: string;
    username: string;
    password:string;
    email:string;
}

export type UserList = User[]

export interface AuthenticationInformation {
    token: string;
    expirationDate: number;
}

export interface AuthenticationResponse {
    authentication: AuthenticationInformation | null;
    user: User | null;
}

export interface LoginData {
    username: string,
    password: string
}