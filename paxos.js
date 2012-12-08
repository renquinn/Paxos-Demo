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

  // Dueling proposers
  var DUEL =
  {
    "title": "Dueling Proposers",
    "data":
    [
      {
        "phase": {
          "type": "Prepare",
          "description": ['A Proposer creates a proposal identified with a number N. This number must be greater than any previous proposal number used by this Proposer. Then, it sends a Prepare message containing this proposal to a Quorum of Acceptors'],
          "proposer": 0
        },
        "replicaData" : [
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "put key value",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "",
            "status": "success",
            "n": 1
          }
        ]
      },
      {
        "phase": {
          "type": "Promise",
          "description": ["If the proposal's number N is higher than any previous proposal number received from any Proposer by the Acceptor, then the Acceptor must return a promise to ignore all future proposals having a number less than N. If the Acceptor accepted a proposal at some point in the past, it must include the previous proposal number and previous value in its response to the Proposer.", " Otherwise, the Acceptor can ignore the received proposal. It does not have to answer in this case for Paxos to work. However, for the sake of optimization, sending a denial (Nack) response would tell the Proposer that it can stop its attempt to create consensus with proposal N."],
          "proposer": 0
        },
        "replicaData" : [
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "",
            "status": "success",
            "n": 1
          }
        ]
      },
      {
        "phase": {
          "type": "Prepare",
          "description": ["Occasionally, multiple proposers might feel the need to propose a value at the same time.  This causes a conflict since a replica must only accept a single value per session.  The conflicted proposers then begin a duel to see who can gain the quorum's trust",
                          "When a proposer receives a denial from a majority of acceptors, it must then propose the same value with a higher sequence number after sleeping for a brief period of time."],
          "proposer": 1
        },
        "replicaData" : [
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "",
            "status": "error",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "put key value",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "",
            "status": "success",
            "n": 1
          }
        ]
      },
      {
        "phase": {
          "type": "Accept",
          "description": ["If a Proposer receives enough promises from a Quorum of Acceptors, it needs to set a value to its proposal. If any Acceptors had previously accepted any proposal, then they'll have sent their values to the Proposer, who now must set the value of its proposal to the value associated with the highest proposal number reported by the Acceptors. If none of the Acceptors had accepted a proposal up to this point, then the Proposer may choose any value for its proposal.", "The Proposer sends an Accept Request message to a Quorum of Acceptors with the chosen value for its proposal."],
          "proposer": 0
        },
        "replicaData" : [
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "put key value",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "put key value",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "put key value",
            "status": "success",
            "n": 1
          }
        ]
      },
      {
        "phase": {
          "type": "Promise",
          "description": ["If the proposal's number N is higher than any previous proposal number received from any Proposer by the Acceptor, then the Acceptor must return a promise to ignore all future proposals having a number less than N. If the Acceptor accepted a proposal at some point in the past, it must include the previous proposal number and previous value in its response to the Proposer.", " Otherwise, the Acceptor can ignore the received proposal. It does not have to answer in this case for Paxos to work. However, for the sake of optimization, sending a denial (Nack) response would tell the Proposer that it can stop its attempt to create consensus with proposal N."],
          "proposer": 1
        },
        "replicaData" : [
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "",
            "status": "success",
            "n": 1
          }
        ]
      },
      {
        "phase": {
          "type": "Accepted",
          "description": ["If an Acceptor receives an Accept Request message for a proposal N, it must accept it if and only if it has not already promised to only consider proposals having an identifier greater than N. In this case, it should register the corresponding value v and send an Accepted message to the Proposer and every Learner. Else, it can ignore the Accept Request."],
          "proposer": 0
        },
        "replicaData" : [
          {
            "database": {
              "a": "b",
              "go": "gopher",
              "key": "value"
            },
            "slots": [
              "put a b",
              "put go gopher",
              "put key value"
            ],
            "recent": "put key value",
            "value": "put key value",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher",
              "key": "value"
            },
            "slots": [
              "put a b",
              "put go gopher",
              "put key value"
            ],
            "recent": "put key value",
            "value": "put key value",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher",
              "key": "value"
            },
            "slots": [
              "put a b",
              "put go gopher",
              "put key value"
            ],
            "recent": "put key value",
            "value": "put key value",
            "status": "success",
            "n": 1
          }
        ]
      },
    ]
  };
var SCRIPT = BASIC;

/*
  var SCRIPT;
  var scenario = 'normal.json';
  $.ajax({
    url: scenario,
    type: 'GET',
    async: false,
    dataType: 'json',
    error: function(data) {
      console.log(data);
      SCRIPT = data.responseText;
      console.log(SCRIPT);
    }
  });

  console.log(SCRIPT);
  //$.getJSON(scenario, function(data) {
    //SCRIPT = $.parseJSON(data);
    //console.log(data);
    //SCRIPT = data;
  //});
*/

  /*
   * PLUGINS
   */
  // FAILURE OF AN ACCEPTOR
  var ACCEPTOR_FAILURE =
  {
    "title": "Failure of an Acceptor",
    "data" :
    [
      {
        "phase": {
          "type": "Prepare",
          "description": ['A Proposer creates a proposal identified with a number N. This number must be greater than any previous proposal number used by this Proposer. Then, it sends a Prepare message containing this proposal to a Quorum of Acceptors'],
          "proposer": 0
        },
        "replicaData" : [
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "put key value",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "",
            "status": "success",
            "n": 1
          }
        ]
      },
      {
        "phase": {
          "type": "Promise",
          "description": ["If the proposal's number N is higher than any previous proposal number received from any Proposer by the Acceptor, then the Acceptor must return a promise to ignore all future proposals having a number less than N. If the Acceptor accepted a proposal at some point in the past, it must include the previous proposal number and previous value in its response to the Proposer.",
                          " Otherwise, the Acceptor can ignore the received proposal. It does not have to answer in this case for Paxos to work. However, for the sake of optimization, sending a denial (Nack) response would tell the Proposer that it can stop its attempt to create consensus with proposal N.",
                          "The simplest error cases are the failure of a redundant Learner, or failure of an Acceptor when a Quorum of Acceptors remains live. In these cases, the protocol requires no recovery. No additional rounds or messages are required"],
          "proposer": 0
        },
        "replicaData" : [
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "",
            "status": "fail",
            "n": 1
          }
        ]
      },
      {
        "phase": {
          "type": "Accept",
          "description": ["If a Proposer receives enough promises from a Quorum of Acceptors, it needs to set a value to its proposal. If any Acceptors had previously accepted any proposal, then they'll have sent their values to the Proposer, who now must set the value of its proposal to the value associated with the highest proposal number reported by the Acceptors. If none of the Acceptors had accepted a proposal up to this point, then the Proposer may choose any value for its proposal.", "The Proposer sends an Accept Request message to a Quorum of Acceptors with the chosen value for its proposal."],
          "proposer": 0
        },
        "replicaData" : [
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "put key value",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "put key value",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "put key value",
            "status": "success",
            "n": 1
          }
        ]
      },
      {
        "phase": {
          "type": "Accepted",
          "description": ["If an Acceptor receives an Accept Request message for a proposal N, it must accept it if and only if it has not already promised to only consider proposals having an identifier greater than N. In this case, it should register the corresponding value v and send an Accepted message to the Proposer and every Learner. Else, it can ignore the Accept Request."],
          "proposer": 0
        },
        "replicaData" : [
          {
            "database": {
              "a": "b",
              "go": "gopher",
              "key": "value"
            },
            "slots": [
              "put a b",
              "put go gopher",
              "put key value"
            ],
            "recent": "put key value",
            "value": "put key value",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher",
              "key": "value"
            },
            "slots": [
              "put a b",
              "put go gopher",
              "put key value"
            ],
            "recent": "put key value",
            "value": "put key value",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher",
              "key": "value"
            },
            "slots": [
              "put a b",
              "put go gopher",
              "put key value"
            ],
            "recent": "put key value",
            "value": "put key value",
            "status": "success",
            "n": 1
          }
        ]
      },
    ]
  };

  var BASIC =
  {
    "title": "Basic Paxos",
    "data":
    [
      {
        "phase": {
          "type": "Prepare",
          "description": ['A Proposer creates a proposal identified with a number N. This number must be greater than any previous proposal number used by this Proposer. Then, it sends a Prepare message containing this proposal to a Quorum of Acceptors'],
          "proposer": 0
        },
        "replicaData" : [
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "put key value",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "",
            "status": "success",
            "n": 1
          }
        ]
      },
      {
        "phase": {
          "type": "Promise",
          "description": ["If the proposal's number N is higher than any previous proposal number received from any Proposer by the Acceptor, then the Acceptor must return a promise to ignore all future proposals having a number less than N. If the Acceptor accepted a proposal at some point in the past, it must include the previous proposal number and previous value in its response to the Proposer.", " Otherwise, the Acceptor can ignore the received proposal. It does not have to answer in this case for Paxos to work. However, for the sake of optimization, sending a denial (Nack) response would tell the Proposer that it can stop its attempt to create consensus with proposal N."],
          "proposer": 0
        },
        "replicaData" : [
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "",
            "status": "success",
            "n": 1
          }
        ]
      },
      {
        "phase": {
          "type": "Accept",
          "description": ["If a Proposer receives enough promises from a Quorum of Acceptors, it needs to set a value to its proposal. If any Acceptors had previously accepted any proposal, then they'll have sent their values to the Proposer, who now must set the value of its proposal to the value associated with the highest proposal number reported by the Acceptors. If none of the Acceptors had accepted a proposal up to this point, then the Proposer may choose any value for its proposal.", "The Proposer sends an Accept Request message to a Quorum of Acceptors with the chosen value for its proposal."],
          "proposer": 0
        },
        "replicaData" : [
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "put key value",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "put key value",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher"
            },
            "slots": [
              "put a b",
              "put go gopher"
            ],
            "recent": "put go gopher",
            "value": "put key value",
            "status": "success",
            "n": 1
          }
        ]
      },
      {
        "phase": {
          "type": "Accepted",
          "description": ["If an Acceptor receives an Accept Request message for a proposal N, it must accept it if and only if it has not already promised to only consider proposals having an identifier greater than N. In this case, it should register the corresponding value v and send an Accepted message to the Proposer and every Learner. Else, it can ignore the Accept Request."],
          "proposer": 0
        },
        "replicaData" : [
          {
            "database": {
              "a": "b",
              "go": "gopher",
              "key": "value"
            },
            "slots": [
              "put a b",
              "put go gopher",
              "put key value"
            ],
            "recent": "put key value",
            "value": "put key value",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher",
              "key": "value"
            },
            "slots": [
              "put a b",
              "put go gopher",
              "put key value"
            ],
            "recent": "put key value",
            "value": "put key value",
            "status": "success",
            "n": 1
          },
          {
            "database": {
              "a": "b",
              "go": "gopher",
              "key": "value"
            },
            "slots": [
              "put a b",
              "put go gopher",
              "put key value"
            ],
            "recent": "put key value",
            "value": "put key value",
            "status": "success",
            "n": 1
          }
        ]
      },
    ]
  };
var SCRIPT = BASIC;

/*
  var SCRIPT;
  var scenario = 'normal.json';
  $.ajax({
    url: scenario,
    type: 'GET',
    async: false,
    dataType: 'json',
    error: function(data) {
      console.log(data);
      SCRIPT = data.responseText;
      console.log(SCRIPT);
    }
  });

  console.log(SCRIPT);
  //$.getJSON(scenario, function(data) {
    //SCRIPT = $.parseJSON(data);
    //console.log(data);
    //SCRIPT = data;
  //});
*/

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
    var proposerId;
    var acceptors = [];
    $.each($('.node'), function() {
      node = $(this);
      if (node.data('type') == "proposer") {
        if (node.data('replica') == replica) {
          proposer = node.position();
          proposerId = node.data('replica');
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
        .html("<p>" + SCRIPT.data[TIME].replicaData[proposerId].n + "</p><p class='value'>" + SCRIPT.data[TIME].replicaData[proposerId].value + "</p>")
        .addClass(textClass)
        .appendTo('#content')
        .animate({ left: this.left, top: this.top }, ANIMATE_SPEED, function() {
          $(this).remove();
        });
    });
    //console.log("Replica " + replica + " has proposed the value " + command + ".");
  };

  var promise = function(replica) {
    var proposer = {};
    var proposerId;
    var acceptors = [];
    $.each($('.node'), function() {
      node = $(this);
      if (node.data('type') == "proposer") {
        if (node.data('replica') == replica) {
          proposer = node.position();
          proposerId = node.data('replica');
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
        .html('<p>' + SCRIPT.data[TIME].replicaData[replica].n + '</p><p class="value">' + SCRIPT.data[TIME].replicaData[replica].value + '</p>')
        .addClass(textClass)
        .appendTo('#content')
        .animate({ left: this.left, top: this.top }, ANIMATE_SPEED, function() {
          $(this).remove();
        });
    });
    //console.log("Replica " + replica + " has proposed the value " + command + ".");
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
      textClass = 'text-success';
      acceptor = this;
      $('<div />')
        .addClass('message')
        .css('left', acceptor.left)
        .css('top', acceptor.top)
        .text(SCRIPT.data[TIME].replicaData[replica].n)
        .addClass(textClass)
        .appendTo('#content')
        .animate({ left: proposer.left, top: proposer.top }, ANIMATE_SPEED, function() {
          $(this).remove();
        });
      // TODO: Sending a learner message should be conditional
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
      $('.play-pause').text('Play');
    } else {
      $('.play-pause').text('Pause');
    }
  });

  $('.next-step').click(function(event) {
    TIME = (TIME+1)%MAX_TIME;
    $( "#step" ).slider('value', TIME);
    reload();
  });

  $('.previous-step').click(function(event) {
    TIME = (TIME+3)%MAX_TIME;
    $( "#step" ).slider('value', TIME);
    reload();
  });

  $('#example-case').live('change', function(event) {
    if ($(this).val() == 'basic') {
      SCRIPT = BASIC;
      MAX_TIME = SCRIPT.data.length;
      TIME = 0;
      $( "#step" ).slider('value', TIME);
      reload();
    } else if ($(this).val() == 'acceptor-failure') {
      SCRIPT = ACCEPTOR_FAILURE;
      MAX_TIME = SCRIPT.data.length;
      TIME = 0;
      $( "#step" ).slider('value', TIME);
      reload();
    } else if ($(this).val() == 'duel') {
      SCRIPT = DUEL;
      MAX_TIME = SCRIPT.data.length;
      TIME = 0;
      $( "#step" ).slider('value', TIME);
      reload();
    }
  });

  reload();
  animation();
  life();
});
