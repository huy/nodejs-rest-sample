$(document).ready(function() {
  if (!window.Tetuan) window.Tetuan = {};
  if (!Tetuan.views) Tetuan.views ={};

  Tetuan.views.SearchResult = Backbone.View.extend({
    id: "search_result",
    tagName: "div",
    events: {
      "click a.link_id": "updateEditor"
    },
    initialize: function (editor) {
      this.editor = editor;
      this.docList = new Tetuan.models.DocList;
      this.currentDoc = undefined;

      this.docList.bind('all', _.bind(this.render, this));
    },
    isSaveRequired: function() {
      return this.currentDoc && !_.isEqual(this.currentDoc.toJSON(), this.editor.get());
    },
    updateEditor: function (event){
      event.preventDefault();
      if (this.isSaveRequired()) {
        alert("save edited doc before moving to other");
        return;
      }
      this.currentDoc = this.docList.find(function (doc) {
        return (doc.id === $(event.target).text());
      });
      this.editor.set(this.currentDoc.toJSON());
    },
    render: function () {
      var result = this.docList.map(function (doc){
        return '<a href="#" class="link_id">' + doc.id + '</a>';
      }).join('<br/>'); 
      if (result){
        $(this.el).html(result);
      }
      else
        $(this.el).html('&nbsp;');
      return this;
    }
  });
});
