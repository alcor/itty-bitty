# itty.bitty.site

itty.bitty takes html (or other data), compresses it into a URL fragment, and provides a link that can be shared. When it is opened, it inflates that data on the receiver’s side.

Learn more at [about.bitty.site](http://about.bitty.site)

Detailed workings [how.bitty.site](http://how.bitty.site)

## Advanced

**Handcrafted HTML files**

Drag one into the editor to convert it.

**Using Codepen.io (Pro Accounts)**

Paste a codepen URL into the editor. Get started with a [template](https://codepen.io/pen?template=MXgrEr) or look at [some samples](https://codepen.io/collection/XprVQL/). This must be a Pro account to work.
      
**Hosting**

One simple way to host is to [forward a domain](https://support.google.com/domains/answer/4522141?hl=en). Just paste the itty.bitty url in the redirect.

## Generating links programmatically
Encoding (Mac)

```echo -n 'hello world' | lzma -9 | base64 | xargs -0 printf "https://itty.bitty.site/#/%s\n"```

Encoding (Linux)

```echo -n 'hello world' | lzma -9 | base64 -w0 | xargs -0 printf "https://itty.bitty.site/#/%s\n"```

Encoding (Win Git/WSL)

`echo -n 'hello world' | xz --format=lzma -9 | base64 -w0 | printf "https://itty.bitty.site/#/%s\n" "$(cat -)"`

Encoding (Python)

`'https://itty.bitty.site/#/'+base64.b64encode(lzma.compress(bytes("hello world",encoding="utf-8"), format=lzma.FORMAT_ALONE, preset=9)).decode("utf-8")`

Encoding (Node.js)

`'https://itty.bitty.site/#/'+Buffer.from(lzma.compress("Hello World", 9)).toString('base64')`

Decoding (Mac)

`echo -n "[URL]" | sed -E 's/^.*#[^\/]*\/\??//g' | base64 -D | lzma -d `

Decoding (Linux)

`echo -n "[URL]" | sed -E 's/^.*#[^\/]*\/\??//g' | base64 -d | lzma -d`

Decoding (Win Git/WSL)

`echo -n "[URL]" | sed 's/^.*#[^\/]*\///g' | base64 -d | xz --format=lzma -d`  


**Size Limits**

While most sites support 2000 bytes, some can handle more.
Maximum sizes for links in various apps & Browsers (approximate, size in bytes)

| App	 | Max bytes | Notes|
| - | - | - |
| Twitter    | 4,088	|
| Slack	 | 4,000	|
| Discord	 | 4,000	|
| iMessage	 | 4,000	| URLs with more than 300 nonbreaking characters in a row will be split.<br>LZMA compression usually fixes this, but raw data urls may fail. |
| QR Code	 | 2,953	|
| Bitly	 | 2,048	|
| Browser		
| Google Chrome	(win)  | 32,779|
| (mac)  | Lots	| Only shows 10,000 |
| Firefox	 | >64,000	|
| Microsoft IE 11	 | 4,043 |	Only shows 2,083 |
| Microsoft Edge	 | 2,083 |	Anything over 2083 will fail |
| Android	 | 8,192	|
| Safari | 	Lots	| Only shows 5211 |



# IB V.2 features (https://itty.bitty.app)


## Compression formats
IB2 supports Gzip and Brotli compression. Gzip will be used in lieu of lzma if it yields a smaller result. Client side brotli _compression_ is not implemented. Compression type will be inferred from the first few bytes of data if not specified

### brotli
```echo -n 'hello world' | brotli | base64 | xargs -0 printf "https://itty.bitty.app/#/%s\n"```

### gzip
```echo -n 'hello world' | gzip -9 | base64 | xargs -0 printf "https://itty.bitty.app/#/%s\n"```

## Encryption
Encrypted content will prompt for a password before decoding. Encryption type should be specified with ```cipher=\[aes|des|...];```.


```echo -n 'hello world' | gzip -9 | openssl enc -aes-256-cbc | base64 | xargs -0 printf "https://itty.bitty.app//data:text/plain;cipher=aes;gzip64,%s\n"```


## Open Graph metadata
Title, description, and image can be included as path components before the # fragment. 
If present, these will be rendered as the preview data. 

```https://itty.bitty.app/Title_text/Description_text/https://example.com/image.png/#/DATA```

An emoji can be specified in lieu of an image url:
```https://itty.bitty.app/Title_text/Description_text/🤓#/DATA```

**Note: Including this metadata requires serverside rendering - the body of the content will still be rendered clientside.**


## Custom data renderers
Itty bitty app supports custom renderers for structured data. Recipes and bookmarklets are special cased currently, but any renderer can be implemented by specifying a render attribute (render=https://script_url.js;) within the data URL.


### Recipes
Recipes use a ld+json format, which is commonly found on many recipe sites - these can be extracted using the bookmarklet at https://bookmarklet.bitty.site

```#/data:application/ld+json;base64,RECIPE_JSON```

### Bookmarklets
Javascript bookmarklets are displayed with basic instructions for how to add them to your browser :
https://itty.bitty.app/#Show_Alert/javascript:alert('hello')
