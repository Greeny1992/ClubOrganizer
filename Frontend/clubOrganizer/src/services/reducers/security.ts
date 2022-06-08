import {AnyAction} from "redux";
import {loggedIn, loggedOut} from "../actions/security";
import { createReducer} from "typesafe-actions";
import {AuthenticationResponse} from "../../types/types";
import {clearUserData} from "../rest/security";

const initialState : AuthenticationResponse = {
        user: { firstname:"", lastname:"", userName: "", email: "", password : "", role:"", active:false, groups: []},
        authenticationInformation: { token: "", expirationDate: 0}
}


export const user = createReducer<AuthenticationResponse, AnyAction>(initialState)
    .handleAction(loggedIn, (state, action) => {
        return action.payload
    })
    .handleAction(loggedOut, (state, action) => {
            clearUserData();
            return ({ user: null, authenticationInformation: null })
        }
    )