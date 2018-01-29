from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.owner == request.user


class SafeMethodsOnlyPermission(permissions.BasePermission):
    """Only can access non-destructive methods (like GET and HEAD)"""

    def has_permission(self, request, view):
        return self.has_object_permission(request, view)

    def has_object_permission(self, request, view, obj=None):
        return request.method in permissions.SAFE_METHODS


class IdeaAuthorCanEditPermission(SafeMethodsOnlyPermission):
    """Allow everyone to list or view, but only the other can modify existing instances"""
    def has_object_permission(self, request, view, obj=None):
        if obj is None:
            # Either a list or a create, so no author
            can_edit = True
        else:
            can_edit = request.user == obj.author
        return can_edit or super(IdeaAuthorCanEditPermission, self).has_object_permission(request, view, obj)