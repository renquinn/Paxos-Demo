$(function() {
  var node_width = 100;
  var node_height = 100;
  var ANIMATE_SPEED = 3000;
  var TIME = 0;

  // Controlling the script via slider
  $( "#slider" ).slider({
    animate: true,
    value: TIME,
    min: 0,
    max: 3,
    step: 1,
    slide: function(event, ui) {
      TIME = ui.value;
      reload();
    }
  });

  var script = [
    {
      "phase": {
        "type": "Prepare",
        "description": 'A Proposer creates a proposal identified with a number N. This number must be greater than any previous proposal number used by this Proposer. Then, it sends a Prepare message containing this proposal to a Quorum of Acceptors. Press "Propose" to propose the command "put key value".'
      },
      "database": {
        "a": "b",
        "go": "gopher"
      },
      "slots": [
        "Command1",
        "Command2"
      ],
      "proposer": {
        "recent": "Command3",
        "n": 1
      },
      "acceptor": {
        "recent": "Command3",
        "n": 1
      },
      "learner": {
      }
    },
    {
      "phase": {
        "type": "Promise",
        "description": "If the proposal's number N is higher..."
      },
      "database": {
        "a": "b",
        "go": "gopher"
      },
      "slots": [
        "Command1",
        "Command2"
      ],
      "proposer": {
        "recent": "Command3",
        "n": 1
      },
      "acceptor": {
        "recent": "Command3",
        "n": 1
      },
      "learner": {
      }
    },
    {
      "phase": {
        "type": "Accept",
        "description": "If a Proposer receives enough promises from a Quorum of Acceptors..."
      },
      "database": {
        "a": "b",
        "go": "gopher"
      },
      "slots": [
        "Command1",
        "Command2"
      ],
      "proposer": {
        "recent": "Command3",
        "n": 1
      },
      "acceptor": {
        "recent": "Command3",
        "n": 1
      },
      "learner": {
      }
    },
    {
      "phase": {
        "type": "Accepted",
        "description": "If an Acceptor receives an Accept message for a proposal N..."
      },
      "database": {
        "a": "b",
        "go": "gopher"
      },
      "slots": [
        "Command1",
        "Command2"
      ],
      "proposer": {
        "recent": "Command3",
        "n": 1
      },
      "acceptor": {
        "recent": "Command3",
        "n": 1
      },
      "learner": {
      }
    },
  ];

  var animation = function() {
    if ($('#animate').is(':checked')) {
      var type = script[TIME]['phase']['type'];
      if (type == "Prepare") {
        propose(1, 'insert alpha beta');
      } else if (type == "Promise") {
        promise(1, 'insert alpha beta');
      } else if (type == "Accept") {
      } else if (type == "Accepted") {
      }
    }
    setTimeout(function() {
      animation();
    }, ANIMATE_SPEED);
  };

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
        .animate({ left: this.left, top: this.top }, ANIMATE_SPEED, function() {
          $(this).remove();
        });
    });
    //console.log("Replica " + replica + " has proposed the value " + command + ".");
  };

  var promise = function(replica, command) {
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
        .css('left', this.left)
        .css('top', this.top)
        .appendTo('#content')
        .animate({ left: proposer.left, top: proposer.top }, ANIMATE_SPEED, function() {
          $(this).remove();
        });
    });
  };

  var reload = function() {
    var type = script[TIME]['phase']['type'];
    var color = "muted";
    if (type == "Promise") {
      color = "text-warning";
    } else if (type == "Accept") {
      color = "text-info";
    } else if (type == "Accepted") {
      color = "text-success";
    }
    $('#phase').text(type).attr('class', color);
    $('#description').text(script[TIME]['phase']['description']);

    $('.send_message').click(function(event) {
      propose($(this).data("replica"), "put key value");
    });

    $('.node').popover({
      placement: 'bottom',
      trigger: 'hover',
      html: true,
      title: function() {
        return $(this).data('type');
      },
      content: function() {
        var database = $('<table />');
        database.append($('<tr />').append($('<th />').text('Key')).append($('<th />').text('Value')));
        $.each(script[TIME]['database'], function(key, value) {
          database.append($('<tr />').append($('<td />').text(key)).append($('<td />').text(value)));
        });

        var slots = $('<table />');
        slots.append($('<tr />').append($('<th />').text('#')).append($('<th />').text('Command')));
        $.each(script[TIME]['slots'], function(key, value) {
          slots.append($('<tr />').append($('<td />').text(key+1)).append($('<td />').text(value)));
        });

        var table = $('<table />')
          .append($('<tr />')
            .append($('<th />').text('Database'))
            .append($('<th />').text('Slots'))
            .append($('<th />').text('Recent'))
            .append($('<th />').text('N'))
          ).append($('<tr />')
            .append($('<td />').html(database))
            .append($('<td />').html(slots))
            .append($('<td />').text(script[TIME][$(this).data('type')]['recent']))
            .append($('<td />').text(script[TIME][$(this).data('type')]['n']))
          ).html();

        return table;
      }
        //template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title">TITLE!!!!</h3><div class="popover-content"><p>CONTENT!</p></div></div></div>'
    });
  };

  $('.plus_time').click(function(event) {
    //if (TIME == 0) {
      //propose(1, 'insert alpha beta');
    //}
    TIME = (TIME+1)%4;
    $( "#slider" ).slider('value', TIME);
    reload();
  });

  reload();
  animation();
});
