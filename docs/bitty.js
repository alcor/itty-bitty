const dataUrlRE =
/^data:(?<mediatype>(?<type>[a-z]+)\/(?<subtype>[a-z+]+))?(?<params>(?:;[^;,]+=[^;,]+)*)?(?:;(?<encoding>\w+64))?,(?<data>.*)$/
///^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;

// dataurl    := "data:" [ mediatype ] [ ";base64" ] "," data
// mediatype  := [ type "/" subtype ] *( ";" parameter )
// data       := *urlchar
// parameter  := attribute "=" value

// charset=US-ASCII
// encode=brotli
// cipher=aes
// render=recipe

// Base 64 characters:    A-Z a-z 0-9 + / =
// Fragment characters:   A-Z a-z 0-9 + / =
//                        ? : @ - . _ ~ ! $ & ' ( ) * , ;       and kinda (#)

function infoForDataURL(url) {
  let match = url.match(dataUrlRE);
  let info = match.groups;
  // info.params = new URLSearchParams(info?.groups.attrs?.substring(1).replace(/;/g, "&"));
  info.params = info.params ? JSON.parse('{"' + decodeURI(info.params?.substring(1)).replace(/"/g, '\\"').replace(/;/g, '","').replace(/=/g,'":"') + '"}') : info.params;
  return info;
}

var BASE64_MARKER = 'base64';
var LZMA64_MARKER = 'bxze64';
var GZIP64_MARKER = 'gzip64';
var BROT64_MARKER = 'brot64';

function compressDataURL(dataURL, callback) {
  var base64Index = dataURL.indexOf(BASE64_MARKER);
  var base64 = dataURL.substring(base64Index + BASE64_MARKER.length + 1);
  compressString(base64ToByteArray(base64), LZMA64_MARKER, function(result) {
    callback(dataURL.substring(0, base64Index) + LZMA64_MARKER + "," + result)
  })
}

function base64ToByteArray(base64) {
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));
  for(let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}



function decompressDataURL(dataURL, preamble, callback) {
  let info = infoForDataURL(dataURL);

  let encoding = info.encoding;
  let encodingIndex = dataURL.indexOf(encoding);

  if (encoding) {
    var base64 = dataURL.substring(encodingIndex + LZMA64_MARKER.length + 1);
    base64 = base64.replace("-",""); // TODO: apply this elsewhere;

    let cipher;
    if (cipher = info.params?.cipher) {
      let pass = prompt("Passphrase?");
      let decrypted = CryptoJS[cipher.toUpperCase()].decrypt(base64, pass);
      base64 = CryptoJS.enc.Base64.stringify(decrypted)
    }

    let bytes = base64ToByteArray(base64);
    decompressString(bytes, encoding, function(string) {
      stringToData(string, function(data) {
        if (!data) return callback();
        callback(dataURL.substring(0, encodingIndex) + BASE64_MARKER + "," + (preamble || '') + data.split(',')[1], string)
      })
    })
  } else {
    callback(dataURL)
  }
}

function compressString(string, encoding = LZMA64_MARKER, callback) {
  if (encoding == LZMA64_MARKER) {
    LZMA.compress(string, 9, function(result, error) {
      if (error) console.error(error);
      var base64String = window.btoa(String.fromCharCode.apply(null, new Uint8Array(result)));
      return callback(base64String);
    });
  } else if (encoding == BROT64_MARKER) {
    import("/js/brotli/decode.js").then((module) => {
      console.log("module", module)
      return callback(module.BrotliDecode(data));
    });
  } else if (encoding == GZIP64_MARKER) {
    import("/js/gzip/pako.js").then((module) => {
      let result = pako.deflate(string, {level:"9"});
      var base64String = window.btoa(String.fromCharCode.apply(null, new Uint8Array(result)));
      return callback(base64String);
    });
  }
}

function decompressString(data, encoding, callback) {
  if (encoding == LZMA64_MARKER) {
    LZMA.decompress(data, function(result, error) {
      if (!(typeof result === 'string')) result = new Uint8Array(result)
      if (error) console.error(error);
      callback(result);
    });
  } else if (encoding == BROT64_MARKER) {
    import("/js/brotli/decode.js").then((module) => {
      console.log("module", module)
      return callback(module.BrotliDecode(data));
    });
  } else if (encoding == GZIP64_MARKER) {
    import("/js/gzip/pako.js").then((module) => {
      let byteArray = pako.inflate(data);
      return callback(byteArray);
    });
  }
}

function stringToData(string, callback) {
  if (!string.length) return callback("");
  var a = new FileReader();
  a.onload = function(e) { callback(e.target.result.replace()) }
  a.readAsDataURL(new Blob([string], {encoding:"UTF-8",type:"text/html;charset=UTF-8"}));
}

function dataToString(data, callback) {
  newDataURLtoBlob(data).then(blob => {
    var reader = new FileReader();
    reader.onload = function(e) { callback(reader.result) }
    reader.readAsText(blob);
  })
}

function newDataURLtoBlob(dataURL) {
  return fetch(dataURL).then(r => r.blob());
}

function dataURLtoBlob(dataURL) {
  var byteString = window.atob(dataURL.split(',')[1]);
  var mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  var arrayBuffer = new ArrayBuffer(byteString.length);
  var _ia = new Uint8Array(arrayBuffer);
  for (var i = 0; i < byteString.length; i++) {
      _ia[i] = byteString.charCodeAt(i);
  }
  var dataView = new DataView(arrayBuffer);
  var blob = new Blob([dataView.buffer], { type: mimeString });
  return blob;
}



export {
  infoForDataURL,
  stringToData,
  dataToString,
  compressString,
  decompressString,
  compressDataURL,
  decompressDataURL,
  BASE64_MARKER,
  LZMA64_MARKER,
  GZIP64_MARKER,
  BROT64_MARKER,
};
