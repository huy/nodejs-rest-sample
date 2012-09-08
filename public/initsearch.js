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
        $.ajax({
          url: 'notification',
          type: 'GET',
          dataType: 'json',
          success: function(data) {
            var $status = $('#status');
            var $search_result = $('#search_result');
            var result;
            if (data.status === 'found') {
              result = _.map(data.result, function (doc){
                return doc._id;
              }).join('<br/>'); 
              $search_result.html(result);
            }
            $status.html('Search: <b>' + data.status + '</b>');
          }
        });
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
