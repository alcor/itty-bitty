#! node

const { execSync } = require("child_process");
const fs = require('fs');

function embedInlines(src, dest) {
  try {
    let data = fs.readFileSync(src, 'utf8');
    data = data.replace(/src="\/?(.*)" inline>/g, (g, h) => {
      return `>`  + execSync(`terser ${h}`)
    })
    data = data.replace(/<link rel="stylesheet" href="\/?(.*)" inline>/g, (g, h) => {
      console.log(h);
      return `<style>${execSync(`uglifycss ${h}`)}</style>` 
    })
    console.log(data);  
    fs.writeFileSync(dest,data)
  } catch (err) {
    console.error(err);
  }
}

process.chdir("docs");
embedInlines('index.html', 'index.min.html')

process.chdir("render");
embedInlines('recipe.html', 'recipe.min.html')
