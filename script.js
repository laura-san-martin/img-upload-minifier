//Function called when the TEST button is clicked
function loadImage() {
    
    //Get the elements and params form the page
    var element = document.getElementById("image-input");
    var maxWidth = document.getElementById("max-width").value;
    var quality = document.getElementById("quality").value / 100;

    //Check if has any image selected
    if (element.files.length > 0) {
        //Read the MIME TYPE from the file
        var mime = element.files[0].type;

        //Create a file reader to read the selected file
        var fileReader = new FileReader();
        
        //This event will be fired when the fileReader read some file
        fileReader.onload = function (event) {

            //Creates a image object that will recieve the readed data from fileReader
            var image = new Image();

            //Event that will fire when the image loads the data
            image.onload = function () {

                //Create a element canvas to render the image in backgorund
                var canvas = document.createElement("canvas");

                //Set the sizes
                if (maxWidth < image.width) {
                    var scaleFactor = maxWidth / image.width;
                    canvas.width = maxWidth;
                    canvas.height = image.height * scaleFactor;
                } else {
                    canvas.width = image.width;
                    canvas.height = image.height;
                }

                //Draw the image on canvas
                var context = canvas.getContext("2d");
                context.drawImage(image, 0, 0, canvas.width, canvas.height);

                //Reduce the image quality and append it in the page body
                context.canvas.toBlob(function (blob) {

                    var newImg = document.createElement('img');
                    var url = URL.createObjectURL(blob);
                    //if you need to save the file from background, save from this url or update the file dialog with this

                    newImg.src = url;
                    document.body.appendChild(newImg);
                }, mime, quality);
            }

            //Load the readed data in the image object
            image.src = event.target.result;
        };
   
        //Read the file from the path provided
        fileReader.readAsDataURL(element.files[0]);
    }
}

//This create a workaround for the method toBlob when the browser doesn't support it
if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function (callback, type, quality) {
            var canvas = this;
            setTimeout(function () {
                var binStr = atob(canvas.toDataURL(type, quality).split(',')[1]),
                    len = binStr.length,
                    arr = new Uint8Array(len);

                for (var i = 0; i < len; i++) {
                    arr[i] = binStr.charCodeAt(i);
                }

                callback(new Blob([arr], { type: type || 'image/png' }));
            });
        }
    });
}