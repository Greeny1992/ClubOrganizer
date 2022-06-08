export interface User {
    id?: string;
    firstname: string;
    lastname: string;
    userName: string;
    groups: string[]
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
    authenticationInformation: AuthenticationInformation | null;
    user: User | null;
}

export interface LoginData {
    username: string,
    password: string
}