var BASE64_MARKER = ';base64,';
var LZMA64_MARKER = ';bxze64,';

function compressDataURI(dataURI, callback) {
  var base64Index = dataURI.indexOf(BASE64_MARKER);
  var base64 = dataURI.substring(base64Index + BASE64_MARKER.length);
  stringToZip(base64ToByteArray(base64), function(result) {
    callback(dataURI.substring(0, base64Index) + LZMA64_MARKER + result)    
  })
}

function base64ToByteArray(base64) {
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));
  for(i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

function stringToZip(string, callback) {
  LZMA.compress(string, 9, function(result, error) {
    if (error) console.error(error);
    var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(result)));
    return callback(base64String);
  });
}

function decompressDataURI(dataURI, preamble, callback) {
  var base64Index = dataURI.indexOf(LZMA64_MARKER);
  if (base64Index > 0) {
    var base64 = dataURI.substring(base64Index + LZMA64_MARKER.length);
    zipToString(base64, function(result) {
      stringToData(result, function(data) {
        if (!data) return callback(undefined);
        callback(dataURI.substring(0, base64Index) + BASE64_MARKER + (preamble || '') + data.split(',')[1])     
      })
    })
  } else {
    callback(dataURI)
  }
}

function zipToString(data, callback) {
  var array = base64ToByteArray(data); 
  LZMA.decompress(array, function(result, error) {
    if (!(typeof result === 'string')) result = new Uint8Array(result)
    if (error) console.error(error);
    callback(result);
  });
}

function stringToData(string, callback) {
  if (!string.length) return callback("");
  var a = new FileReader();
  a.onload = function(e) { callback(e.target.result.replace()) }
  a.readAsDataURL(new Blob([string], {encoding:"UTF-8",type:"text/html;charset=UTF-8"}));
}

function dataToString(data, callback) {
  var blob = dataURItoBlob(data)
  var reader = new FileReader();
  reader.onload = function(e) { callback(reader.result) }
  reader.readAsText(blob);
}

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  var arrayBuffer = new ArrayBuffer(byteString.length);
  var _ia = new Uint8Array(arrayBuffer);
  for (var i = 0; i < byteString.length; i++) {
      _ia[i] = byteString.charCodeAt(i);
  }
  var dataView = new DataView(arrayBuffer);
  var blob = new Blob([dataView.buffer], { type: mimeString });
  return blob;
}
