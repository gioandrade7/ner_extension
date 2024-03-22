
var textDict = {};
var extIdCount = 1;

function getText(body){

  let p = body.querySelectorAll("p")
  let h1 = body.querySelectorAll("h1");
  let h2 = body.querySelectorAll("h2");
  let h3 = body.querySelectorAll("h3");
  let h4 = body.querySelectorAll("h4");
  let h5 = body.querySelectorAll("h5");
  let h6 = body.querySelectorAll("h6");


  if (h1) {
    h1.forEach(element => {
      element.setAttribute("data-ext-id", extIdCount);
      textDict[extIdCount] = element.innerText
      extIdCount++
    });
  }
  if (h2) {
    h2.forEach(element => {
      element.setAttribute("data-ext-id", extIdCount);
      textDict[extIdCount] = element.innerText
      extIdCount++
    });
  }
  if (h3) {
    h3.forEach(element => {
      element.setAttribute("data-ext-id", extIdCount);
      textDict[extIdCount] = element.innerText
      extIdCount++
    });
  }
  if (h4) {
    h4.forEach(element => {
      element.setAttribute("data-ext-id", extIdCount);
      textDict[extIdCount] = element.innerText
      extIdCount++
    });
  }
  if (h5) {
    h5.forEach(element => {
      element.setAttribute("data-ext-id", extIdCount);
      textDict[extIdCount] = element.innerText
      extIdCount++
    });
  }
  if (h6) {
    h6.forEach(element => {
      element.setAttribute("data-ext-id", extIdCount);
      textDict[extIdCount] = element.innerText
      extIdCount++
    });
  }
  if (p) {
    p.forEach(element => {
      element.setAttribute("data-ext-id", extIdCount);
      textDict[extIdCount] = element.textContent.trim()
      extIdCount++
    });
  }

  console.log(textDict)
}

chrome.runtime.onMessage.addListener(
  async function(request, sender, sendResponse) {
    let body = document.body
    if(request.type === "contentTrigger"){
      getText(body)
      const response = await chrome.runtime.sendMessage({type: "predict", message: textDict, tabId: request.tabId});
    }
    else if(request.type === "replaceBody"){
      console.log(request)
      const new_objects = request.content

      for (let i = 0; i < new_objects.length; i++){
        let bodyString = body.innerHTML
        let element = body.querySelector(`[data-ext-id="${new_objects[i].id}"]`)
        if (element != null) element.innerHTML = new_objects[i].text
      }
      const response = await chrome.runtime.sendMessage({type: "highlight",  message: "highlight", tabId: request.tabId});
      
    }
  }
)







