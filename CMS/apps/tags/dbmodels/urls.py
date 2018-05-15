from django.conf.urls import url
from dbmodels import views

urlpatterns = [
    url(r'^addresses/$', views.address_list),
    url(r'^address/(?P<pk>[0-9]+)/$', views.address_detail),
         url(r'^users/$', views.user_list),
     url(r'^users/(?P<pk>[0-9]+)/$', views.user_detail),
          url(r'^centers/$', views.center_list),
     url(r'^centers/(?P<pk>[0-9]+)/$', views.center_detail),
]