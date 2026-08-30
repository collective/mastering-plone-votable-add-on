from plone.protect.interfaces import IDisableCSRFProtection
from plone.restapi.deserializer import json_body
from plone.restapi.services import Service
from ploneconf.votable.behaviors.votable import IVotable
from zope.interface import alsoProvides


class VotingGet(Service):
    """Get voting information about the current object"""

    def reply(self):
        return vote_info(self.context)


class VotingPost(Service):
    """Vote for an object"""

    def reply(self):
        alsoProvides(self.request, IDisableCSRFProtection)
        voting = IVotable(self.context)
        data = json_body(self.request)
        vote = data["rating"]
        voting.vote(vote)

        return vote_info(self.context)


class VotingDelete(Service):
    """Clear votes for an object"""

    def reply(self):
        alsoProvides(self.request, IDisableCSRFProtection)
        voting = IVotable(self.context)
        voting.clear()
        return vote_info(self.context)


def vote_info(obj):
    """Returns voting information about the given object."""
    voting = IVotable(obj)
    info = {
        "average_vote": voting.average_vote(),
        "total_votes": voting.total_votes(),
        "has_votes": voting.has_votes(),
        "already_voted": voting.already_voted(),
        "can_vote": True,
        "can_clear_votes": True,
    }
    return info
