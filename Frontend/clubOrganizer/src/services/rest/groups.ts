import { Group } from "../../types/types";
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

export const patchGroup = (token:string | null, groupID: string, event:Group) => 
  endpoint.patch<Group | ErrorMessage> (`${config.getGroupControllerURI}PatchGroup?id=${groupID}`, event,{
    headers: createAuthenticationHeader(token)
  }).then((r) => {
    if (r.status >= 300) {
      const { message } = r.data as ErrorMessage;
      throw new Error(message || r.statusText);
    }
    var returnval = r.data as Group;
    console.log(returnval);
    return returnval;
  });

  export const deleteGroup = (token:string | null, groupID: string) => 
  endpoint.delete<Group | ErrorMessage> (`${config.getGroupControllerURI}DeleteGroup?id=${groupID}`,{
    headers: createAuthenticationHeader(token)
  }).then((r) => {
    if (r.status >= 300) {
      const { message } = r.data as ErrorMessage;
      throw new Error(message || r.statusText);
    }
    var returnval = r.data
    return returnval;
  });


