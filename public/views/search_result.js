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
      this.docList.bind('reset', _.bind(this.clearCurrentDoc, this));
      this.docList.bind('destroy', _.bind(this.clearCurrentDoc, this));
      this.docList.bind('add', _.bind(this.setCurrentDoc, this));

    },
    clearCurrentDoc: function(list) {
      this.currentDoc = undefined;
      this.editor.clear();
    },
    setCurrentDoc: function(doc) {
      this.currentDoc = doc;
      this.editor.set(doc.toJSON());
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
        return (doc.id === $(event.target).data('id'));
      });
      this.editor.set(this.currentDoc.toJSON());
      this.render();
    },
    render: function () {
      var result = this.docList.map(function (doc){
        var bgColor = 'white';
        if (this.currentDoc && doc.id === this.currentDoc.id){
          bgColor = '#D5DDF6';
        }
           
        return '<a href="#" class="link_id" data-id="' + 
          doc.id + '" style="background:' + bgColor + ';">' + 
          doc.get('name') + 
          '</a>' +
          '<p>' +
          doc.get('brand')+
          '</p>';
      }, this).join(''); 
      if (result){
        $(this.el).html(result);
      }
      else
        $(this.el).html('&nbsp;');
      return this;
    }
  });
});
