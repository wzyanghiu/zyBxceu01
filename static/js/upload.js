$('#btnInsertPic').on('hide.bs.modal', function() 
{
    document.getElementById('id_upload_name').value="";
});


$('.upload-btn').on('click', function ()
{
    $('#upload-input').click();
    //$('.progress-bar').text('0%');
    //$('.progress-bar').width('0%');
});

$('#upload-input').on('change', function()
{
    var files = $(this).get(0).files;
    var strFiles = "";

    if (files.length > 0)
    {
        // create a FormData object which will be sent as the data payload in the
        // AJAX request
        var formData = new FormData();

        // loop through all the selected files and add them to the formData object
        for (var i = 0; i < files.length; i++) {
        var file = files[i];
        strFiles = strFiles + file.name + "; "
        // add the files to formData object for the data payload
        formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('upload successful!\n' + data);
          var labFileName = document.getElementById('id_upload_name');
          labFileName.value = strFiles;
          document.getElementById('id_upload_url').value = data;
      },
      xhr: function() 
      {
          // create an XMLHttpRequest
          var xhr = new XMLHttpRequest();

/*
          // listen to the 'progress' event
          xhr.upload.addEventListener('progress', function(evt) 
          {

              if (evt.lengthComputable) 
              {
                  // calculate the percentage of upload completed
                  var percentComplete = evt.loaded / evt.total;
                  percentComplete = parseInt(percentComplete * 100);

                  // update the Bootstrap progress bar with the new percentage
                  $('.progress-bar').text(percentComplete + '%');
                  $('.progress-bar').width(percentComplete + '%');

                  // once the upload reaches 100%, set the progress bar text to done
                  if (percentComplete === 100) {
                  $('.progress-bar').html('Done');
              }
          }
      }, false);
//*/
          return xhr;
      }
    });
  }
});


$('#upload-input').on('fileuploaded', function(event, data, previewId, index)
{
    alert("fileuploaded");
});

function CopyToClipboard () 
{
    var input = document.getElementById ("id_upload_url");
    var textToClipboard = input.value;
    
    var success = true;
    if (window.clipboardData) { // Internet Explorer
        window.clipboardData.setData ("Text", textToClipboard);
    }
    else {
        // create a temporary element for the execCommand method
        var forExecElement = CreateElementForExecCommand (textToClipboard);

        /* Select the contents of the element 
            (the execCommand for 'copy' method works on the selection) */
        SelectContent (forExecElement);

        var supported = true;

        // UniversalXPConnect privilege is required for clipboard access in Firefox
        try {
            if (window.netscape && netscape.security) {
                netscape.security.PrivilegeManager.enablePrivilege ("UniversalXPConnect");
            }

            // Copy the selected content to the clipboard
            // Works in Firefox and in Safari before version 5
            success = document.execCommand ("copy", false, null);
        }
        catch (e) {
            success = false;
        }
        
        // remove the temporary element
        document.body.removeChild (forExecElement);
    }

    if (success) {
        alert ("The text is on the clipboard, try to paste it!");
    }
    else {
        alert ("Your browser doesn't allow clipboard access!");
    }
}

function CreateElementForExecCommand (textToClipboard) {
    var forExecElement = document.createElement ("div");
        // place outside the visible area
    forExecElement.style.position = "absolute";
    forExecElement.style.left = "-10000px";
    forExecElement.style.top = "-10000px";
        // write the necessary text into the element and append to the document
    forExecElement.textContent = textToClipboard;
    document.body.appendChild (forExecElement);
        // the contentEditable mode is necessary for the  execCommand method in Firefox
    forExecElement.contentEditable = true;

    return forExecElement;
}

function SelectContent (element) {
        // first create a range
    var rangeToSelect = document.createRange ();
    rangeToSelect.selectNodeContents (element);

        // select the contents
    var selection = window.getSelection ();
    selection.removeAllRanges ();
    selection.addRange (rangeToSelect);
}