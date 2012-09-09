$(document).ready(function() {
  var container = $('#jsoneditor');
  var editor = new JSONEditor(container.get(0));

  $("#button_save").click(function () {
    var data = editor.get();
    $.ajax({
      url: 'notification/' + data._id,
      type: 'PUT',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(data),
      success: function(data) {
        $('#status').html("Update: <b>" + data.status + "</b>");
      }
    });
  });

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
        var filter = searchCollection.map(function (facet) { 
          return facet.get('category') + '=' + facet.get('value');}).join('&');

        $.ajax({
          url: 'notification?' + filter,
          type: 'GET',
          dataType: 'json',
          success: function(data) {
            var result;
            if (data.status === 'found' || data.status == 'notfound') {
              result = _.map(data.result, function (doc){
                return '<a href="/notification/' + doc._id + '" class="link_id">' + doc._id + '</a>';
              }).join('<br/>'); 
              if (result) {
                $('#search_result').html(result);
              } else {
                $('#search_result').html('&nbsp;');
              }
            }
            $('#status').html('Search: <b>' + data.status + '</b>');
            $('a.link_id').click(function (event) {
              $.ajax({
                 url: $(this).attr('href'),
                 type: 'GET',
                 dataType: 'json',
                 success: function(data) {
                   if(data.status === 'found')
                     editor.set(data.result);
                   $('#status').html("Retrieve: <b>" + data.status + "</b>");
                 }
              });
              event.preventDefault();
            });
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
