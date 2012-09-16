$(document).ready(function() {
  if (!window.Tetuan) window.Tetuan = {};

  Tetuan.SearchResult = Backbone.View.extend({
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
});
