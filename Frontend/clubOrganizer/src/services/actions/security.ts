import {AuthenticationInformation, AuthenticationResponse, User} from "../../types/types";
import { createAction } from 'typesafe-actions';

export const loggedIn = createAction('user/loggedIn')<AuthenticationResponse>();
export const loggedOut = createAction('user/loggedOut')<void>();