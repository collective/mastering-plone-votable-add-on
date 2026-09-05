from plone import api
from plone.protect.interfaces import IDisableCSRFProtection
from plone.restapi.deserializer import json_body
from plone.restapi.services import Service
from ploneconf.votable.behaviors.votable import IVotable
from zExceptions import Unauthorized
from zope.interface import alsoProvides


class VotingGet(Service):
    """Get voting information about the current object"""

    def reply(self):
        if not api.user.has_permission(
            "ploneconf.votable: View votes", obj=self.context
        ):
            raise Unauthorized("User not authorized to view votes.")
        return vote_info(self.context)


class VotingPost(Service):
    """Vote for an object"""

    def reply(self):
        alsoProvides(self.request, IDisableCSRFProtection)
        voting = IVotable(self.context)
        if not api.user.has_permission("ploneconf.votable: Can vote", obj=self.context):
            raise Unauthorized("User not authorized to vote.")
        data = json_body(self.request)
        vote = data["rating"]
        voting.vote(vote)

        return vote_info(self.context)


class VotingDelete(Service):
    """Clear votes for an object"""

    def reply(self):
        alsoProvides(self.request, IDisableCSRFProtection)
        if not api.user.has_permission(
            "ploneconf.votable: Clear votes", obj=self.context
        ):
            raise Unauthorized("User not authorized to clear votes.")
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
        "can_vote": api.user.has_permission("ploneconf.votable: Can vote", obj=obj),
        "can_clear_votes": api.user.has_permission(
            "ploneconf.votable: Clear votes", obj=obj
        ),
    }
    return info
