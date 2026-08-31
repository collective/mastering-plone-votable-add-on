import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  getVotes,
  vote,
  clearVotes,
} from 'volto-ploneconf-votable/actions/votes/votes';
import config from '@plone/volto/registry';
import { Container as SemanticContainer } from 'semantic-ui-react';

const Voting = () => {
  const votes = useSelector((state) => state.votes);
  const dispatch = useDispatch();
  let location = useLocation();
  const content = useSelector((state) => state.content.data);
  const [stateClearVotes, setStateClearVotes] = useState(0);

  React.useEffect(() => {
    dispatch(getVotes(location.pathname));
  }, [dispatch, location]);

  const Container =
    config.getComponent({ name: 'Container' }).component || SemanticContainer;

  const handleVoteClick = (value) => {
    dispatch(vote(location.pathname, value));
  };

  const handleClearVotes = () => {
    if (stateClearVotes === 1) {
      dispatch(clearVotes(location.pathname));
    }
    // increment count up to 2
    let counter = stateClearVotes < 2 ? stateClearVotes + 1 : 2;
    setStateClearVotes(counter);
  };

  return votes?.loaded && votes?.can_vote ? ( // is store content available? (votable behavior is optional)
    <Container>
      <div className="ui segment voting">
        <div className="ui dividing header">
          Conference Talk and Training Selection
        </div>
        <div className="ui list">
          <div className="ui medium labels">
            {votes?.has_votes ? (
              <div className="ui olive ribbon label">
                Average vote for this{' '}
                {content.type_of_talk?.title.toLowerCase()}:{' '}
                {votes?.average_vote}
                <div className="detail">
                  ( Votes Cast {votes?.total_votes} )
                </div>
              </div>
            ) : (
              <div className="ui yellow ribbon label">
                There are no votes so far for this{' '}
                {content.type_of_talk?.title.toLowerCase()}.
              </div>
            )}
          </div>
          <div className="ui horizontal section divider">Vote</div>
          {votes?.already_voted ? (
            <div className="item">
              <div className="content">
                <div className="header">
                  You voted for this {content.type_of_talk?.title}.
                </div>
                <div className="description">
                  Please review more interesting talks and vote.
                </div>
              </div>
            </div>
          ) : (
            <div className="item">
              <div className="three ui buttons">
                <button
                  type="button"
                  className="ui green button"
                  onClick={() => handleVoteClick(1)}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="ui blue button"
                  onClick={() => handleVoteClick(0)}
                >
                  Do not know what to expect
                </button>
                <button
                  type="button"
                  className="ui red button"
                  onClick={() => handleVoteClick(-1)}
                >
                  Decline
                </button>
              </div>
            </div>
          )}
          {votes?.can_clear_votes && votes?.has_votes ? (
            <>
              <div className="ui red horizontal section divider">
                Danger Zone
              </div>
              <div className="item">
                <button className="ui red button" onClick={handleClearVotes}>
                  {
                    [
                      'Clear votes for this item',
                      'Are you sure to clear votes for this item?',
                      'Votes for this item are reset.',
                    ][stateClearVotes]
                  }
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
      <br />
    </Container>
  ) : null;
};
export default Voting;
