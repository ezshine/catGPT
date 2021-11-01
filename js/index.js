/*
猫房
author:大帅老猿
reposity:https://github.com/ezshine/chrome-extension-catroom
*/

!function(){
    function injectCustomJs(jsPath)
    {
        var temp = document.createElement('script');
        temp.setAttribute('type', 'text/javascript');
        temp.src = chrome.extension.getURL(jsPath);
        temp.onload = function()
        {
            this.parentNode.removeChild(this);
        };
        document.head.appendChild(temp);
    }
    injectCustomJs('js/catroom.js',function(){
        setupCatCanvas();
        setupModel();
    });
}()