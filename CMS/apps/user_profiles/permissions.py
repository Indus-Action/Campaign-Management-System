from rest_framework import permissions

class HelplineOrReadOnlyPermission(permissions.BasePermission):
    """
    Permissions class for helpline user type...
    """
    def has_permission(self, request, view):
        if request.user.is_authenticated():
            if request.method in permissions.SAFE_METHODS:
                return True
            return request.user.profile.user_type == 'HL'
        return False

class VolunteerOrReadOnlyPermission(permissions.BasePermission):
    """
    Permissions class for volunteer user type...
    """
    def has_permission(self, request, view):
        if request.user.is_authenticated():
            if request.method in permissions.SAFE_METHODS:
                return True
            return request.user.profile.user_type == 'VL'
        return False

class AdminOrReadOnlyPermission(permissions.BasePermission):
    """
    Permissions class for admin user type...
    """
    def has_permission(self, request, view):
        if request.user.is_authenticated():
            if request.method in permissions.SAFE_METHODS:
                return True
            return request.user.profile.user_type == 'AD'
        return False

class BeneficiaryOrReadOnlyPermission(permissions.BasePermission):
    """
    Permission class for beneficiary user type...
    """
    def has_permission(self, request, view):
        if request.user.is_authenticated():
            if request.method in permissions.SAFE_METHODS:
                return True
            return request.user.profile.user_type == 'BN'
        return False

class AnyUserReadOnlyPermission(permissions.BasePermission):
    """
    Read only permission class for any user...
    """
    def has_permission(self, request, view):
        if request.user.is_authenticated():
            if request.method in permissions.SAFE_METHODS:
                return True
        return False

class AnyUserReadWritePermission(permissions.BasePermission):
    """
    Read-write permission class for any user...
    """
    def has_permission(self, request, view):
        if request.user.is_authenticated():
            return True
        return False

class ReadOnlyAnonPermission(permissions.BasePermission):
    """
    Read only (GET, HEAD, OPTIONS) permission for anon users if needed...
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return False
