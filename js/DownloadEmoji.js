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
  save_link.click();
  //   fake_click(save_link);
}
function downloadImage(src, imageFileName) {
  // atob to base64_decode the data-URI
  var image_data = atob(src.split(",")[1]);
  // Use typed arrays to convert the binary data to a Blob
  var arrayBuffer = new ArrayBuffer(image_data.length);
  var view = new Uint8Array(arrayBuffer);
  for (var i = 0; i < image_data.length; i++) {
    view[i] = image_data.charCodeAt(i) & 0xff;
  }
  var blob;
  try {
    // This is the recommended method:
    blob = new Blob([arrayBuffer], { type: "application/octet-stream" });
  } catch (e) {
    // The BlobBuilder API has been deprecated in favour of Blob, but older
    // browsers don't know about the Blob constructor
    // IE10 also supports BlobBuilder, but since the `Blob` constructor
    //  also works, there's no need to add `MSBlobBuilder`.
    var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder)();
    bb.append(arrayBuffer);
    blob = bb.getBlob("application/octet-stream"); // <-- Here's the Blob
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
  console.log("Total Image Count = " + trLen);
  var emojiCodeStr = "";
  var strArray = [];
  var i = 1;
  var count = 0;
  downloadSingleEmoji(trArray, i, trLen, emojiCodeStr, count, strArray);
  return;
}

function downloadSingleEmoji(trArray, i, trLen, emojiCodeStr, count, strArray) {
  if (i == trLen) {
    console.log("image count: ", count);
    downloadEmojiCode(strArray); //download code
    return;
  }
  const tr = trArray[i];
  const childrenCount = tr.children.length;
  if (childrenCount < 3) {
    i++;
    downloadSingleEmoji(trArray, i, trLen, emojiCodeStr, count, strArray);
    return;
  }
  const codeTd = tr.children[1];
  const codeNode = codeTd.children[0];
  const code = codeNode.name;
  const imageFileName = "emoji_" + code + ".png";
  const imageTd = tr.children[3];
  const imageNode = imageTd.children[0];
  if (imageNode && imageNode.tagName.toLocaleLowerCase() == "img") {
    const imageSrc = imageNode.src;
    count++;
    // downloadImage(imageSrc, imageFileName); //Use this method or downloadImageBySrc
    // downloadImageBySrc(imageSrc, imageFileName); //
    const unicodeData = getUnicodeData(code);
    const codePointArray = unicodeData[0];
    const unicodeStrArray = unicodeData[1];
    // console.log("unicodeStrArray: ", unicodeStrArray);
    const codeStr = JSON.stringify(unicodeStrArray).replace(/\\\\/g, "\\");
    const unicodeStr = `"${code}": ${codeStr},\n`;

    strArray.push({
      codePointArray,
      unicodeStr,
    });

    //console.log("Index = " + i + ", code = " + code);
  }
  i++;
  setTimeout(() => {
    downloadSingleEmoji(trArray, i, trLen, emojiCodeStr, count, strArray);
  }, 0);
}

function getUnicodeData(code) {
  const codeArray = code.split("_");
  let unicodeStr = "";
  let charLen = 0;
  const codePointArray = [];
  for (const item of codeArray) {
    const codePoint = parseInt(item, 16);
    codePointArray.push(codePoint);
    const str = String.fromCodePoint(codePoint);
    const len = str.length;
    charLen += len;
    for (let i = 0; i < len; i++) {
      const char = str.charCodeAt(i).toString(16).padStart(4, "0");

      unicodeStr += "\\u" + char.toUpperCase();
    }
  }
  const unicodeStrArray = [unicodeStr];
  if (charLen == 1) {
    unicodeStr += "\\uFE0F";
    unicodeStrArray.unshift(unicodeStr);
  }

  return [codePointArray, unicodeStrArray];
}

function sortFunc(item1, item2) {
  const codePointArray1 = item1.codePointArray;
  const codePointArray2 = item2.codePointArray;
  if (codePointArray1.length < codePointArray2.length) {
    return -1;
  } else if (codePointArray1.length > codePointArray2.length) {
    return 1;
  } else {
    const len = codePointArray1.length;
    for (let i = 0; i < len; i++) {
      if (codePointArray1[i] < codePointArray2[i]) {
        return -1;
      } else if (codePointArray1[i] > codePointArray2[i]) {
        return 1;
      }
    }
    return 0;
  }
}

function downloadEmojiCode(strArray) {
  strArray.sort(sortFunc);
  let emojiCodeStr = "";
  for (const item of strArray) {
    emojiCodeStr += item.unicodeStr;
  }
  var arrayBuffer = new ArrayBuffer(emojiCodeStr.length);
  var view = new Uint8Array(arrayBuffer);
  for (var i = 0; i < emojiCodeStr.length; i++) {
    view[i] = emojiCodeStr.charCodeAt(i) & 0xff;
  }
  var blob;
  try {
    // This is the recommended method:
    blob = new Blob([arrayBuffer], { type: "application/octet-stream" });
  } catch (e) {
    // The BlobBuilder API has been deprecated in favour of Blob, but older
    // browsers don't know about the Blob constructor
    // IE10 also supports BlobBuilder, but since the `Blob` constructor
    //  also works, there's no need to add `MSBlobBuilder`.
    var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder)();
    bb.append(arrayBuffer);
    blob = bb.getBlob("application/octet-stream");
  }
  export_raw("emojiCode.txt", blob);
}

downloadImages();
