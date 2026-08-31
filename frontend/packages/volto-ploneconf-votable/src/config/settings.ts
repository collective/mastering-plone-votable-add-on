import type { ConfigType } from '@plone/registry';
import type { Content } from '@plone/types';
import votes from 'volto-ploneconf-votable/reducers/votes/votes';
import Voting from 'volto-ploneconf-votable/components/Voting/Voting';

function FieldCondition(field: string) {
  return ({ content }: { content: Content }) => {
    return Boolean(content?.[field]);
  };
}

export default function install(config: ConfigType) {
  config.addonReducers = {
    ...config.addonReducers,
    votes,
  };

  config.registerSlotComponent({
    slot: 'aboveContent',
    name: 'voting',
    component: Voting,
    predicates: [FieldCondition('voting_enabled')],
  });

  return config;
}
