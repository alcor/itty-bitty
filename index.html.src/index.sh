#! /bin/bash
terser index.js > index.min.js
terser ../data.js > data.min.js
postcss index.css > index.min.css