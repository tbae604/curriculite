import json
from django.contrib import messages
from django.core.urlresolvers import reverse
from django.http import JsonResponse
from django.shortcuts import render, render_to_response, HttpResponse, HttpResponseRedirect, redirect
# from django.template.context_processors import csrf
# from django.views.decorators.csrf import csrf_protect
from editor.models import Session


def index(request):
    """ Loads the editor view """
    context = {}
    return render(request, 'editor/index.html', context)


# JQuery/AJAX helpers

def _get_sessions(request):
    """
    Massages and sends all Session data to client
    Adapted from https://bixly.com/blog/json-jquery-and-django/
    """
    sessions = []
    for res in Session.objects.filter():
        sessions.append({
            'id': res.id,
            'name': res.name,
            'xpos': res.xpos,
            'ypos': res.ypos,
        })
    response_data = json.dumps(sessions)
    # messages.add_message(request, messages.INFO, response_data)
    return HttpResponse(response_data)


def _add_session(request):
    """
    Accepts new Session from client, posts to db, and returns next view url
    """
    name = json.loads(request.body)['name']
    new = Session(name=name, xpos=0, ypos=0)
    new.save()
    messages.add_message(request, messages.INFO, 'New session added.')
    return JsonResponse({'url': reverse('editor:index')})


# @csrf_protect
def _post_sessions(request):
    """
    Accepts Session updates from client, posts to db, and returns next view url
    """
    # if request.method =="POST":
    #     messages.add_message(request, messages.INFO, 'this came from POST')

    # If csrf token is required for JQuery --> Django
    # c = {}
    # c.update(csrf(request))
    # # return render_to_response('abc', c)

    updates = json.loads(request.body)['updates']
    for update in updates:
        data = {
            'name': update['name'],
            'xpos': update['xpos'],
            'ypos': update['ypos']
        }
        s = Session.objects.filter(pk=update['id']).update(**data)
    messages.add_message(request, messages.INFO, 'Changes saved.')
    return JsonResponse({'url': reverse('editor:index')})


def _delete_session(request):
    """
    Deletes Session from client, deletes from db, and returns next view url
    """
    id = json.loads(request.body)['id']
    Session.objects.filter(pk=id).delete()
    messages.add_message(request, messages.INFO, 'Session deleted.')
    return JsonResponse({'url': reverse('editor:index')})
