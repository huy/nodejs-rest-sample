$(document).ready(function() {

  var container = document.getElementById("jsoneditor");
  var editor = new JSONEditor(container);

  $("#button_edit").click(function () {
    $.ajax({
      url: 'notification/' + $('#id').val(),
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        if(data.status === 'found')
          editor.set(data.result);
        $('#status').html("Retrieve: <b>" + data.status + "</b>");
      }
    });
  });

  $("#button_save").click(function () {
    var data = editor.get();
    $.ajax({
      url: 'notification/' + $('#id').val(),
      type: 'PUT',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(data),
      success: function(data) {
        $('#status').html("Update: <b>" + data.status + "</b>");
      }
    });
  });

});


