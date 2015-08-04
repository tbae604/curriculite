/*
Cross-Site Request Forgery (CSRF) protection in app
From Django docs - https://docs.djangoproject.com/en/dev/ref/csrf/
*/


// CSRF token
var csrftoken = getCookie('csrftoken');


/*
 * Check method does not require csrf protection (internal)
*/
function csrfSafeMethod(method) {
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}


/*
 * Set header on AJAX request, protect token
 * Alt: use jquery cookie plugin
*/
$.ajaxSetup({
  beforeSend: function(xhr, settings) {
    if(!csrfSafeMethod(settings.type) && !this.crossDomain) {
      xhr.setRequestHeader("X-CSRFToken", csrftoken);
    }
  }
});


/*
 * Acquire csrftoken
*/
function getCookie(name) {
  var cookieVal;
  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');
    /* Find cookie with string starting with name */
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      if (cookie.substring(0, name.length + 1) == (name + '=')) {
        cookieVal = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieVal;
}
