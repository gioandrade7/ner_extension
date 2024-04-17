import word2idx from './jus/jus_word2idx.js';

import * as tf from "./tensorFlow.js"

// // JavaScript

export async function loadModel(){
    return await tf.loadLayersModel('./model.json')
}

export const predict = (model, text) => {

    const max_tam = 124;

    const input = [];
    for(var i = 0; i < max_tam; i++){
        if(i < text.length){
            if (text[i] in word2idx){
                input.push(word2idx[text[i]]);
            }
            else{
                input.push(word2idx['UNK']);
            }
        }
        else{
            input.push(word2idx['PAD']);
        } 
    }

    const input2 = tf.tensor(input, [1, max_tam]);

    const output = model.predict(input2).arraySync();
    return output

}



    
