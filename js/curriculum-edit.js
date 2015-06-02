/*
Reloadable, Drag-and-Drop DIVs

Based on 'Simple Draggable Element Persistence with jQuery'
by Dustin Blake, 29 Oct 2009
http://code.tutsplus.com/tutorials/simple-draggable-element-persistence-with-jquery--net-7474
*/

$(document).ready(function () {
  /* !!! To read coordinates from JSON - requires GET HTTP request
  http://api.jquery.com/jQuery.getJSON/ */


  /* To dynamically generate divs with coordinates */
  var div = document.createElement("div");
  document.body.appendChild(div);
  // div.style.left = "120px";
  // div.style.top = "400px";
  div.className = "seat";
  div.innerHTML = '<p class="seatname">seat003</p><p class="coords"></p>';


  /* To get coordinates and save to JSON */
  var seatCoords = [];

  $(".seat").draggable({
    containment: ".floor",
    scroll: false
  })

  .mousemove(function() {
    /* This is only for visualization */
    var coord = $(this).position();
    $(this).find(".coords").text("left: " + coord.left + ", top: " + coord.top);
  })

  .mouseup(function() {
    var seatname = $(this).find(".seatname").text();
    console.log(seatname);
    var coord = $(this).position();
    var item = { seatName: seatname, coordLeft: coord.left, coordTop: coord.top};
    seatCoords = seatCoords.filter(function (obj) {
      return obj.seatName !== seatname;
    });
    seatCoords.push(item);
    var order = { seatCoords: seatCoords };
    var data = $.toJSON(order);
    console.log(data);

    /* !!! Alter the following to post to Flask/Django */
    // $.post('updatecoords.php', 'data='+$.toJSON(order), function(response){
    //   if(response=="success") {
    //     $("#respond").html('<div class="success">X and Y Coordinates Saved!</div>').hide().fadeIn(1000);
    //     setTimeout(function(){ $('#respond').fadeOut(1000); }, 2000);
    //   }
    // });
  });
});
