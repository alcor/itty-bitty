#! /bin/bash
cd docs
terser    data.js > data-min.js

cd index.src
terser    index.js > index-min.js
uglifycss index.css > index-min.css

awk '$1 == "@include"{system("cat " $2); next} 1' index.html > ../index.html
