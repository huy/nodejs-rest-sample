$(document).ready(function() {
  if (!window.Tetuan) window.Tetuan = {};
  if (!Tetuan.models) Tetuan.models ={};

  Tetuan.models.Doc = Backbone.View.extend({
    idAttribute: "_id"
  });

  Tetuan.models.DocList = Backbone.Collection.extend({
    model: Tetuan.models.Doc,
    url: '/notfication'
  });

});
