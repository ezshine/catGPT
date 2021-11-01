/*
猫房
author:大帅老猿
reposity:https://github.com/ezshine/chrome-extension-catroom
*/

!function(){
   function injectCustomJs(jsPath,cb)
   {
      var temp = document.createElement('script');
      temp.setAttribute('type', 'text/javascript');
      temp.src = chrome.extension.getURL(jsPath);
      temp.onload = function()
      {
         if(cb)cb();
      };
      document.head.appendChild(temp);
   }

   function setupCatCanvas(){
      var canvas = document.createElement('canvas');
      canvas.id="live2d";
      canvas.width = 200;
      canvas.height = 300;
      canvas.style.position = "fixed";
      canvas.style.zIndex = 9999;
      canvas.style.right = 0;
      canvas.style.bottom = 0;

      document.body.appendChild(canvas);
   }

   function setupModel(){
      // loadlive2d('live2d','https://cdn.jsdelivr.net/gh/QiShaoXuan/live2DModel@1.0.0/live2d-widget-model-shizuku/assets/shizuku.model.json');
   }

   injectCustomJs("js/live2d-mini.js",function(){
      console.log(window);
   });
}()