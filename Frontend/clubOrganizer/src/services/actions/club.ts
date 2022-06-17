import {AuthenticationInformation, AuthenticationResponse,Club,Group,User, UserList} from "../../types/types";
import {createAction, createAsyncAction} from 'typesafe-actions';
import {ThunkAction} from "redux-thunk";
import {RootState} from "../reducers";
import {AnyAction} from "redux";
import {fetchUser, fetchUsers} from "../rest/users";
import { addGroupToClub, fetchClub, fetchClubs, fetchOwnedClub, getActiveClub } from "../rest/club";
import { ActiveClub } from "../reducers/club";
import { group } from "console";


export const fetchClubsActions = createAsyncAction(
    'FETCH_CLUBS_REQUEST',
    'FETCH_CLUBS_SUCCESS',
    'FETCH_CLUBS_FAILURE')<void, Club[], Error>();

export const fetchOwnedActions = createAsyncAction(
    'FETCH_OWNED_REQUEST',
    'FETCH_OWNED_SUCCESS',
    'FETCH_OWNED_FAILURE')<void, Club, Error>();

export const fetchAddGroupActions = createAsyncAction(
    'FETCH_ADDGROUP_REQUEST',
    'FETCH_ADDGROUP_SUCCESS',
    'FETCH_ADDGROUP_FAILURE')<void, Club, Error>();

export const activeC = createAction('club/active')<ActiveClub>();

export type OwnedResult = ReturnType<typeof fetchOwnedActions.success> | ReturnType<typeof fetchOwnedActions.failure>;
export type ClubsResult = ReturnType<typeof fetchClubsActions.success> | ReturnType<typeof fetchClubsActions.failure>;
export type AddGroupResult = ReturnType<typeof fetchAddGroupActions.success> | ReturnType<typeof fetchAddGroupActions.failure>;

export const fetchClubsAction = ():ThunkAction<Promise<ClubsResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(fetchClubsActions.request());
        return fetchClubs(getState().user.authenticationInformation!.token || '')
            .then(
                Value =>dispatch(fetchClubsActions.success(Value))
            )
            .catch(
                err => dispatch(fetchClubsActions.failure(err))
            )
    };



export const fetchOwnedAction = ():ThunkAction<Promise<OwnedResult>, RootState, null, AnyAction> =>
    (dispatch, getState) => {
        dispatch(fetchOwnedActions.request());
        return fetchOwnedClub(getState().user.authenticationInformation!.token || '')
            .then(
                Value =>dispatch(fetchOwnedActions.success(Value))
            )
            .catch(
                err => dispatch(fetchOwnedActions.failure(err))
            )
    };

export const fetchAddGroupAction = (clubID:string, group:Group):ThunkAction<Promise<AddGroupResult>, RootState, null, AnyAction> =>
(dispatch, getState) => {
    dispatch(fetchAddGroupActions.request());
    return addGroupToClub(getState().user.authenticationInformation!.token || '', clubID, group)
        .then(
            Value =>dispatch(fetchAddGroupActions.success(Value))
        )
        .catch(
            err => dispatch(fetchAddGroupActions.failure(err))
        )
};