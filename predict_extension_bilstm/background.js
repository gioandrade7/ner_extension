import {predict, loadModel} from './predict.js';
import idx2tag from './jus/jus_idx2tag.js';
import { max } from './tensorFlow.js';

chrome.action.onClicked.addListener(async (tab) => {

    // const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {type: "contentTrigger", tabId: tab.id});
    // do something with response here, not outside the function
    console.log(response);
});

chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {
        if(request.type === "predict"){
            let model = await loadModel() // carrega o modelo
            let list_tam = Object.keys(request.message).length
            let new_objects = []
            let new_text = []
            let result
            let a1 = []
            let a2 = []
            for(let i = 1; i <= list_tam; i++){ // para cada texto:
                var text = request.message[i].split(" ") // tokens do texto do dicionário
                let length = text.length
                let maxLength = 124
                if (length > maxLength) {
                    a1 = text.slice(0, maxLength)
                    a2 = text.slice(maxLength, length)
                    result = predict(model, a1)[0]
                    length = maxLength
                } // truncar o texto (temp)
                else result = predict(model, text)[0] // resultado da predição
                var tags =[]
                for(let j = 0; j < length; j++){
                    var max_prob = Math.max.apply(null, result[j])
                    var tag_id = result[j].indexOf(max_prob)
                    tags.push(idx2tag[tag_id])
                }
                
                for (let i = 0; i < tags.length; i++){
                    if(tags[i] != "O"){
                        new_text.push(`<span class="${tags[i]}">${text[i]} <font color=white>${tags[i]}</font> </span>`)
                    }
                    else{
                        new_text.push(text[i])
                    }
                }

                new_text = new_text.concat(a2)

                new_text = new_text.join(" ")
                
                var new_object = {text: new_text, id: i}
                new_objects.push(new_object)
                new_text = []
            } 
            console.log(new_objects)
            const response = await chrome.tabs.sendMessage(request.tabId, {type: "replaceBody", content: new_objects, tabId: request.tabId});
        }
        else if(request.type === "highlight"){
            await chrome.scripting.insertCSS({
                files: ["style.css"],
                target: { tabId: request.tabId },
            });
        }
    }
);











