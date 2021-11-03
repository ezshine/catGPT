/*
猫房
author:大帅老猿
reposity:https://github.com/ezshine/chrome-extension-catroom
*/

!function(){
    var cattype = "white";

    function setupCatPanel(){
        var canvas = document.createElement('canvas');
        canvas.id="live2d";
        canvas.width = 300;
        canvas.height = 400;
        canvas.style.width='150px';
        canvas.style.height='200px';
        canvas.style.position = "fixed";
        canvas.style.zIndex = 9999;
        canvas.style.right = '0px';
        canvas.style.bottom = '-10px';
        canvas.style.pointerEvents='none';
        canvas.style.filter='drop-shadow(0px 10px 10px #ccc)';
  
        document.body.appendChild(canvas);
     }
  
     function setupModel(){
        var _cattype = localStorage.getItem('cattype');
        if(_cattype)cattype=_cattype;

        var model_url= 'https://cdn.jsdelivr.net/gh/ezshine/chrome-extension-catroom/src/resources/'+cattype+'cat/model.json';

        var loadLive = document.createElement("script");
        loadLive.innerHTML = '!function(){loadlive2d("live2d", "' + model_url + '");}()';
        document.body.appendChild(loadLive);
    }

    function injectCustomJs(jsPath,cb)
    {
        var temp = document.createElement('script');
        temp.setAttribute('type', 'text/javascript');
        temp.src = chrome.extension.getURL(jsPath);
        temp.onload = function()
        {
            this.parentNode.removeChild(this);
            if(cb)cb();
        };
        document.head.appendChild(temp);
    }

    injectCustomJs('js/live2d-mini.js',function(){
      setupCatPanel();
      setupModel();

      injectCustomJs('js/catroom.js',function(){

      });
   });
}()