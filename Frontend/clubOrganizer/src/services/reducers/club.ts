import { Interface } from "readline";
import {AnyAction} from "redux";
import { createReducer} from "typesafe-actions";
import { Club, Clubs} from "../../types/types";
import { activeC, fetchClubsActions, fetchOwnedActions } from "../actions/club";

const initialState = {
    activeClubID: ""
};
const init : OwnedClubState =
{
    isLoading : false,
    errorMessage :"",
    owned: null,
    myclubs: []
}

export interface ActiveClub{
    activeClubID:string
}
export interface OwnedClubState {
    isLoading: boolean;
    errorMessage: string;
    owned : Club | null;
    myclubs : Clubs | null;
}

export const clubs = createReducer<OwnedClubState, AnyAction>(init)
.handleAction(fetchClubsActions.request,  (state, action) =>
    ({ ...state, isLoading: true, errorMessage: '' }))
.handleAction(fetchClubsActions.failure, (state, action) =>
    ({ ...state, isLoading: false, errorMessage: action.payload.message }))
.handleAction(fetchClubsActions.success, (state, action) =>
    ({ ...state, isLoading: false, myclubs : action.payload }))
.handleAction(fetchOwnedActions.request,  (state, action) =>
    ({ ...state, isLoading: true,  errorMessage: '' }))
.handleAction(fetchOwnedActions.failure, (state, action) =>
    ({ ...state, isLoading: false,  errorMessage: action.payload.message }))
.handleAction(fetchOwnedActions.success, (state, action) =>
    ({ ...state, isLoading: false,  owned: action.payload}))

    export const activeCl = createReducer<ActiveClub, AnyAction>(initialState)
    .handleAction(activeC, (state, action) => {
        return action.payload
    })