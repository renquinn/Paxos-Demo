$(function() {
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
      "Proposer": {
      },
      "Acceptor": {
      },
      "Learner": {
      }
    },
  ];

  $('pre#phase').text(script[0]['Phase']['Type']);

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
        $.each(script[0]['Proposer']['Database'], function(key, value) {
          database.append($('<tr />').append($('<td />').text(key)).append($('<td />').text(value)));
        });

        var slots = $('<table />');
        slots.append($('<tr />').append($('<th />').text('N')).append($('<th />').text('Command')));
        $.each(script[0]['Proposer']['Slots'], function(key, value) {
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
            .append($('<td />').text(script[0]['Proposer']['Recent']))
          ).html();
      } else {
        var table = $('<table />').append($('<tr />').append($('<th />').text('A'))).append($('<tr />').append($('<td />').text('B'))).html();
      }
      return table;
    }
    //template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title">TITLE!!!!</h3><div class="popover-content"><p>CONTENT!</p></div></div></div>'
  });
});
