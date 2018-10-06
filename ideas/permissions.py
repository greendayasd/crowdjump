from rest_framework import permissions


class IsCreaterOfIdea(permissions.BasePermission):
    def has_object_permission(self, request, view, idea):
        if request.user:
            return idea.user == request.user
        return False


class IsCreaterOfBugreport(permissions.BasePermission):
    def has_object_permission(self, request, view, bugreport):
        if request.user:
            return bugreport.user == request.user
        return False


class IsOwnerOfInfo(permissions.BasePermission):
    def has_object_permission(self, request, view, gameinfo):
        if request.user:
            return gameinfo.user == request.user
        return False