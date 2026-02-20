from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Permission check: user must be authenticated and have role=admin."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "admin"
        )


class IsMember(permissions.BasePermission):
    """Permission check: user must be authenticated and have role=member."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "member"
        )


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission check:
    - Admin: full access (GET, POST, PUT, DELETE)
    - Others: read-only (GET, OPTIONS, HEAD)
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "admin"
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission check:
    - Admin: full access
    - Owner (user matches object.user): full access
    - Others: no access
    """

    def has_object_permission(self, request, view, obj):
        if request.user and request.user.is_authenticated:
            if request.user.role == "admin":
                return True
            # Check if obj has a 'user' attribute
            if hasattr(obj, "user"):
                return obj.user == request.user
        return False
