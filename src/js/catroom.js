/*
猫房
author:大帅老猿
reposity:https://github.com/ezshine/chrome-extension-catroom
*/

!function(){

   //1556564194374926

   const topLevel = 198;

   function getUserId() {
      var url = document.querySelector("a[href*='user']").getAttribute("href");
      return url.substr(url.lastIndexOf("/") + 1)
   }

   const beastDictArr = ['喵', '嗷', '呜', '~']
function toBeast(rawStr) {
    let charArr = rawStr.split("")
    let unicodeHexStr = ""
    for (let i = 0; i < charArr.length; i++) {
        let charHexStr = charArr[i].charCodeAt(0).toString(16)
        while (charHexStr.length < 4) {
            charHexStr = "0" + charHexStr
        }
        unicodeHexStr += charHexStr
    }
    let k = 0
    let unicodeHexStrArr = unicodeHexStr.split("")
    let beastStr = ""
    for (let i = 0; i < unicodeHexStrArr.length; i++) {
        let unicodeHexCharValue = parseInt("0x" + unicodeHexStrArr[i])
        k = unicodeHexCharValue + (i % 0x10)
        if (k >= 0x10) {
            k = k - 0x10;
        }
        beastStr += beastDictArr[parseInt(k / 4)] + beastDictArr[(k % 4)]
    }
    return "喵嗷" + beastStr + "~"
}
function fromBeast(decoratedBeastStr) {
    let beastStr = decoratedBeastStr.substring(2, decoratedBeastStr.length - 1);
    let unicodeHexStr = ""
    let beastStrArr = beastStr.split("")
    for (let i = 0; i <= (beastStr.length - 2); i += 2) {
        let beastCharStr = ""
        let pos1 = 0
        beastCharStr = beastStrArr[i];
        for (; pos1 <= 3; pos1++) {
            if (beastCharStr == beastDictArr[pos1]) {
                break
            }
        }
        let pos2 = 0
        beastCharStr = beastStrArr[i + 1]
        for (; pos2 <= 3; pos2++) {
            if (beastCharStr == beastDictArr[pos2]) {
                break;
            }
        }
        let k = (pos1 * 4) + pos2;
        let unicodeHexCharValue = k - (parseInt(i / 2) % 0x10);
        if (unicodeHexCharValue < 0) {
            unicodeHexCharValue += 0x10;
        }
        unicodeHexStr += unicodeHexCharValue.toString(16)
    }
    let rawStr = ""
    let start = 0
    let end = 4
    while (end <= unicodeHexStr.length) {
        let charHexStr = unicodeHexStr.substring(start, end);
        let charStr = String.fromCharCode(parseInt("0x" + charHexStr))
        rawStr += charStr
        start += 4
        end += 4
    }
    return rawStr
}

   // Croquet Tutorial 3
// Multiuser Chat
// Croquet Studios, 2019-2021

   function injectCustomJs(jsPath,cb)
   {
      var temp = document.createElement('script');
      temp.setAttribute('type', 'text/javascript');
      temp.src = jsPath;
      temp.onload = function()
      {
         if(cb)cb();
      };
      document.head.appendChild(temp);
   }

   function loadModel(cattype){
      localStorage.setItem('cattype',cattype);

      var model_url= 'https://cdn.jsdelivr.net/gh/ezshine/chrome-extension-catroom/src/resources/'+cattype+'cat/model.json';

      var loadLive = document.createElement("script");
      loadLive.innerHTML = '!function(){loadlive2d("live2d", "' + model_url + '");}()';
      document.body.appendChild(loadLive);
   }

   function addNewStyle(newStyle) {
      var styleElement = document.getElementById('styles_js');

      if (!styleElement) {
          styleElement = document.createElement('style');
          styleElement.type = 'text/css';
          styleElement.id = 'styles_js';
          document.getElementsByTagName('head')[0].appendChild(styleElement);
      }
      
      styleElement.appendChild(document.createTextNode(newStyle));
  }

   function setupChatPanel(){
      var panel = document.createElement('div');

      panel.id = 'textOut';
      panel.style.position = "fixed";
      panel.style.zIndex = topLevel;
      panel.style.right = '10px';
      panel.style.top = '120px';
      panel.style.width = '300px';
      panel.style.height = '240px';
      // panel.style.pointerEvents='none';
      panel.style.display='flex';
      panel.style.flexDirection='column';
      panel.style.alignItems='end';
      document.body.appendChild(panel);

      var inputDiv = document.createElement('input');
      inputDiv.id='textIn';
      inputDiv.placeholder = '喵喵聊';
      inputDiv.maxLength = 10;
      inputDiv.style.position = "fixed";
      inputDiv.style.zIndex = topLevel;
      inputDiv.style.right = '0px';
      inputDiv.style.bottom = '200px';
      inputDiv.style.width = '150px';
      inputDiv.style.height = '30px';
      inputDiv.style.lineHeight = '30px';
      inputDiv.style.textAlign = 'center';
      inputDiv.style.borderRadius ='15px';
      document.body.appendChild(inputDiv);

      var totalCountDiv = document.createElement('div');
      totalCountDiv.id='totalCount';
      totalCountDiv.style.position = "fixed";
      totalCountDiv.style.zIndex = topLevel;
      totalCountDiv.style.right = '0px';
      totalCountDiv.style.bottom = '180px';
      totalCountDiv.style.width = '150px';
      totalCountDiv.style.height = '20px';
      totalCountDiv.style.lineHeight = '20px';
      totalCountDiv.style.textAlign = 'center';
      totalCountDiv.style.color='#fff';
      totalCountDiv.style.textShadow='#000 1px 0 0,#000 0 1px 0,#000 -1px 0 0,#000 0 -1px 0';
      document.body.appendChild(totalCountDiv);

      addNewStyle(`
         #croquet_spinnerOverlay {
            display:none !important;
         }
         .chatLine {
            padding:5px 10px;
            color:#fff;
            background:rgba(0,0,0,.3);
            border-radius:14px;
         }
         .chatLine>div:nth-child(2) {
            display:none;
         }
         .chatLine>div:nth-child(1) {
            color:#fff;
         }
         .chatLine:hover>div:nth-child(1) {
            color:#d8d8d8;
         }
         .chatLine:hover>div:nth-child(2) {
            display:block;
         }
      `);
   }
   

   injectCustomJs('https://unpkg.com/@croquet/croquet',function(){
      setupChatPanel();   

      console.log(getUserId());
   
   class ChatModel extends Croquet.Model {
  
         init() {
           this.views = new Map();
           this.participants = 0;
           this.history = []; // { viewId, html } items
           this.lastPostTime = null;
           this.inactivity_timeout_ms = 60 * 1000 * 20; // constant
           this.subscribe(this.sessionId, "view-join", this.viewJoin);
           this.subscribe(this.sessionId, "view-exit", this.viewExit);
           this.subscribe("input", "newPost", this.newPost);
           this.subscribe("input", "reset", this.resetHistory);
         }
       
         viewJoin(viewId) {
           const existing = this.views.get(viewId);
           if (!existing) {
             const nickname = this.randomName();
             this.views.set(viewId, nickname);
           }
           this.participants++;
           this.publish("viewInfo", "refresh");  
         }
         
         viewExit(viewId) {
           this.participants--;
           this.views.delete(viewId);
           this.publish("viewInfo", "refresh");
         }
       
         newPost(post) {
           const postingView = post.viewId;
           const nickname = this.views.get(postingView);
           const chatLine = `<div class='chatLine'><div>${this.escape(post.text)}</div><div>${fromBeast(this.escape(post.text))}</div></div>`;
           this.addToHistory({ viewId: postingView, html: chatLine });
           this.lastPostTime = this.now();
           this.future(this.inactivity_timeout_ms).resetIfInactive();
         }
       
         addToHistory(item){
           this.history.push(item);
           if (this.history.length > 100) this.history.shift();
           this.publish("history", "refresh");   
         }
       
         resetIfInactive() {
           if (this.lastPostTime !== this.now() - this.inactivity_timeout_ms) return;
           
           this.resetHistory("due to inactivity");
         }
         
         resetHistory(reason) {
         //   this.history = [{ html: `<i>chat reset ${reason}</i>` }];
           this.lastPostTime = null;
           this.publish("history", "refresh");
         }
         
         escape(text) { // Clean up text to remove html formatting characters
           return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
         }
       
         randomName() {
           const names =["Acorn", "Allspice", "Almond", "Ancho", "Anise", "Aoli", "Apple", "Apricot", "Arrowroot", "Asparagus", "Avocado", "Baklava", "Balsamic", "Banana", "Barbecue", "Bacon", "Basil", "Bay Leaf", "Bergamot", "Blackberry", "Blueberry", "Broccoli", "Buttermilk", "Cabbage", "Camphor", "Canaloupe", "Cappuccino", "Caramel", "Caraway", "Cardamom", "Catnip", "Cauliflower", "Cayenne", "Celery", "Cherry", "Chervil", "Chives", "Chipotle", "Chocolate", "Coconut", "Cookie Dough", "Chamomile", "Chicory", "Chutney", "Cilantro", "Cinnamon", "Clove", "Coriander", "Cranberry", "Croissant", "Cucumber", "Cupcake", "Cumin", "Curry", "Dandelion", "Dill", "Durian", "Earl Grey", "Eclair", "Eggplant", "Espresso", "Felafel", "Fennel", "Fig", "Garlic", "Gelato", "Gumbo", "Halvah", "Honeydew", "Hummus", "Hyssop", "Ghost Pepper", "Ginger", "Ginseng", "Grapefruit", "Habanero", "Harissa", "Hazelnut", "Horseradish", "Jalepeno", "Juniper", "Ketchup", "Key Lime", "Kiwi", "Kohlrabi", "Kumquat", "Latte", "Lavender", "Lemon Grass", "Lemon Zest", "Licorice", "Macaron", "Mango", "Maple Syrup", "Marjoram", "Marshmallow", "Matcha", "Mayonnaise", "Mint", "Mulberry", "Mustard", "Natto", "Nectarine", "Nutmeg", "Oatmeal", "Olive Oil", "Orange Peel", "Oregano", "Papaya", "Paprika", "Parsley", "Parsnip", "Peach", "Peanut Butter", "Pecan", "Pennyroyal", "Peppercorn", "Persimmon", "Pineapple", "Pistachio", "Plum", "Pomegranate", "Poppy Seed", "Pumpkin", "Quince", "Raspberry", "Ratatouille", "Rosemary", "Rosewater", "Saffron", "Sage", "Sassafras", "Sea Salt", "Sesame Seed", "Shiitake", "Sorrel", "Soy Sauce", "Spearmint", "Strawberry", "Strudel", "Sunflower Seed", "Sriracha", "Tabasco", "Tahini", "Tamarind", "Tandoori", "Tangerine", "Tarragon", "Thyme", "Tofu", "Truffle", "Tumeric", "Valerian", "Vanilla", "Vinegar", "Wasabi", "Walnut", "Watercress", "Watermelon", "Wheatgrass", "Yarrow", "Yuzu", "Zucchini"];
           return names[Math.floor(Math.random() * names.length)];
         }
       }
       
      
       
       class ChatView extends Croquet.View {
       
         constructor(model) {
           super(model);
           this.model = model;

           textIn.onkeydown=(event)=>{
               if(event.keyCode == 13){
                  this.send();
               }
            }
           this.subscribe("history", "refresh", this.refreshHistory);
           this.subscribe("viewInfo", "refresh", this.refreshViewInfo);
           this.refreshHistory();
           this.refreshViewInfo();
           if (model.participants === 1 &&
             !model.history.find(item => item.viewId === this.viewId)) {
             this.publish("input", "reset", "for new participants");
           }
         }
       
         send() {
           const text = textIn.value;
           textIn.value = "";
           if (text === "/reset") {
             this.publish("input", "reset", "at user request");
           } else if(text=='cat:white'||text=='cat:black'){
            loadModel(text.substr(4));
           }else {
             this.publish("input", "newPost", {viewId: this.viewId, text:toBeast(text)});    
           }
         }
        
         refreshViewInfo() {
            totalCount.innerHTML = "在线猫奴：" + this.model.participants;
         }
       
         refreshHistory() {
            var history = this.model.history.slice(this.model.history.length-5,this.model.history.length);
           textOut.innerHTML = "" + history.map(item => item.html).join("<br>");
           textOut.scrollTop = Math.max(10000, textOut.scrollHeight);
         }
       }
      
       ChatModel.register("ChatModel");
       
        Croquet.Session.join({
          appId: "com.ezshine.catroom",
          apiKey: "1DL0ohEPLo1hpb1umfPgOb8MkxCikPeCIHniB30k7",
          name: "unnamed",
          password: "secret",
          model: ChatModel,
          view: ChatView
        });
   });
}()