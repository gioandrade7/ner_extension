let textDict = {};
let extIdCount = 1;
let size = 0

async function getText(body) {
  let p = body.querySelectorAll("p");
  let h1 = body.querySelectorAll("h1");
  let h2 = body.querySelectorAll("h2");
  let h3 = body.querySelectorAll("h3");
  let h4 = body.querySelectorAll("h4");
  let h5 = body.querySelectorAll("h5");
  let h6 = body.querySelectorAll("h6");

  if (h1) {
    h1.forEach((element) => {
      element.setAttribute("data-ext-id", extIdCount);
      textDict[extIdCount] = element.innerText;
      extIdCount++;
      size += element.innerText.split(" ").length
    });
  }
  if (h2) {
    h2.forEach((element) => {
      element.setAttribute("data-ext-id", extIdCount);
      textDict[extIdCount] = element.innerText;
      extIdCount++;
      size += element.innerText.split(" ").length;
    });
  }
  if (h3) {
    h3.forEach((element) => {
      element.setAttribute("data-ext-id", extIdCount);
      textDict[extIdCount] = element.innerText;
      extIdCount++;
      size += element.innerText.split(" ").length;
    });
  }
  if (h4) {
    h4.forEach((element) => {
      element.setAttribute("data-ext-id", extIdCount);
      textDict[extIdCount] = element.innerText;
      extIdCount++;
      size += element.innerText.split(" ").length;
    });
  }
  if (h5) {
    h5.forEach((element) => {
      element.setAttribute("data-ext-id", extIdCount);
      textDict[extIdCount] = element.innerText;
      extIdCount++;
      size += element.innerText.split(" ").length;
    });
  }
  if (h6) {
    h6.forEach((element) => {
      element.setAttribute("data-ext-id", extIdCount);
      textDict[extIdCount] = element.innerText;
      extIdCount++;
      size += element.innerText.split(" ").length;
    });
  }
  if (p) {
    p.forEach((element) => {
      element.setAttribute("data-ext-id", extIdCount);
      textDict[extIdCount] = element.textContent.trim();
      extIdCount++;
      size += element.innerText.split(" ").length;
    });
  }
}

const b = document.querySelector("body");

if (b) {
  
  const button = document.createElement("BUTTON");

  button.textContent = "PREDICT";
  button.setAttribute("id", "predict");
  b.appendChild(button)

  
  button.addEventListener("click", async () => {
    
    await chrome.runtime.sendMessage({
      type: "startTimer",
      message: "oi"
    });

    let timeInicioColeta =  performance.now();
    let body = document.body;
    await getText(body);

    await chrome.runtime.sendMessage({
      type: "predict",
      message: textDict
    });

    let timeTotalColeta = performance.now() - timeInicioColeta;
    
    chrome.runtime.onMessage.addListener(async function (request,
        sender,
        sendResponse
      ){
        console.log(request.type);
        if (request.type === "replaceBody") {
          
          const new_objects = request.content;

          for (let i = 0; i < new_objects.length; i++) {
            
            let element = body.querySelector(
              `[data-ext-id="${new_objects[i].id}"]`
            );
            if (element != null) element.innerHTML = new_objects[i].text;
          }
          await chrome.runtime.sendMessage({
            type: "highlight",
            message: "highlight",
            tabId: request.tabId,
          });
        }
        if (request.type === "markTime") {

          const size_page = document.createElement("div")
          const tempoFim = document.createElement("Div");
          const tempoTotalMarcacao = document.createElement("Div");
          const tempoTotalPredicao = document.createElement("Div");
          const tempoTotalColeta = document.createElement("Div");

          size_page.textContent = `${size}`;
          tempoFim.textContent = `${request.content.tempoFim}`;
          tempoTotalMarcacao.textContent = `${request.content.tempoTotalMarcacao}`;
          tempoTotalPredicao.textContent = `${request.content.tempoTotalPredicao}`;
          tempoTotalColeta.textContent = `${timeTotalColeta}`;

          size_page.setAttribute("class", "log");
          tempoFim.setAttribute("class", "log");
          tempoTotalMarcacao.setAttribute("class", "log");
          tempoTotalPredicao.setAttribute("class", "log");
          tempoTotalColeta.setAttribute("class", "log");

          b.appendChild(size_page)
          b.appendChild(tempoFim);
          b.appendChild(tempoTotalMarcacao);
          b.appendChild(tempoTotalPredicao);
          b.appendChild(tempoTotalColeta)

          console.log(size, request.content)
        }
      })
  });
}
