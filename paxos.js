$(function() {
  /*
   * jQuery QTIP
   * http://craigsworks.com/projects/qtip/docs/tutorials/
   */

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
});
