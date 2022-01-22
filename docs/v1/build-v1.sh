#! /bin/bash
terser    data.js > data-min.js
terser    index.js > index-min.js
uglifycss index.css > index-min.css

awk '$1 == "@include"{system("cat " $2); next} 1' index.src.html > index.html
