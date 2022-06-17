import { Club, Clubs, Group, Event } from "../../types/types";
import config from "./server-config";
import axios from "axios";
import { Storage } from "@capacitor/storage";
import { resolve } from "dns";
import { ActiveClub } from "../reducers/club";
import store from "../store";
import { activeC } from "../actions/club";

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

export const fetchClub = (token: string | null, id: string) =>
  endpoint
    .get<Club | ErrorMessage>(
      `${config.getClubControllerURI}GetClub?clubId=${id}`,
      { headers: createAuthenticationHeader(token) }
    )
    // Use this to simulate network latency
    //.then(r => executeDelayed(3000, () => r))
    .then((r) => {
      if (r.status >= 300) {
        const { message } = r.data as ErrorMessage;
        throw new Error(message || r.statusText);
      }
      var returnval = r.data as Club;
      console.log(returnval);
      return returnval;
    });

export const fetchOwnedClub = (token: string | null) =>
  endpoint
    .get<Club | ErrorMessage>(`${config.getUserURI}GetOwnedClub`, {
      headers: createAuthenticationHeader(token),
    })
    // Use this to simulate network latency
    //.then(r => executeDelayed(3000, () => r))
    .then((r) => {
      if (r.status >= 300) {
        const { message } = r.data as ErrorMessage;
        throw new Error(message || r.statusText);
      }
      var returnval = r.data as Club;
      console.log(returnval);
      return returnval;
    });

export const fetchClubs = (token: string | null) =>
  endpoint
    .get<Clubs | ErrorMessage>(`${config.getUserURI}GetClubsFromUser`, {
      headers: createAuthenticationHeader(token),
    })
    // Use this to simulate network latency
    //.then(r => executeDelayed(3000, () => r))
    .then((r) => {
      if (r.status >= 300) {
        const { message } = r.data as ErrorMessage;
        throw new Error(message || r.statusText);
      }
      var returnval = r.data as Clubs;
      console.log(returnval);
      return returnval;
    });

export const addMemberToClub = (token: string | null, clubId: string, userId: string) => 
  endpoint.post<Club | ErrorMessage>(`${config.getClubControllerURI}AddMemberToClub?clubId=${clubId}&userId=${userId}`, {
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

  export const addGroupToClub = (token:string | null, clubId: string, group:Group) => 
  endpoint.post<Club | ErrorMessage> (`${config.getClubControllerURI}CreateGroupForClub?clubId=${clubId}`, group,{
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

  export const addEventToClub = (token:string | null, clubId: string, event:Event) => 
  endpoint.post<Club | ErrorMessage> (`${config.getClubControllerURI}CreateEventForClub?clubId=${clubId}`, event,{
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


export const setActiveClub = (id: string) => {
  Storage.set({ key: "activeClub", value: id });
  store.dispatch(activeC({ activeClubID: id }));
};

const _getActiveClub = () =>
  Promise.resolve(Storage.get({ key: "activeClub" }));

export const getActiveClub = () => {
  _getActiveClub().then((x) => {
    return x.value ? store.dispatch(activeC({ activeClubID: x.value })) : false;
  });
};


