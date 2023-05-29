let script = window.script;

let icon = {
  bday: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h24v24H0z"/></mask><g mask="url(#a)"><path d="M4 22a.967.967 0 0 1-.712-.288A.968.968 0 0 1 3 21v-5c0-.55.196-1.02.587-1.412A1.926 1.926 0 0 1 5 14v-4c0-.55.196-1.02.588-1.412A1.926 1.926 0 0 1 7 8h4V6.55c-.3-.2-.542-.442-.725-.725C10.092 5.542 10 5.2 10 4.8c0-.25.05-.496.15-.737.1-.242.25-.463.45-.663L12 2l1.4 1.4c.2.2.35.42.45.663.1.241.15.487.15.737 0 .4-.092.742-.275 1.025A2.503 2.503 0 0 1 13 6.55V8h4c.55 0 1.02.196 1.413.588.391.391.587.862.587 1.412v4c.55 0 1.02.196 1.413.588.391.391.587.862.587 1.412v5c0 .283-.096.52-.288.712A.968.968 0 0 1 20 22H4Zm3-8h10v-4H7v4Zm-2 6h14v-4H5v4Z"/></g></svg>',
  tel: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h24v24H0z"/></mask><g mask="url(#a)"><path d="M19.95 21c-2.15 0-4.246-.48-6.287-1.438a19.066 19.066 0 0 1-5.425-3.8 19.067 19.067 0 0 1-3.8-5.425C3.478 8.296 3 6.2 3 4.05c0-.3.1-.55.3-.75.2-.2.45-.3.75-.3H8.1a.96.96 0 0 1 .625.225.88.88 0 0 1 .325.575l.65 3.5c.033.233.03.446-.012.638a1.023 1.023 0 0 1-.288.512L6.975 10.9a16.4 16.4 0 0 0 2.638 3.375A18.64 18.64 0 0 0 13.1 17l2.35-2.35a1.4 1.4 0 0 1 .588-.338 1.61 1.61 0 0 1 .712-.062l3.45.7c.233.05.425.163.575.338.15.175.225.379.225.612v4.05c0 .3-.1.55-.3.75-.2.2-.45.3-.75.3ZM6.025 9l1.65-1.65L7.25 5H5.025c.083.683.2 1.358.35 2.025.15.667.367 1.325.65 1.975Zm8.95 8.95c.65.283 1.313.508 1.987.675.675.167 1.355.275 2.038.325v-2.2l-2.35-.475-1.675 1.675Z"/></g></svg>',
  text: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h24v24H0z"/></mask><g mask="url(#a)"><path d="M2 22V4c0-.55.196-1.02.587-1.413A1.926 1.926 0 0 1 4 2h16c.55 0 1.02.196 1.413.587.39.393.587.863.587 1.413v12c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 20 18H6l-4 4Zm3.15-6H20V4H4v13.125L5.15 16Z"/></g></svg>',
  url: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h24v24H0z"/></mask><g mask="url(#a)"><path d="M12 22a9.676 9.676 0 0 1-3.875-.788 10.144 10.144 0 0 1-3.188-2.15 10.142 10.142 0 0 1-2.15-3.187A9.676 9.676 0 0 1 2 12c0-1.383.263-2.68.788-3.887a10.183 10.183 0 0 1 2.15-3.175 10.143 10.143 0 0 1 3.187-2.15A9.676 9.676 0 0 1 12 2c1.383 0 2.68.263 3.887.788a10.183 10.183 0 0 1 3.175 2.15 10.184 10.184 0 0 1 2.15 3.175A9.649 9.649 0 0 1 22 12a9.676 9.676 0 0 1-.788 3.875 10.143 10.143 0 0 1-2.15 3.188 10.184 10.184 0 0 1-3.175 2.15A9.649 9.649 0 0 1 12 22Zm0-2.05c.433-.6.808-1.225 1.125-1.875.317-.65.575-1.342.775-2.075h-3.8c.2.733.458 1.425.775 2.075.317.65.692 1.275 1.125 1.875Zm-2.6-.4c-.3-.55-.563-1.12-.787-1.713A14.688 14.688 0 0 1 8.05 16H5.1a8.3 8.3 0 0 0 1.813 2.175A7.195 7.195 0 0 0 9.4 19.55Zm5.2 0a7.195 7.195 0 0 0 2.487-1.375A8.299 8.299 0 0 0 18.9 16h-2.95c-.15.633-.337 1.246-.563 1.837a13.857 13.857 0 0 1-.787 1.713ZM4.25 14h3.4a13.208 13.208 0 0 1-.15-2 13.208 13.208 0 0 1 .15-2h-3.4A7.959 7.959 0 0 0 4 12a7.959 7.959 0 0 0 .25 2Zm5.4 0h4.7a13.208 13.208 0 0 0 .15-2 13.208 13.208 0 0 0-.15-2h-4.7a13.208 13.208 0 0 0-.15 2 13.208 13.208 0 0 0 .15 2Zm6.7 0h3.4a7.953 7.953 0 0 0 .25-2 7.953 7.953 0 0 0-.25-2h-3.4a13.208 13.208 0 0 1 .15 2 13.208 13.208 0 0 1-.15 2Zm-.4-6h2.95a8.298 8.298 0 0 0-1.813-2.175A7.196 7.196 0 0 0 14.6 4.45c.3.55.563 1.12.787 1.712.226.592.413 1.205.563 1.838ZM10.1 8h3.8a11.82 11.82 0 0 0-.775-2.075A12.701 12.701 0 0 0 12 4.05c-.433.6-.808 1.225-1.125 1.875A11.82 11.82 0 0 0 10.1 8Zm-5 0h2.95c.15-.633.337-1.246.563-1.838C8.838 5.571 9.1 5 9.4 4.45c-.933.3-1.763.758-2.488 1.375A8.298 8.298 0 0 0 5.1 8Z"/></g></svg>',
  adr: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h24v24H0z"/></mask><g mask="url(#a)"><path d="M12 12c.55 0 1.02-.196 1.412-.588.392-.391.588-.862.588-1.412 0-.55-.196-1.02-.588-1.412A1.926 1.926 0 0 0 12 8c-.55 0-1.02.196-1.412.588A1.926 1.926 0 0 0 10 10c0 .55.196 1.02.588 1.412.391.392.862.588 1.412.588Zm0 7.35c2.033-1.867 3.542-3.563 4.525-5.088C17.508 12.738 18 11.383 18 10.2c0-1.817-.58-3.304-1.738-4.462C15.104 4.579 13.683 4 12 4c-1.683 0-3.104.58-4.263 1.737C6.58 6.896 6 8.383 6 10.2c0 1.183.492 2.538 1.475 4.063.983 1.524 2.492 3.22 4.525 5.087ZM12 22c-2.683-2.283-4.688-4.404-6.013-6.363C4.662 13.68 4 11.867 4 10.2c0-2.5.804-4.492 2.412-5.975C8.021 2.742 9.883 2 12 2s3.98.742 5.587 2.225C19.197 5.708 20 7.7 20 10.2c0 1.667-.663 3.48-1.988 5.438C16.688 17.595 14.683 19.716 12 22Z"/></g></svg>',
  email: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h24v24H0z"/></mask><g mask="url(#a)"><path d="M4 20c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 2 18V6c0-.55.196-1.02.587-1.412A1.926 1.926 0 0 1 4 4h16c.55 0 1.02.196 1.413.588.391.391.587.862.587 1.412v12c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 20 20H4Zm8-7L4 8v10h16V8l-8 5Zm0-2 8-5H4l8 5ZM4 8V6v12V8Z"/></g></svg>',
  note: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h24v24H0z"/></mask><g mask="url(#a)"><path d="M6 22c-.55 0-1.02-.196-1.412-.587A1.926 1.926 0 0 1 4 20V4c0-.55.196-1.02.588-1.413A1.926 1.926 0 0 1 6 2h8l6 6v12c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 18 22H6Zm7-13V4H6v16h12V9h-5Z"/></g></svg>',
  add: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h24v24H0z"/></mask><g mask="url(#a)"><path d="M18 14v-3h-3V9h3V6h2v3h3v2h-3v3h-2Zm-9-2c-1.1 0-2.042-.392-2.825-1.175C5.392 10.042 5 9.1 5 8s.392-2.042 1.175-2.825C6.958 4.392 7.9 4 9 4s2.042.392 2.825 1.175C12.608 5.958 13 6.9 13 8s-.392 2.042-1.175 2.825C11.042 11.608 10.1 12 9 12Zm-8 8v-2.8c0-.567.146-1.087.438-1.563A2.911 2.911 0 0 1 2.6 14.55a14.843 14.843 0 0 1 3.15-1.163A13.76 13.76 0 0 1 9 13c1.1 0 2.183.13 3.25.387 1.067.259 2.117.646 3.15 1.163.483.25.87.612 1.162 1.087.292.476.438.996.438 1.563V20H1Zm2-2h12v-.8a.973.973 0 0 0-.5-.85c-.9-.45-1.808-.787-2.725-1.012a11.6 11.6 0 0 0-5.55 0c-.917.225-1.825.562-2.725 1.012a.973.973 0 0 0-.5.85v.8Zm6-8c.55 0 1.02-.196 1.412-.588C10.804 9.021 11 8.55 11 8c0-.55-.196-1.02-.588-1.412A1.926 1.926 0 0 0 9 6c-.55 0-1.02.196-1.412.588A1.926 1.926 0 0 0 7 8c0 .55.196 1.02.588 1.412C7.979 9.804 8.45 10 9 10Z"/></g></svg>',
  vid: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><mask id="a" width="24" height="24" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path d="M0 0h24v24H0z"/></mask><g mask="url(#a)"><path d="M4 20c-.55 0-1.02-.196-1.413-.587A1.926 1.926 0 0 1 2 18V6c0-.55.196-1.02.587-1.412A1.926 1.926 0 0 1 4 4h12c.55 0 1.02.196 1.413.588.391.391.587.862.587 1.412v4.5l4-4v11l-4-4V18c0 .55-.196 1.02-.587 1.413A1.926 1.926 0 0 1 16 20H4Zm0-2h12V6H4v12Z"/></g></svg>',
}





function share() {
  parent.postMessage({share:{}}, "*");
}

function render() {
  document.documentElement.appendChild(el("base", {target:"_top"}))
  let vcard = params.body.match(/BEGIN:VCARD/);
  if (vcard) {
    let data = parse(params.body)
    console.log(data, params.body.split("\n"));
    document.body.appendChild(
      el("div.contact", {}, 
        el("h1.header", {}, data.fn),
        data.email.forEach(email => el("div.email", {}, email.value.pop())),
        data.tel.forEach(tel => el("div.tel", {}, tel.value.pop())),
        // array.map(line => el("div.line", {}, line)),
      )
    )
  } else if (params.body.match(/MECARD:/)){
    document.body.appendChild(el("#arc-theme"));

    console.log("params.body", decodeURI(params.body))
    let lines = decodeURIComponent(decodeURIComponent(params.body.substring(7))).trim().replace(/\\n/g, "\n").replace(/\\:/g, "\:").split(";");
    let mecard = {}
    lines.forEach(line => {
      let parts = line.split(":");
      mecard[parts.shift().toLowerCase()] = [parts.join(":")];
    })

    if (mecard.color) document.body.style.backgroundColor = mecard.color;

    document.body.appendChild(
      el("div.contact", {}, 
        el("div.header", {}, 
          el("h1", {}, mecard.n),
        ),
        mecard.tel?.map(tel => el("a.row.tel", {href:"tel:" + tel}, 
          el("div.icon", {innerHTML:icon.tel}), el("div.field", {}, tel))),
        mecard.email?.map(email => el("a.row.email", {target:"top", href:"mailto:" + email}, 
          el("div.icon", {innerHTML:icon.email}), el("div.field", {}, email))),
        mecard.adr?.map(adr => el("a.row.adr", {href:"https://address.fyi/" + adr}, 
          el("div.icon", {innerHTML:icon.adr}), el("div.field", {}, adr))),
        mecard.bday?.map(bday => el("a.row.bday", {href:"https://address.fyi/" + bday}, 
          el("div.icon", {innerHTML:icon.bday}), el("div.field", {}, bday))),
        mecard.url?.map(url => el("a.row.url", {href:url}, 
          el("div.icon", {innerHTML:icon.url}), el("div.field", {}, url.replace(/https?:\/\//, "")))),
        mecard.memo?.map(memo => el("div.row.memo", {}, el("div.field", {}, memo))),
        
      )
    )
    console.log("mecard", lines, mecard);
  }

}

var path = script.substring(0, script.lastIndexOf("."));
var cssURL = path + ".css";
Promise.all([ 
  loadSyle(cssURL)
]).then(render);

function parse(input) {
  var Re1 = /^(version|fn|title|org):(.+)$/i;
  var Re2 = /^([^:;]+);([^:]+):(.+)$/;
  var ReKey = /item\d{1,2}\./;
  var fields = {};

  input.split(/\r\n|\r|\n/).forEach(function (line) {
      var results, key;

      if (Re1.test(line)) {
          results = line.match(Re1);
          key = results[1].toLowerCase();
          fields[key] = results[2];
      } else if (Re2.test(line)) {
          results = line.match(Re2);
          key = results[1].replace(ReKey, '').toLowerCase();

          var meta = {};
          results[2].split(';')
              .map(function (p, i) {
              var match = p.match(/([a-z]+)=(.*)/i);
              if (match) {
                  return [match[1], match[2]];
              } else {
                  return ["TYPE" + (i === 0 ? "" : i), p];
              }
          })
              .forEach(function (p) {
              meta[p[0]] = p[1];
          });

          if (!fields[key]) fields[key] = [];

          fields[key].push({
              meta: meta,
              value: results[3].split(';')
          })
      }
  });

  return fields;
};
