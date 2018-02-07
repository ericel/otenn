import * as AuthActions from './auth.actions';

export interface State {
  token: string;
  authenticated: boolean;
}

const initialState: State = {
  token: null,
  authenticated: false
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case (AuthActions.SIGNUP):
    case (AuthActions.SIGNIN):
      return {
        ...state,
        authenticated: true
      };
    case (AuthActions.LOGOUT):
      return {
        ...state,
        token: null,
        authenticated: false
      };
    case (AuthActions.SET_TOKEN):
      return {
        ...state,
        token: action.payload
      };
    default:
      return state;
  }
}




/*import * as userActions from './auth.actions';
import { User } from './auth.model';
export type Action = userActions.All;
const defaultUser = new User(null, 'GUEST');
/// Reducer function
export function authReducer(state: User = defaultUser, action: Action) {
  switch (action.type) {
    case userActions.GET_USER:
        return { ...state, loading: true };

    case userActions.AUTHENTICATED:
        return { ...state, ...action.payload, loading: false };
    case userActions.NOT_AUTHENTICATED:
        return { ...state, ...defaultUser, loading: false };
    case userActions.GOOGLE_LOGIN:
      return { ...state, loading: true };
    case userActions.AUTH_ERROR:
      return { ...state, ...action.payload, loading: false };
    case userActions.LOGOUT:
      return { ...state, loading: true };
  }
}*/
