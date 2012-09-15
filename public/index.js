$(document).ready(function() {
  var SearchResult = Backbone.View.extend({
    id: "search_result",
    tagName: "div",
    events: {
      "click a.link_id": "updateEditor"
    },
    initialize: function (editor, collection) {
      this.editor = editor;
      this.collection = collection;
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
        $(this.el).html(result);
      else
        $(this.el).html('&nbsp;');
      return this;
    }
  });

  var AppView = Backbone.View.extend({
    id: "app",
    tagName: "div",
    template: _.template($('#app_template').html()),

    events: {
      "click #button_save": "saveDoc",
      "click #button_delete": "deleteDoc",
      "click #button_add": "addDoc"
    },
    initialize: function () {
      this.collection = [];
      this.jsonEditor = new JSONEditor(this.make('div', {'id': 'json_editor'}));

      searchCallbacks = {
        facetMatches: function(callback) {
          callback([
            'name', 'desc', 'a', 'b',
          ]);
        },
        valueMatches: function(category, searchTerm, callback) {
          switch (category) {
            case 'a':
              callback(['100', '200']);
              break;
            case 'b':
              callback(['world', 'hello world']);
              break;
          }
        },
        search: _.bind(function(query, searchCollection) {
          var filter = searchCollection.map(function (facet) {
            return facet.get('category') + '=' + facet.get('value');}).join('&');
          $.ajax({
            url: 'notification?' + filter,
            type: 'GET',
            dataType: 'json',
            context: this,
            success: function(data) {
              var result;
              if (data.status === 'found' || data.status === 'notfound') {
                if (data.result) {
                  this.collection = data.result;
                } else {
                  this.collection = [];
                }
                $('#sidebar').html(new SearchResult(this.jsonEditor, this.collection).render().el);
                this.jsonEditor.set({});
              }  
              $('#status').html('Search: <b>' + data.status + '</b>');
            }  
          });
        }, this)
      };

      this.searchBox = new VS.VisualSearch({
        query: '',
        unquotable: [
          'name',
          'desc',
          'a'
        ],
        callbacks: searchCallbacks,
      }).searchBox;

      $("#app_container").html(this.render().el);

    },
    saveDoc: function (event) {
      var edited = this.jsonEditor.get();
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
      var deleted = this.jsonEditor.get();
      $.ajax({
        url: 'notification/' + deleted._id,
        type: 'DELETE',
        dataType: 'json',
        context: this,
        success: function(data) {
          this.collection = _.reject(this.collection, function (doc) {
            return (doc._id === deleted._id);
          });
          $('#sidebar').html(new SearchResult(this.jsonEditor, this.collection).render().el);

          $('#status').html("Delete: <b>" + data.status + "</b>");
          this.jsonEditor.set({});
        }
      });
    },
    addDoc: function (event) {
      var edited = this.jsonEditor.get();
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
            this.collection.unshift(added);
            $('#sidebar').html(new SearchResult(this.jsonEditor, this.collection).render().el);
            this.jsonEditor.set(added);
          }
          $('#status').html("Add: <b>" + data.status + "</b>");
        }
      });
    },
    render: function () {
      $(this.el).html(this.template());
      this.$('#search_box').html(this.searchBox.render().el);
      this.searchBox.renderFacets();
      this.$('#json_editor').html(this.jsonEditor.container);
      return this;
    }
  });

  var appView = new AppView;
});
