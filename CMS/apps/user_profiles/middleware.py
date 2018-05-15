from django.conf import settings
from django.middleware.csrf import CsrfViewMiddleware
from django.utils.cache import patch_vary_headers

class CustomCsrfViewMiddleware(CsrfViewMiddleware):

    """
    Overriding default csrf mechanism to put the csrf token in header as well.
    """
    def process_response(self, request, response):
        if getattr(response, 'csrf_processing_done', False):
            return response

        if not request.META.get("CSRF_COOKIE_USED", False):
            return response

        # Set the CSRF cookie even if it's already set, so we renew
        # the expiry timer.
        response.set_cookie(settings.CSRF_COOKIE_NAME,
                            request.META["CSRF_COOKIE"],
                            max_age=settings.CSRF_COOKIE_AGE,
                            domain=settings.CSRF_COOKIE_DOMAIN,
                            path=settings.CSRF_COOKIE_PATH,
                            secure=settings.CSRF_COOKIE_SECURE,
                            httponly=settings.CSRF_COOKIE_HTTPONLY
                            )
        # Setting the CSRF token header
        response[settings.CSRF_COOKIE_NAME] = request.META["CSRF_COOKIE"]
        # Content varies with the CSRF cookie, so set the Vary header.
        patch_vary_headers(response, ('Cookie',))
        response.csrf_processing_done = True
        return response
