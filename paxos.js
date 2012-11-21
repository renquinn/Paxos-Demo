$(function() {
  /*
   * jQuery QTIP
   * http://craigsworks.com/projects/qtip/docs/tutorials/
   */

/*
  $('.node').qtip({
    content: {
      url: 'nodeinfo.html'
    },
    position: {
      corner: {
        target: 'rightMiddle',
        tooltip: 'leftMiddle'
      }
    },
    show: 'mouseover',
    hide: 'mouseout'
  })

  $('.message').qtip({
    content: {
      url: 'messageinfo.html'
    },
    position: {
      corner: {
        target: 'rightMiddle',
        tooltip: 'leftMiddle'
      }
    },
    show: 'mouseover',
    hide: 'mouseout'
  })
*/

  $('.node').popover({
    placement: 'bottom',
    trigger: 'hover',
    html: true,
    title: function() {
      return $(this).data('type');
    },
    content: function() {
      // Determine the node type
      // TODO: Insert the correct data into the table
      return "\
        <table>\
          <tr>\
            <th>A</th>\
          </tr>\
          <tr>\
            <td>B</td>\
          </tr>\
        </table>";
    }
    //template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title">TITLE!!!!</h3><div class="popover-content"><p>CONTENT!</p></div></div></div>'
  });

});
