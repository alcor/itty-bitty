window.el = function (tagName, attrs, ...children) {
  let l = document.createElement(tagName);
  Object.entries(attrs).forEach(([k,v]) => l[k] = v);
  children.forEach((c) => l.appendChild(typeof c == "string" ? document.createTextNode(c) : c));
  return l;
}

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

class DataURL {
  constructor(url) {
    let match = url.match(dataUrlRE);
    let info = match.groups;
    Object.assign(this, info);
    this.params = info.params ? JSON.parse('{"' + decodeURI(info.params?.substring(1)).replace(/"/g, '\\"').replace(/;/g, '","').replace(/=/g,'":"') + '"}') : {};
    if (this.encoding) this.data = this.data.replace(/=/g,"");
  }

  get href() {
    let urlString = "data:";
    if (this.mediatype) urlString += this.mediatype
    if (this.params) Object.entries(this.params).forEach( e => urlString += `;${e[0]}=${e[1]}`)
    if (this.encoding) urlString += ";" + this.encoding
    urlString += "," + (this.dataPrefix || '') + this.data;
    return urlString;
  }

  get format() {
    return this.params.format || this.encoding;
  }

 decompress = async () => {

    // Decrypt if needed
    if (this.params.cipher) {
      console.log(this.params.cipher, decryptData)
      this.data = await decryptData(this.params.cipher, this.data);
    }

    // Decompress if needed
    if (this.format && (this.format != "base64")) {
      let bytes = base64ToByteArray(this.data);
      this.rawData = await decompressData(bytes, this.format)
      this.data = await dataToBase64(this.rawData);
      delete this.params.format
      this.encoding = BASE64_MARKER
    }

    return this;
  }

  compress = async (format = LZMA_MARKER) => {
    console.log("data", this.data.length, {data:this.data})
    let rawData = await base64ToByteArray(this.data);

    let compressedData = await compressData(rawData, format);
    var base64String = dataToBase64(compressedData);
    this.data = base64String;
    this.params.format = format;
    return this;
  }

}

async function testCompression(rawData) {
  let gz = await compressData(rawData, GZIP_MARKER);
  console.log(gz.length, typeof gz, dataToBase64(gz).length);

  let xz = await compressData(rawData, LZMA_MARKER);
  console.log(xz.length, typeof xz, dataToBase64(xz).length);

  let ungz = await decompressData(gz, GZIP_MARKER);
  let unxz = await decompressData(xz, LZMA_MARKER);
  
  console.log("unzip", ungz == rawData, unxz==rawData,{ungz, unxz,rawData,
    raw: byteArrayToString(rawData).substring(684),
  ungzs: byteArrayToString(ungz).substring(684), 
  unxzs: byteArrayToString(unxz).substring(684)
  }, (byteArrayToString(ungz)) ==  byteArrayToString(unxz))
}

async function compressData(data, encoding = GZIP_MARKER, callback) {
  console.log("compressing with", encoding)
  if (encoding == GZIP_MARKER) {
    return import("/js/gzip/pako.js").then((module) => {
      console.log({gzdata:data})
      return pako.deflate(data, {level:"9"});
    });
  } else if (encoding == BROT_MARKER) {
    
  } else if (encoding == LZMA_MARKER) {
    return new Promise(function(resolve, reject) {
      console.log({xz:data})

      LZMA.compress(data, 9, function(result, error) {
        if (error) reject(error);
        resolve(result);
      });
    });
  } 
}

function stringToByteArray(string) {
  return new TextEncoder().encode(string);
  return Uint8Array.from(string, c => c.charCodeAt(0));
}

function byteArrayToString(bytes) {
  return new TextDecoder().decode(bytes); 
  return String.fromCharCode.apply(null, new Uint8Array(bytes));
}

async function decompressData(data, encoding, callback) {
  if (encoding == GZIP_MARKER) {
    return import("/js/gzip/pako.js").then((module) => {
      let byteArray = pako.inflate(data);
      return byteArray;
    });
  } else if (encoding == BROT_MARKER) {
    return import("/js/brotli/decode.js").then((module) => {
      return module.BrotliDecode(data);
    });
  } else if (encoding == LZMA_MARKER || encoding == LZMA64_MARKER) {
    return new Promise(function(resolve, reject) {
      LZMA.decompress(data, (result, error) => {
        if (error) reject(error);
        resolve(stringToByteArray(result));
      });
    });
  }
}


async function decryptData(cipher, base64) {
  return new Promise((resolve, reject) => {
    loadScript("/js/crypto-js.min.js", () => {
      console.log("decrypting", cipher)
      let pass = prompt("This page is encrypted. What's the passcode?");
      if (!pass) resolve(base64);
    
      let decrypted = CryptoJS[cipher.toUpperCase()].decrypt(base64, pass);
      return resolve(CryptoJS.enc.Base64.stringify(decrypted));
    })
  })
}


function infoForDataURL(url) {
  return new DataURL(url);
}

var BASE64_MARKER = 'base64';
var LZMA64_MARKER = 'bxze64';
var GZIP64_MARKER = 'gzip64';
var BROT64_MARKER = 'brot64';

var BASE_MARKER = 'bs';
var LZMA_MARKER = 'xz';
var GZIP_MARKER = 'gz';
var BROT_MARKER = 'br';

function compressDataURL(dataURL, callback) {
  var base64Index = dataURL.indexOf(BASE64_MARKER);
  var base64 = dataURL.substring(base64Index + BASE64_MARKER.length + 1);
  compressString(base64ToByteArray(base64), LZMA64_MARKER, function(result) {
    callback(dataURL.substring(0, base64Index) + LZMA64_MARKER + "," + result)
  })
}

function base64ToByteArray(base64) {
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

// function base64ToByteArray(base64) {
//   var raw = window.atob(base64);
//   var rawLength = raw.length;
//   var array = new Uint8Array(new ArrayBuffer(rawLength));
//   for(let i = 0; i < rawLength; i++) {
//     array[i] = raw.charCodeAt(i);
//   }
//   return array;
// }

function loadScript(src, callback) {
  let script = el("script", { src });
  script.addEventListener('load', function(e) {
    console.debug("Loaded script", src);
    if (callback) callback(e);
  });
  document.head.appendChild(script);
}

// iMessage incorrectly handles urls with more than 301 sequential non-breakable characters, so we introduce = to prevent this
function escapeStringForIMessage(str) {
  var matches = str.match(/[^\/+=]{1,300}/g);
  if (matches) str = matches.join("=")
  return str;
}

function decryptBase64(cipher, base64, callback) {
  if (!cipher) return callback(base64);

  loadScript("/js/crypto-js.min.js", () => {
    let pass = prompt("This page is encrypted. What's the passcode?");
    if (!pass) return callback(base64);
  
    let decrypted = CryptoJS[cipher.toUpperCase()].decrypt(base64, pass);
    return callback(CryptoJS.enc.Base64.stringify(decrypted));
  })
}

function decompressDataURL(dataURL, preamble, callback) {
  let info = infoForDataURL(dataURL);

  let encoding = info.encoding;
  let encodingIndex = dataURL.indexOf(encoding);

  if (encoding && encoding != "base64") {
    var base64 = dataURL.substring(encodingIndex + LZMA64_MARKER.length + 1);
    base64 = base64.replace("=",""); // TODO: apply this elsewhere;

    decryptBase64(info.params?.cipher, base64, (base64) => {
      let bytes = base64ToByteArray(base64);
      decompressString(bytes, encoding, function(string) {
        stringToData(string, function(data) {
          if (!data) return callback();
          callback(dataURL.substring(0, encodingIndex) + BASE64_MARKER + "," + (preamble || '') + data.split(',')[1], string)
        })
      })
    })
    
  } else {
    callback(dataURL)
  }
}

async function hashString(string, base = 36) {
  const arrayBuffer = await(new TextEncoder().encode(string))
  const hashAsArrayBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const uint8ViewOfHash = new Uint8Array(hashAsArrayBuffer);
  const hashAsHex = Array.from(uint8ViewOfHash).map(b => b.toString(16).padStart(2, '0')).join('');
  if (base == 16) return hashAsHex;

  if (base == 36) {
    const guid = BigInt("0x" + hashAsHex);
    const asBase36 = guid.toString(36).toLowerCase();
    return asBase36;
  }

  const hashAsBase64 = btoa(String.fromCharCode.apply(null, uint8ViewOfHash));
  hashAsBase64.replace(/=/g,'').replace(/[\+\/+]/g, "-").toLowerCase();
  return hashAsBase64; 
}

function compressString(string, encoding = LZMA64_MARKER, callback) {
  if (encoding == LZMA64_MARKER) {
    loadScript("/js/lzma/lzma_worker-min.js", () => {
      LZMA.compress(string, 9, function(result, error) {
        if (error) console.error(error);
        var base64String = window.btoa(String.fromCharCode.apply(null, new Uint8Array(result)));
        return callback(base64String);
      });
    })
  } else if (encoding == BROT64_MARKER) {
    // import("/js/brotli/decode.js").then((module) => {
    //   console.log("module", module)
    //   return callback(module.BrotliDecode(data));
    // });
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


// echo -n 'hello world' | brotli | base64
// DwWAaGVsbG8gd29ybGQD

// echo -n 'hello world' | gzip -9 | base64
// H4sIAPfMmGICA8tIzcnJVyjPL8pJAQCFEUoNCwAAAA==

// echo -n 'hello world' | lzma -9 | base64 
// XQAAAAT//////////wA0GUnujekXiTozYAX3z2T/+3ggAA==



function dataToBase64(data) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(data)));
}

function dataToBase64FR(data) {
  return new Promise((resolve, reject) => {
    if (!data || !data.length) return resolve("");
    
    var fr = new FileReader();
    fr.onload = () => resolve(fr.result.split(',')[1]);
    fr.onerror = reject;
    fr.readAsDataURL(new Blob([data], {encoding:"UTF-8",type:"text/html;charset=UTF-8"}));
  })
}

function dataURLToString(durl) {
  return fetch(durl)
    .then(r => r.blob())
    .then(blob => {
      return new Promise((resolve, reject) => {
        var fr = new FileReader();
        fr.onload = () => resolve(fr.result)
        fr.onerror = reject;
        fr.readAsText(blob);
      })
    })
}


function stringToData(string, callback) {
  if (!string.length) return callback("");
  var a = new FileReader();
  a.onload = function(e) { callback(e.target.result.replace()) }
  a.readAsDataURL(new Blob([string], {encoding:"UTF-8",type:"text/html;charset=UTF-8"}));
}

function dataToString(data, callback) {
  return newDataURLtoBlob(data).then(blob => {
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
  DataURL,
  infoForDataURL,
  stringToData,
  dataToString,
  compressString,
  decompressString,
  compressDataURL,
  decompressDataURL,
  hashString,
  BASE64_MARKER,
  LZMA64_MARKER,
  GZIP64_MARKER,
  BROT64_MARKER,
  BASE_MARKER,
  LZMA_MARKER,
  GZIP_MARKER,
  BROT_MARKER,
};
