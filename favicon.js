(function() {
  var FavEmoji = function(unicode) {
    'use strict';
    var
      canvas = document.createElement('canvas'),
      getContext = function(w) {
        canvas.width = canvas.height = w;
        context = canvas.getContext('2d');
        context.font = 'normal normal normal 32px/' + w + 'px sans';
        context.textBaseline = 'middle';
        return context;
      },
      hex2char = function(hex) {
        var
          result = '',
          n = parseInt(hex, 16);
        if(n <= 0xFFFF)
          result += String.fromCharCode(n);
        else if(n <= 0x10FFFF) {
          n -= 0x10000
          result += String.fromCharCode(0xD800 | (n >> 10)) + String.fromCharCode(0xDC00 | (n & 0x3FF));
        }
        return result;
      },
      context = getContext(32),
      content = unicode.replace(/[Uu]\+10([A-Fa-f0-9]{4})/g, function(str, match) {
        return hex2char('10' + matches);
      }).replace(/[Uu]\+([A-Fa-f0-9]{1,5})/g, function(str, match) {
        return hex2char(match);
      }),
      iconWidth,
      link = document.createElement('link');
    if(!canvas.toDataURL || !document.querySelectorAll)
      return;
    iconWidth = context.measureText(content).width;
    if(iconWidth > canvas.width)
      context = getContext(iconWidth);
    context.fillText(content, (canvas.width - iconWidth) / 2, canvas.height / 2);
    link.setAttribute('rel', 'icon');
    link.setAttribute('type', 'image/png');
    link.setAttribute('href', canvas.toDataURL('image/png'));
    for(var icons = document.querySelectorAll('link[rel*=icon]'), i = 0, l = icons.length; i < l; i++)
      icons[i].parentNode.removeChild(icons[i]);
    document.getElementsByTagName('head')[0].appendChild(link);
  };
  if(typeof define !== 'undefined' && define.amd)
    define([], function() {
      return FavEmoji;
    });
  else if(typeof module !== 'undefined' && module.exports)
    module.exports = FavEmoji;
  else
    this.FavEmoji = FavEmoji;
})();