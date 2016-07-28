/**
 * Created by waouyang on 15/11/6.
 */
//Download from http://unicode.org/emoji/charts/full-emoji-list.html
function fake_click(obj) {
    var ev = document.createEvent("MouseEvents");
    ev.initEvent("click", true, false);
    obj.dispatchEvent(ev);
}

function export_raw(name, data) {
    var urlObject = window.URL || window.webkitURL || window;
    var export_blob = new Blob([data]);

    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    save_link.href = urlObject.createObjectURL(export_blob);
    save_link.download = name;
    fake_click(save_link);
}
function downloadImage(src, imageFileName) {
    // atob to base64_decode the data-URI
    var image_data = atob(src.split(',')[1]);
    // Use typed arrays to convert the binary data to a Blob
    var arrayBuffer = new ArrayBuffer(image_data.length);
    var view = new Uint8Array(arrayBuffer);
    for (var i = 0; i < image_data.length; i++) {
        view[i] = image_data.charCodeAt(i) & 0xff;
    }
    var blob;
    try {
        // This is the recommended method:
        blob = new Blob([arrayBuffer], {type: 'application/octet-stream'});
    } catch (e) {
        // The BlobBuilder API has been deprecated in favour of Blob, but older
        // browsers don't know about the Blob constructor
        // IE10 also supports BlobBuilder, but since the `Blob` constructor
        //  also works, there's no need to add `MSBlobBuilder`.
        var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder);
        bb.append(arrayBuffer);
        blob = bb.getBlob('application/octet-stream'); // <-- Here's the Blob
    }
    export_raw(imageFileName, blob);
}

function downloadImageBySrc(src, fileName) {
    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    save_link.href = src;
    save_link.download = fileName;
    fake_click(save_link);
}
function downloadImages() {
    var trArray = document.querySelectorAll("tr");
    var trLen = trArray.length;
    console.log('Total Image Count = ' + trLen);
    var fileNamePrefix = "emoji_";
    var tr, codeTd, codeNode, code, imageFileName, imageTd, imageNode, imageSrc, emojiCodeStr = '';
    var i = 1;
    var count = 0;
    var timer = setInterval(function () {
        if (i == trLen) {
            //downloadEmojiCode(emojiCodeStr); //download code
            console.log('count = ', count);
            clearInterval(timer);
            return;
        }
        tr = trArray[i];
        codeTd = tr.children[1];
        codeNode = codeTd.children[0];
        code = codeNode.name;
        imageFileName = fileNamePrefix + code + ".png";
        imageTd = tr.children[4];
        imageNode = imageTd.children[0];
        if (imageNode && imageNode.tagName.toLocaleLowerCase() == 'img') {
            count++;
            imageSrc = imageNode.src;
            //downloadImage(imageSrc, imageFileName);       //Use this method or downloadImageBySrc
            //downloadImageBySrc(imageSrc, imageFileName);    //
            //emojiCodeStr += '"' + code + '",' + '\n';

            //console.log("Index = " + i + ", code = " + code);
        }
        i++
    }, 0);

}

function downloadEmojiCode(emojiCodeStr) {
    var arrayBuffer = new ArrayBuffer(emojiCodeStr.length);
    var view = new Uint8Array(arrayBuffer);
    for (var i = 0; i < emojiCodeStr.length; i++) {
        view[i] = emojiCodeStr.charCodeAt(i) & 0xff;
    }
    var blob;
    try {
        // This is the recommended method:
        blob = new Blob([arrayBuffer], {type: 'application/octet-stream'});
    } catch (e) {
        // The BlobBuilder API has been deprecated in favour of Blob, but older
        // browsers don't know about the Blob constructor
        // IE10 also supports BlobBuilder, but since the `Blob` constructor
        //  also works, there's no need to add `MSBlobBuilder`.
        var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder);
        bb.append(arrayBuffer);
        blob = bb.getBlob('application/octet-stream');
    }
    export_raw("emojiCode.txt", blob);
}

downloadImages();