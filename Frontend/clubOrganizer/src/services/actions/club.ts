import {AuthenticationInformation, AuthenticationResponse,Club,User, UserList} from "../../types/types";
import {createAction, createAsyncAction} from 'typesafe-actions';
import {ThunkAction} from "redux-thunk";
import {RootState} from "../reducers";
import {AnyAction} from "redux";
import {fetchUser, fetchUsers} from "../rest/users";
import { fetchClub, fetchClubs, fetchOwnedClub, getActiveClub } from "../rest/club";
import { ActiveClub } from "../reducers/club";


export const fetchClubsActions = createAsyncAction(
    'FETCH_CLUBS_REQUEST',
    'FETCH_CLUBS_SUCCESS',
    'FETCH_CLUBS_FAILURE')<void, Club[], Error>();

export const fetchOwnedActions = createAsyncAction(
    'FETCH_OWNED_REQUEST',
    'FETCH_OWNED_SUCCESS',
    'FETCH_OWNED_FAILURE')<void, Club, Error>();

export const activeC = createAction('club/active')<ActiveClub>();

export type OwnedResult = ReturnType<typeof fetchOwnedActions.success> | ReturnType<typeof fetchOwnedActions.failure>;
export type ClubsResult = ReturnType<typeof fetchClubsActions.success> | ReturnType<typeof fetchClubsActions.failure>;

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
