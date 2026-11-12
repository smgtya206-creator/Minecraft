var CACHE='kublar-olami-v2';
var CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
var EXTRA=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return c.addAll(CORE).then(function(){return Promise.all(EXTRA.map(function(u){return c.add(u).catch(function(){});}));});
  }).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var same=new URL(e.request.url).origin===location.origin;
  function put(res){
    if(res&&(res.ok||res.type==='opaque')){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(e.request,cp);});}
    return res;
  }
  if(same){
    e.respondWith(fetch(e.request).then(put).catch(function(){
      return caches.match(e.request,{ignoreSearch:true}).then(function(r){return r||caches.match('index.html');});
    }));
  }else{
    e.respondWith(caches.match(e.request).then(function(r){return r||fetch(e.request).then(put);}));
  }
});
