$(function() {
  /*
   * GLOBALS
   */
  var node_width = 100;
  var node_height = 100;
  var ANIMATE_SPEED = 2000;
  var STEP_SPEED = 3000;
  var CONTINUOUS = false;
  var TIME = 0;
  var MAX_TIME = 4;
  var PAUSE = true;
  var SCRIPT;
  $.ajax({
    url: "scripts/basic.json",
    type: 'GET',
    async: false,
    dataType: 'json',
    success: function(data) {
      SCRIPT = data;
    }
  });

  /*
   * PLUGINS
   */
  // Controlling the script via slider
  $( "#step" ).slider({
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

  $( "#step-speed" ).slider({
    animate: true,
    value: STEP_SPEED,
    min: 0,
    max: 10000,
    step: 100,
    slide: function(event, ui) {
      STEP_SPEED = ui.value;
    }
  });

  $( "#animation-speed" ).slider({
    animate: true,
    value: ANIMATE_SPEED,
    min: 0,
    max: 5000,
    step: 100,
    slide: function(event, ui) {
      ANIMATE_SPEED = ui.value;
    }
  });

  /*
   * FUNCTIONS
   */
  var life = function() {
    if (!PAUSE) {
      TIME = (TIME+1)%MAX_TIME;
      $( "#step" ).slider('value', TIME);
      reload();
    };

    setTimeout(function() {
      life();
    }, STEP_SPEED);
  };

  var animation = function() {
    if ($('#animate').is(':checked')) {
      var type = SCRIPT.data[TIME]['phase']['type'];
      var proposer = SCRIPT.data[TIME].phase.proposer;
      if (type == "Prepare") {
        propose(proposer);
      } else if (type == "Promise") {
        promise(proposer);
      } else if (type == "Accept") {
        accept(proposer);
      } else if (type == "Accepted") {
        accepted(proposer);
      }
    }
    setTimeout(function() {
      animation();
    }, ANIMATE_SPEED);
  };

  var propose = function(replica) {
    var proposer = {};
    var proposerId = SCRIPT.data[TIME].phase.proposer;
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
    $.each(acceptors, function(replica) {
      textClass = 'text';
      $('<div />')
        .addClass('message')
        .css('left', (proposer.left + node_width))
        .css('top',proposer.top)
        .html("<p>" + SCRIPT.data[TIME].phase.proposal + "</p><p class='value'>" + SCRIPT.data[TIME].replicaData[proposerId].value + "</p>")
        .addClass(textClass)
        .appendTo('#content')
        .animate({ left: this.left, top: this.top }, ANIMATE_SPEED, function() {
          $(this).remove();
        });
    });
  };

  var promise = function(replica) {
    var proposer = {};
    var proposerId = SCRIPT.data[TIME].phase.proposer;
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
    $.each(acceptors, function(replica) {
      if (SCRIPT.data[TIME].replicaData[replica].status != "fail") {
        textClass = 'text';
        if (SCRIPT.data[TIME].replicaData[replica].status == "success") {
          textClass = 'text-success';
        } else if (SCRIPT.data[TIME].replicaData[replica].status == "error") {
          textClass = 'text-error';
        }
        $('<div />')
          .addClass('message')
          .css('left', this.left)
          .css('top', this.top)
          .html("<p>" + SCRIPT.data[TIME].replicaData[replica].n + "</p><p class='value'>" + SCRIPT.data[TIME].replicaData[replica].value + "</p>")
          .addClass(textClass)
          .appendTo('#content')
          .animate({ left: proposer.left, top: proposer.top }, ANIMATE_SPEED, function() {
            $(this).remove();
          });
      }
    });
  };

  var accept = function(replica) {
    var proposer = {};
    var proposerId = SCRIPT.data[TIME].phase.proposer;
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
    $.each(acceptors, function(replica) {
      textClass = 'text';
      $('<div />')
        .addClass('message')
        .css('left', (proposer.left + node_width))
        .css('top',proposer.top)
        .html('<p>' + SCRIPT.data[TIME].phase.proposal + '</p><p class="value">' + SCRIPT.data[TIME].replicaData[replica].value + '</p>')
        .addClass(textClass)
        .appendTo('#content')
        .animate({ left: this.left, top: this.top }, ANIMATE_SPEED, function() {
          $(this).remove();
        });
    });
  };

  var accepted = function(replica) {
    var proposer = {};
    var acceptors = [];
    var learners = [];
    $.each($('.node'), function() {
      node = $(this);
      if (node.data('type') == "proposer") {
        if (node.data('replica') == replica) {
          proposer = node.position();
        }
      } else if (node.data('type') == "acceptor") {
        acceptors.push(node.position());
      } else if (node.data('type') == "learner") {
        learners.push(node.position());
      }
    });
    $.each(acceptors, function(replica) {
      acceptor = this;
      var textClass = "text";
      if (SCRIPT.data[TIME].replicaData[replica].status == "error") {
        textClass = 'text-error';
      } else if (SCRIPT.data[TIME].replicaData[replica].status == "success") {
        textClass = "text-success";
        $('<div />')
          .addClass('message')
          .css('left', acceptor.left)
          .css('top', acceptor.top)
          .html('<p>' + SCRIPT.data[TIME].replicaData[replica].n + '</p><p class="value">' + SCRIPT.data[TIME].replicaData[replica].value + '</p>')
          .addClass(textClass)
          .appendTo('#content')
          .animate({ left: learners[0].left }, ANIMATE_SPEED, function() {
            $(this).remove();
          });
      }
      $('<div />')
        .addClass('message')
        .css('left', acceptor.left)
        .css('top', acceptor.top)
        .html('<p>' + SCRIPT.data[TIME].replicaData[replica].n + '</p><p class="value">' + SCRIPT.data[TIME].replicaData[replica].value + '</p>')
        .addClass(textClass)
        .appendTo('#content')
        .animate({ left: proposer.left, top: proposer.top }, ANIMATE_SPEED, function() {
          $(this).remove();
        });
    });
  };

  var reload = function() {
    // Load the phase type
    var type = SCRIPT.data[TIME]['phase']['type'];
    var color = "muted";
    if (type == "Promise") {
      color = "text-warning";
    } else if (type == "Accept") {
      color = "text-info";
    } else if (type == "Accepted") {
      color = "text-success";
    }
    $('#phase').text(type).attr('class', color);

    // Load the description
    $('#title').text(SCRIPT.title);
    $('#description').html('');
    $.each(SCRIPT.data[TIME]['phase']['description'], function(key, value) {
      $('#description').append($('<p />').text(value));
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
        $.each(SCRIPT.data[TIME].replicaData[$(this).data('replica')].database, function(key, value) {
          database.append($('<tr />').append($('<td />').text(key)).append($('<td />').text(value)));
        });

        var slots = $('<table />');
        slots.append($('<tr />').append($('<th />').text('#')).append($('<th />').text('Command')));
        $.each(SCRIPT.data[TIME].replicaData[$(this).data('replica')].slots, function(key, value) {
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
            .append($('<td />').text(SCRIPT.data[TIME].replicaData[$(this).data('replica')].recent))
            .append($('<td />').text(SCRIPT.data[TIME].replicaData[$(this).data('replica')].n))
          ).html();

        return table;
      }
        //template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title">TITLE!!!!</h3><div class="popover-content"><p>CONTENT!</p></div></div></div>'
    });

    // Controlling the script via slider
    $( "#step" ).slider({
      animate: true,
      value: TIME,
      min: 0,
      max: MAX_TIME - 1,
      step: 1,
      slide: function(event, ui) {
        TIME = ui.value;
        reload();
      }
    });

  };

  /*
   * HANDLERS
   */

  $('#toggle-controls-body').click(function() {
    $('#controls-body').toggle();
  });

  $('#toggle-info-body').click(function() {
    $('#info-body').toggle();
  });

  $('.play-pause').click(function(event) {
    PAUSE = !PAUSE;
    if (PAUSE) {
      $('.play-pause').html('<i class="icon-play icon-white"></i>Play');
    } else {
      $('.play-pause').html('<i class="icon-pause icon-white"></i>Pause');
    }
  });

  $('.next-step').click(function(event) {
    TIME = (TIME+1)%MAX_TIME;
    $( "#step" ).slider('value', TIME);
    reload();
  });

  $('.previous-step').click(function(event) {
    TIME = (TIME+(MAX_TIME-1))%MAX_TIME;
    $( "#step" ).slider('value', TIME);
    reload();
  });

  $('#example-case').live('change', function(event) {
    var scenario = 'scripts/' + $(this).val() + '.json';
    $.ajax({
      url: scenario,
      type: 'GET',
      async: false,
      dataType: 'json',
      success: function(data) {
        SCRIPT = data;
      }
    });

    MAX_TIME = SCRIPT.data.length;
    TIME = 0;
    $( "#step" ).slider('value', TIME);
    reload();
  });

  reload();
  animation();
  life();
});
