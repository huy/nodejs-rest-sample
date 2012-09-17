$(document).ready(function() {
  if (!window.Tetuan) window.Tetuan = {};
  if (!Tetuan.views) Tetuan.views ={};

  Tetuan.views.App = Backbone.View.extend({
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
      this.searchResult = new Tetuan.views.SearchResult(this.jsonEditor);

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

          this.searchResult.docList.fetch({
            url:'/notification?' + filter,
            success: function (collection, resp) {
              $('#status').html('fetch: ' + resp.status);
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
      if (!this.searchResult.currentDoc) {
        alert("nothing to save");
        return;
      }
      var edited = this.jsonEditor.get();
      this.searchResult.currentDoc.save(edited, {
        success: function (model, resp) {
          $('#status').html('save: ' + resp.status);
        }
      });
    },
    deleteDoc: function (event) {
      if (!this.searchResult.currentDoc) {
        alert("nothing to delete");
        return;
      }
      this.searchResult.currentDoc.destroy({
        success: function (model, resp) {
          $('#status').html('delete: ' + resp.status);
        }
      });
    },
    addDoc: function (event) {
      var edited = this.jsonEditor.get() || {};
      delete edited._id;

      this.searchResult.docList.create(edited, {
        success: function (model, resp) {
          $('#status').html('add: ' + resp.status);
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
});
