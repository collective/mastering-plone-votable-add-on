import {
  GET_VOTES,
  VOTE,
  CLEAR_VOTES,
} from 'volto-ploneconf-votable/actions/votes/votes';

const initialState = {
  loaded: false,
  loading: false,
  error: null,
};

export default function votes(state = initialState, action = {}) {
  switch (action.type) {
    case `${GET_VOTES}_PENDING`:
    case `${VOTE}_PENDING`:
    case `${CLEAR_VOTES}_PENDING`:
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
      };
    case `${GET_VOTES}_SUCCESS`:
    case `${VOTE}_SUCCESS`:
    case `${CLEAR_VOTES}_SUCCESS`:
      return {
        ...state,
        ...action.result,
        error: null,
        loaded: true,
        loading: false,
      };
    case `${GET_VOTES}_FAIL`:
    case `${VOTE}_FAIL`:
    case `${CLEAR_VOTES}_FAIL`:
      return {
        ...state,
        error: action.error,
        loaded: false,
        loading: false,
      };
    default:
      return state;
  }
}
