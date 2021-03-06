import { User, UserList } from "../../types/types";
import config from "./server-config";
import axios from "axios";

const endpoint = axios.create({
  baseURL: config.host,
  responseType: "json",
});

interface ErrorMessage {
  message: string;
}

const timeout = 5000;

export const createAuthenticationHeader = (token: string | null) => ({
  Authorization: `Bearer ${token}`,
});

export const fetchUser = (token: string | null, id: string) =>
  endpoint
    .get<User | ErrorMessage>(`${config.getUserURI}GetUser?id=${id}`, {
      headers: createAuthenticationHeader(token),
    })
    .then((r) => {
      if (r.status >= 300) {
        const { message } = r.data as ErrorMessage;
        throw new Error(message || r.statusText);
      }
      var returnval = r.data as User;
      return returnval;
    });

    export const patchUser = (token: string | null, name: string, user:User) =>
    endpoint
      .patch<User | ErrorMessage>(`${config.getUserURI}PatchUser?id=${name}`, user, {
        headers: createAuthenticationHeader(token),
      })
      .then((r) => {
        if (r.status >= 300) {
          const { message } = r.data as ErrorMessage;
          throw new Error(message || r.statusText);
        }
        var returnval = r.data as User;
        return returnval;
      });

export const fetchUserByEmail = (token: string | null, email: string) =>
    endpoint
      .get<User | ErrorMessage>(`${config.getUserURI}GetUserByEmail?email=${email}`, {
        headers: createAuthenticationHeader(token),
      })
      .then((r) => {
        if (r.status >= 300) {
          const { message } = r.data as ErrorMessage;
          throw new Error(message || r.statusText);
        }
        var returnval = r.data as User;
        return returnval;
      });

export const fetchUsers = (token: string | null) =>
  endpoint
    .get<UserList | ErrorMessage>(`${config.getUserURI}ListUsers`, {
      headers: createAuthenticationHeader(token),
    })
    .then((r) => {
      if (r.status >= 300) {
        const { message } = r.data as ErrorMessage;
        throw new Error(message || r.statusText);
      }
      var returnval = r.data as UserList;
      return returnval;
    });

export const register = (user: User) =>
  endpoint.post<User, User>("/User/CreateUser", user);

export const fetchMembersFromClub = (token: string | null, clubId: string) => 
endpoint.get<UserList | ErrorMessage>(`${config.getUserURI}ListMemberFromClub?clubId=${clubId}`, {
    headers: createAuthenticationHeader(token),
  })
  .then((r) => {
    if (r.status >= 300) {
      const { message } = r.data as ErrorMessage;
      throw new Error(message || r.statusText);
    }
    var returnval = r.data as UserList;
    return returnval;
  });

  export const addOrUpdateGroupToMember = (token: string | null, userId: string, groupIds: string[]) => 
  endpoint.post<User | ErrorMessage>(`${config.getUserURI}AddOrUpdateGroupsToUser?userId=${userId}`, {groupIds}, {
    headers: createAuthenticationHeader(token),
  })
  .then((r) => {
    if (r.status >= 300) {
      const { message } = r.data as ErrorMessage;
      throw new Error(message || r.statusText);
    }
    var returnval = r.data as User;
    return returnval;
  });
