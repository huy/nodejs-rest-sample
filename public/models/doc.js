$(document).ready(function() {
  if (!window.Tetuan) window.Tetuan = {};
  if (!Tetuan.models) Tetuan.models ={};

  var Doc = Tetuan.models.Doc = Backbone.Model.extend({
    idAttribute: "_id",
    urlRoot: '/notification',
    parse: function(response) {
      return response.result;
    }
  });

  var DocList = Tetuan.models.DocList = Backbone.Collection.extend({
    model: Doc,
    parse: function(response) {
      if (response.status === 'found') {
        return response.result;
      } else {
        return [];
      }
    }
  });

  Tetuan.models.searchableFields = [
    'name',
    'brand',
    'type',
    'manufacture',
    'localDistributor',
    'localRepresentative',
    'text'
  ]

});
