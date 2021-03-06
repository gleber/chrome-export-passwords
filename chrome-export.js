/**
* Script ver 0.5
* Writing by Ruslan Kovalev : skidisaster@gmail.com
* Feb.25 2015
* output format changed for ready to use in FireFox Export plugin
* please install this plugin from https://addons.mozilla.org/en-Us/firefox/addon/password-exporter/
* changes:
* - version based on Chrome api objects not on DOM.
*/

function url_domain(url) {
   var matches = url.match(/^(https?\:\/\/)?([^\/?#]+)(?:[\/?#]|$)/i);
   return matches && matches[2];
}

// first part of executing script
var out2 = "# Next line will temporarily disable command history for this shell";
out2 += "unset HISTFILE";
var i = 0;
var pm = PasswordManager.getInstance();
var model = pm.savedPasswordsList_.dataModel;
var pl = pm.savedPasswordsList_;

for(var i = 0; i < model.length; i++) {
   PasswordManager.requestShowPassword(i);
};

function escape(s) {
   return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/!/g, '\\!');
}

var passes = {};

setTimeout(function() {
   for(var i = 0 ; i < model.length; i++){
      var item = pl.getListItemByIndex(i);
      var url = model.array_[i][0];
      var domain = url_domain(url);
      var user = model.array_[i][1];
      var pass = item.childNodes[0].childNodes[2].childNodes[0].value;
      var key = [domain, user];
      if (key in passes) {
         if (passes[key].pass != pass) {
            alert('Duplicate for '+key+'. Deal with it somehow.');
         }
      }
      passes[key] = {
         'url': url,
         'domain': domain, 
         'user': user,
         'pass': pass
      }
   };
   
   Object.keys(passes).forEach(function(k) {
      var i = passes[k];
      var escaped = escape(i.pass);
      out2 += '<br/>echo "'+escaped+'\\nUsername: '+i.user+'" | pass add -m "Web/FromChrome/'+i.domain+'"';
   })
   document.write(out2);
}, 300);
