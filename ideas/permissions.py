from rest_framework import permissions


class IsCreaterOfIdea(permissions.BasePermission):
    def has_object_permission(self, request, view, idea):
        if request.user:
            return idea.user == request.user
        return False