/*
Reloadable, Drag-and-Drop DIVs representing saved Session objects
by tkbaylis
*/


// Updated coordinates of changed Sessions
var updatedCoords = [];


/*
 * Retrieve saved sessions and display as draggable boxes
 *
 * Based on 'Simple Draggable Element Persistence with jQuery'
 * by Dustin Blake, 29 Oct 2009
 * http://code.tutsplus.com/tutorials/simple-draggable-element-persistence-with-jquery--net-7474
*/
$(function () {
  /* Load sessions as JSON */
  $.getJSON('ajax/_get_sessions', function(data) {
	for (var i = 0; i < data.length; i++) {
		session = data[i];

		/* Dynamically create box for session */
		var div = document.createElement("div");
		$('.area').append(div);
		div.className = "session";

		/* Set session's position to xpos & ypos */
		$(div).css({left: session.xpos, top: session.ypos});

    /* To box add hidden id */
    var id = document.createElement("div");
    $(div).append(id);
    id.className = "session-id";
    id.innerHTML = session.id;    // !!! undefined

		/* To box add delete button */
		var x = document.createElement("div");
		$(div).append(x);
		x.className = "session-delete";
		x.innerHTML = 'x';
		$(x).click(function () {
			// !!! customize alert with option to cancel with jquery ui
			// alert('You are about to delete this session.');

      var id = $(this).parent().find(".session-id").text();

      $.ajax({
        url: "ajax/_delete_session",
  			type: "POST",
  			dataType: "json",
        data: JSON.stringify({"id": id}),
        success: function (response) {
          window.location.href = response.url;
        },
        error: function (response) {
          console.log('there was error');  // !!! redirect to error page
        }
      });

		});

		/* To box add session name */
		var name = document.createElement("div");
		$(div).append(name);
		name.className = "seat-name";
		name.innerHTML = session.name;

		/* To box add position coords (temp - only for visualization)*/
		var coords = document.createElement("div");
		$(div).append(coords);
		coords.className = "coords";

		/* Make session box draggable only within area */
		$(div).draggable({
			containment: ".area",
			scroll: false
		})

		/* Update position coords (temp - only for visualization) */
		.mousemove(function() {
			var coord = $(this).position();
			$(this).find(".coords").text("left: " + coord.left + ", top: " + coord.top);
		})

		/* Add to updated coordinates */
		.mouseup(function() {
      var id = $(this).find(".session-id").text();
			var seatname = $(this).find(".seat-name").text();
			var coord = $(this).position();
			var item = { id: id, name: seatname, xpos: coord.left, ypos: coord.top};
			updatedCoords = updatedCoords.filter(function (obj) {
				// callback to keep all but this in updatedCoords
        return obj.id !== id;
			});
			updatedCoords.push(item);
			var data = $.toJSON(updatedCoords);
			console.log(data);
		});
	}
  });
});


/*
 * Post all changed sessions when button clicked
 */
$(function () {
	$('.save-changes').click(function () {
    csrftoken = getCookie('csrftoken');  // If csrf token is required for JQuery --> Django

    // var test = JSON.stringify({"updates": updatedCoords});
    // console.log(test);
    // console.log(typeof(name));  // string

    $.ajax({
      url: "ajax/_post_sessions",
			type: "POST",
			dataType: "json",
      data: JSON.stringify({"updates": updatedCoords}),
      // data: JSON.stringify({"abc":123, "def": 456}),
      success: function (response) {
        window.location.href = response.url;
      },
      error: function (response) {
        console.log('there was error at save changes');  // !!! redirect to error page
      }
    });
	});
});


/*
 * Add new session when submit button clicked (Bootstrap modal)
 */
$(function () {
  $(".add-session").click(function () {
    csrftoken = getCookie('csrftoken');  // If csrf token is required for JQuery --> Django
    var name = String($("#name").val());
    $.ajax({
      url: "ajax/_add_session",
			type: "POST",
			dataType: "json",
      data: JSON.stringify({"name": name}),
      success: function (response) {
        window.location.href = response.url;
      },
      error: function (response) {
        console.log('there was error at add new session');  // !!! redirect to error page
      }
    });
  });
});
