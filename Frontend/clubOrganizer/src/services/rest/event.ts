import { Club, Event } from "../../types/types";
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

export const patchEvent = (token:string | null, eventID: string, event:Event) => 
  endpoint.patch<Event | ErrorMessage> (`${config.getEventControllerURI}PatchEvent?id=${eventID}`, event,{
    headers: createAuthenticationHeader(token)
  }).then((r) => {
    if (r.status >= 300) {
      const { message } = r.data as ErrorMessage;
      throw new Error(message || r.statusText);
    }
    var returnval = r.data as Event;
    console.log(returnval);
    return returnval;
  });

  export const deleteEvent = (token:string | null, eventID: string) => 
  endpoint.delete<Event | ErrorMessage> (`${config.getEventControllerURI}DeleteEvent?id=${eventID}`,{
    headers: createAuthenticationHeader(token)
  }).then((r) => {
    if (r.status >= 300) {
      const { message } = r.data as ErrorMessage;
      throw new Error(message || r.statusText);
    }
    var returnval = r.data
    return returnval;
  });

  export const acceptEvent = (token: string |null, eventId: string, clubId: string, userId: string ) => 
  endpoint.post<Club | ErrorMessage> (`${config.getEventControllerURI}UserAcceptEvent?eventId=${eventId}&clubId=${clubId}&userId=${userId}&`, {},{
    headers: createAuthenticationHeader(token)
  }).then((r) => {
    if (r.status >= 300) {
      const { message } = r.data as ErrorMessage;
      throw new Error(message || r.statusText);
    }
    var returnval = r.data as Club;
    console.log(returnval);
    return returnval;
  });

  export const cancleEvent = (token: string |null, eventId: string, clubId: string, userId: string ) => 
  endpoint.post<Club | ErrorMessage> (`${config.getEventControllerURI}UserCancleEvent?eventId=${eventId}&clubId=${clubId}&userId=${userId}&`, {},{
    headers: createAuthenticationHeader(token)
  }).then((r) => {
    if (r.status >= 300) {
      const { message } = r.data as ErrorMessage;
      throw new Error(message || r.statusText);
    }
    var returnval = r.data as Club;
    console.log(returnval);
    return returnval;
  });


