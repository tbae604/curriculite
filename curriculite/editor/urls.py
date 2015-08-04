from django.conf.urls import patterns, url
from django.core.urlresolvers import reverse_lazy
from django.views.generic import RedirectView


from editor import views

urlpatterns = patterns('',
    # /editor/
    url(r'^$', views.index, name='index'),
    # AJAX/JQuery helpers
    # /editor/ajax/_get_sessions
    url(r'^ajax/_get_sessions$', views._get_sessions, name='_get_sessions'),
    # /editor/ajax/_post_sessions
    url(r'^ajax/_post_sessions$', views._post_sessions, name='_post_sessions'),
    # /editor/ajax/_delete_session
    url(r'^ajax/_delete_session$', views._delete_session, name='_delete_session')
)
