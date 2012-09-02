$(document).ready(function() {
  window.visualSearch = VS.init({
    container  : $('#search_box_container'),
    query      : '',
    unquotable : [
      'text',
      'name',
      'desc',
      'a',
      'b'
    ],
    callbacks  : {
      search : function(query, searchCollection) {
        var $query = $('#search_query');
        $query.stop().animate({opacity : 1}, {duration: 300, queue: false});
        $query.html('<span class="raquo">&raquo;</span> You searched for: <b>' + searchCollection.serialize() + '</b>');
        clearTimeout(window.queryHideDelay);
        window.queryHideDelay = setTimeout(function() {
          $query.animate({
            opacity : 0
          }, {
            duration: 1000,
            queue: false
          });
        }, 2000);
      },
      valueMatches : function(category, searchTerm, callback) {
        switch (category) {
          case 'a':
            callback(['100', '200']);
            break;
          case 'b':
            callback(['world', 'hello world']);
            break;
        }
      },
      facetMatches : function(callback) {
        callback([
          'name', 'desc', 'a', 'b',
        ]);
      }
    }
  });
});
