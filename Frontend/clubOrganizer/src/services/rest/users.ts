import {
    User,
    UserList
} from '../../types/types';
import config from './server-config';
import axios from 'axios';

const endpoint = axios.create({
    baseURL: config.host,
    responseType: 'json'
});


interface ErrorMessage {
    message: string;
}

const timeout = 5000;

export const createAuthenticationHeader = (token: string | null) => ({'Authorization': `Bearer ${token}`})

export const fetchUser = (token: string | null, name : string) =>
endpoint.get<User | ErrorMessage>(`${config.getUserURI}GetUser?id=${name}`, { headers: createAuthenticationHeader(token) })
    // Use this to simulate network latency
    //.then(r => executeDelayed(3000, () => r))
    .then(r => {
        if (r.status >= 300) {
            const { message } = r.data as ErrorMessage;
            throw new Error(message || r.statusText);
        }
        var returnval = r.data as User;
        console.log(returnval);
        return returnval;
    })

export const fetchUsers = (token: string | null) =>
endpoint.get<UserList | ErrorMessage>(`${config.getUserURI}ListUsers`, { headers: createAuthenticationHeader(token) })
    // Use this to simulate network latency
    //.then(r => executeDelayed(3000, () => r))
    .then(r => {
        if (r.status >= 300) {
            const { message } = r.data as ErrorMessage;
            throw new Error(message || r.statusText);
        }
        var returnval = r.data as UserList;
        console.log(returnval);
        return returnval;
    })

    export const register = (user:User, token: string | null) =>
    endpoint.post<User, User>('/User/CreateUser', user, {headers: createAuthenticationHeader(token)})