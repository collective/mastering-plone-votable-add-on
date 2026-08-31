export const GET_VOTES = 'GET_VOTES';
export const VOTE = 'VOTE';
export const CLEAR_VOTES = 'CLEAR_VOTES';

export function getVotes(url) {
  return {
    type: GET_VOTES,
    request: {
      op: 'get',
      path: `${url}/@votes`,
    },
  };
}

export function vote(url, vote) {
  if ([-1, 0, 1].includes(vote)) {
    return {
      type: VOTE,
      request: {
        op: 'post',
        path: `${url}/@votes`,
        data: { rating: vote },
      },
    };
  }
}

export function clearVotes(url) {
  return {
    type: CLEAR_VOTES,
    request: {
      op: 'del',
      path: `${url}/@votes`,
    },
  };
}
