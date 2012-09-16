$(document).ready(function() {
  var SearchResult = Backbone.View.extend({
    id: "search_result",
    tagName: "div",
    events: {
      "click a.link_id": "updateEditor"
    },
    initialize: function (editor) {
      this.editor = editor;
      this.collection = [];
      this.currentDoc = undefined;
     
    },
    isSaveRequired: function() {
      return this.currentDoc && !_.isEqual(this.currentDoc, this.editor.get());
    },
    updateEditor: function (event){
      event.preventDefault();
      if (this.isSaveRequired()) {
        alert("save edited doc before moving to other");
        return;
      }
      $.ajax({
         url: '/notification/' + $(event.target).text(),
         type: 'GET',
         dataType: 'json',
         context: this,
         success: function(data) {
           if(data.status === 'found') {
             this.currentDoc = data.result;
             this.editor.set(data.result);
           }
           $('#status').html("Retrieve: <b>" + data.status + "</b>");
         }
      });
    },
    render: function () {
      var result = _.map(this.collection, function (doc){
        return '<a href="#" class="link_id">' + doc._id + '</a>';
      }).join('<br/>'); 
      if (result){
        $(this.el).html(result);
      }
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
      this.jsonEditor = new JSONEditor(this.make('div', {'id': 'json_editor'}));
      this.searchResult = new SearchResult(this.jsonEditor);

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

          if (this.searchResult.isSaveRequired()){
            alert("save edited doc before searching");
            return;
          }
         
          $.ajax({
            url: 'notification?' + filter,
            type: 'GET',
            dataType: 'json',
            context: this,
            success: function(data) {
              var result;
              if (data.status === 'found' || data.status === 'notfound') {
                if (data.result) {
                  this.searchResult.collection = data.result;
                } else {
                  this.searchResult.collection = [];
                }
                this.searchResult.currentDoc = undefined;

                $(this.searchResult.el).detach(); // this will result in faster screen update
                this.$('#sidebar').html(this.searchResult.render().el);

                this.jsonEditor.clear();
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
        context: this,
        dataType: 'json',
        data: JSON.stringify(edited),
        success: function(data) {
          this.searchResult.currentDoc = edited;
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
          this.searchResult.collection = _.reject(this.searchResult.collection, function (doc) {
            return (doc._id === deleted._id);
          });
          this.searchResult.currentDoc = undefined;
          this.searchResult.render();

          $('#status').html("Delete: <b>" + data.status + "</b>");
          this.jsonEditor.clear();
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
            this.searchResult.collection.unshift(added);
            this.searchResult.currentDoc = added;
            this.jsonEditor.set(added);

            this.searchResult.render();
          }
          $('#status').html("Add: <b>" + data.status + "</b>");
        }
      });
    },
    render: function () {
      $(this.el).html(this.template());
      this.$('#sidebar').html(this.searchResult.render().el);
      this.$('#search_box').html(this.searchBox.render().el);
      this.searchBox.renderFacets();
      this.$('#json_editor').html(this.jsonEditor.container);
      return this;
    }
  });

  var appView = new AppView;
});
