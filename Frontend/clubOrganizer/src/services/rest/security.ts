import {LoginData, User, AuthenticationInformation, AuthenticationResponse} from '../../types/types';
import config from './server-config';
import axios from 'axios';
import { Storage } from '@capacitor/storage';

const endpoint = axios.create({
    baseURL: config.host,
    responseType: 'json'
});

const timeout = 5000;


export const login = (loginData: LoginData) =>
    endpoint.post<AuthenticationResponse>('User/Login', loginData, {timeout})
        .then(
            ({data: {authenticationInformation, user}}) => {
                console.log(authenticationInformation);
                
                return Promise.all([
                    user,
                    authenticationInformation,
                    Storage.set({key: 'user', value: JSON.stringify(( user && typeof user === 'object') ? user : {})}),
                    Storage.set({key: 'authentication', value: JSON.stringify(( authenticationInformation && typeof authenticationInformation === 'object') ? authenticationInformation : {})}),
                ])}
        ).then(([user, authenticationInformation, ...others]) => ({user, authenticationInformation}) )


export const isNotExpired = (token: AuthenticationInformation | null | undefined) => {
    if (!token || token.token == "")
    {
        return false;
    }
    const dec = token.expirationDate;
    const future =new Date(dec*1000);
    const now = new Date();
    if(future > now)
    {
        return true;
    }
    else
    {
        console.log("Token is null or expired");
        return false;
    }

}

export const loadUserData = () => Promise.all([Storage.get({key: 'user'}),Storage.get({key: 'authentication'})])
    .then(([user, authentication]) => ({ user: user.value ? JSON.parse(user.value): null , authentication: authentication.value ? JSON.parse(authentication.value): null }))

export const clearUserData = () => Promise.all([Storage.remove({key: 'user'}), Storage.remove({key: 'authentication'})])

export const getUserInfo = () => Promise.all([Storage.get({key: 'user'}),Storage.get({key: 'authentication'})])
    .then(([user, authentication]) => {
        if (user.value && authentication.value)
            return {user: JSON.parse(user.value), authentication:  JSON.parse(authentication.value)}
        else throw new Error('Not logged in!')
    })

export const createAuthenticationHeader = (token: string | null) => ({'Authorization': `Bearer ${token}`})