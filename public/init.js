$(document).ready(function() {
  var SearchResult = Backbone.View.extend({
    el: $('#search_result'),
    events: {
      "click a.link_id": "updateEditor"
    },
    initialize: function (editor) {
      this.editor = editor;
      this.collection = [];
    },
    updateEditor: function (event){
      event.preventDefault();
      $.ajax({
         url: $(event.target).attr('href'),
         type: 'GET',
         dataType: 'json',
         context: this,
         success: function(data) {
           if(data.status === 'found')
             this.editor.set(data.result);
           $('#status').html("Retrieve: <b>" + data.status + "</b>");
         }
      });
    },
    render: function () {
      var result = _.map(this.collection, function (doc){
        return '<a href="/notification/' + doc._id + '" class="link_id">' + doc._id + '</a>';
      }).join('<br/>'); 
      if (result)
        this.el.html(result);
      else
        this.el.html('&nbsp;');
    }
  });

  var App = Backbone.View.extend({
    el: $('#app'),

    events: {
      "click #button_save": "saveDoc",
      "click #button_delete": "deleteDoc",
      "click #button_add": "addDoc"
    },
    initialize: function () {
      this.editor = new JSONEditor($('#jsoneditor').get(0));
      this.searchResult = new SearchResult(this.editor);
      this.initVisualSearch({editor: this.editor, searchResult: this.searchResult});
    },
    saveDoc: function (event) {
      var edited = this.editor.get();
      $.ajax({
        url: 'notification/' + edited._id,
        type: 'PUT',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(edited),
        success: function(data) {
          $('#status').html("Save: <b>" + data.status + "</b>");
        }
      });
    },
    deleteDoc: function (event) {
      var deleted = this.editor.get();
      $.ajax({
        url: 'notification/' + deleted._id,
        type: 'DELETE',
        dataType: 'json',
        context: this,
        success: function(data) {
          this.searchResult.collection = _.reject(this.searchResult.collection, function (doc) {
            return (doc._id === deleted._id);
          });
          this.searchResult.render();

          $('#status').html("Delete: <b>" + data.status + "</b>");
          this.editor.set({});
        }
      });
    },
    addDoc: function (event) {
      var edited = this.editor.get();
      delete edited._id;
      $.ajax({
        url: 'notification',
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(edited),
        context: this,
        success: function(data) {
          var added;
          if( data.status === 'ok' ){
            added = data.result[0];
            this.searchResult.collection.unshift(added);
            this.searchResult.render();
            this.editor.set(added);
          }
          $('#status').html("Add: <b>" + data.status + "</b>");
        }
      });
    },
    initVisualSearch: function (context) {
      VS.init({
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
                if (data.status === 'found' || data.status === 'notfound') {
                  if (data.result) {
                    context.searchResult.collection = data.result;
                  } else {
                    context.searchResult.collection = [];
                  }
                  context.searchResult.render();
                  context.editor.set({});
                }   
                $('#status').html('Search: <b>' + data.status + '</b>');
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
    },
    render: function () {}
  });

  var app = new App;
});
