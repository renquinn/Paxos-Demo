$(function() {
  var node_width = 100;
  var node_height = 100;
  var TIME = 0;
  // Controlling the script via slider
  $( "#slider" ).slider({
    animate: true,
    value: 0,
    min: 0,
    max: 10,
    step: 1,
    slide: function(event, ui) {
      TIME = ui.value;
      console.log(TIME);
      reload();
    }
  });
  var script = [
    {
      "Phase": {
        "Type": "Prepare",
        "Description": "A Proposer creates a proposal identified with a number N. This number must be greater than any previous proposal number used by this Proposer. Then, it sends a Prepare message containing this proposal to a Quorum of Acceptors."
      },
      "Proposer": {
        "Database": {
          "a": "b",
          "go": "gopher"
        },
        "Slots": [
          "Command1",
          "Command2"
        ],
        "Recent": "Command3"
      },
      "Acceptor": {
      },
      "Learner": {
      }
    },
    {
      "Phase": {
        "Type": "",
        "Description": ""
      },
      "Proposer": {
        "Database": {
        },
        "Slots": [
        ],
        "Recent": ""
      },
      "Acceptor": {
      },
      "Learner": {
      }
    },
  ];
var reload = function() {
  var propose = function(replica, command) {
    var proposer = {};
    var acceptors = [];
    $.each($('.node'), function() {
      node = $(this);
      if (node.data('type') == "proposer") {
        if (node.data('replica') == replica) {
          proposer = node.position();
        }
      } else if (node.data('type') == "acceptor") {
        acceptors.push(node.position());
      }
    });
    $.each(acceptors, function() {
      $('<div />')
        .addClass('message')
        .css('left', (proposer.left + node_width))
        .css('top',proposer.top)
        .appendTo('#content')
        .animate({ left: this.left, top: this.top }, 3000, function() {
          $(this).remove();
        });
    });
    console.log("Replica " + replica + " has proposed the value " + command + ".");
  }

    $('pre#phase').text(script[TIME]['Phase']['Type']);

    $('.send_message').click(function(event) {
      propose($(this).data("replica"), "put a b");
    });

    $('.node').popover({
      placement: 'bottom',
      trigger: 'hover',
      html: true,
      title: function() {
        return $(this).data('type');
      },
      content: function() {
        if ($(this).data('type') == "proposer") {
          var database = $('<table />');
          database.append($('<tr />').append($('<th />').text('Key')).append($('<th />').text('Value')));
          $.each(script[TIME]['Proposer']['Database'], function(key, value) {
            database.append($('<tr />').append($('<td />').text(key)).append($('<td />').text(value)));
          });

          var slots = $('<table />');
          slots.append($('<tr />').append($('<th />').text('N')).append($('<th />').text('Command')));
          $.each(script[TIME]['Proposer']['Slots'], function(key, value) {
            slots.append($('<tr />').append($('<td />').text(key+1)).append($('<td />').text(value)));
          });

          var table = $('<table />')
            .append($('<tr />')
              .append($('<th />').text('Database'))
              .append($('<th />').text('Slots'))
              .append($('<th />').text('Recent'))
            ).append($('<tr />')
              .append($('<td />').html(database))
              .append($('<td />').html(slots))
              .append($('<td />').text(script[TIME]['Proposer']['Recent']))
            ).html();
        } else {
          var table = $('<table />').append($('<tr />').append($('<th />').text('A'))).append($('<tr />').append($('<td />').text('B'))).html();
        }
        return table;
      }
      //template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title">TITLE!!!!</h3><div class="popover-content"><p>CONTENT!</p></div></div></div>'
    });
};
reload();
});
