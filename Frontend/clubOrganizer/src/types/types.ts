export interface User {
    id?: string;
    firstname: string;
    lastname: string;
    userName: string;
    groups: string[];
    ownedClub: string;
    myClubs: string[];
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

export interface Group{
    name:string;
    description:string;
    id?:string
}

export interface Event{
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    active: boolean;
    acceptUsers: User[];
    cancelUsers: User[];
    id:string;
}

export interface Club {
    name:string;
    ownerID: string,
    adminIDs: string[]
    memberIDs: string[],
    groups: Group[],
    id:string
}

export type Clubs = Club[];