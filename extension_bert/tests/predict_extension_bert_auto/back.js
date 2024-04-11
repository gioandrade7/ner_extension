import {
  pipeline,
  env,
  AutoTokenizer,
} from "https://cdn.jsdelivr.net/npm/@xenova/transformers@2.8.0";

env.backends.onnx.wasm.numThreads = 1;

async function tokenizador (sent){
  // Divide a sentença em palavras
  const palavras = sent.split(" ");

  // Define um tamanho máximo inicial para os chunks
  let tamanhoChunk = 200;

  // Arrays para armazenar os chunks e o chunk atual
  const chunks = [];
  let chunkAtual = "";

  // Itera sobre as palavras da sentença
  let i = 0;
  while (i < palavras.length) {
    // Se a palavra cabe no chunk atual, adicione ao chunk
    if (i < tamanhoChunk) {
      chunkAtual += palavras[i] + " ";
      i++;
    } else {
      // Caso contrário, adicione o chunk atual ao array de chunks
      chunks.push(chunkAtual);
      // Reinicie o chunk atual e dobre o tamanho máximo para o próximo chunk
      chunkAtual = "";
      tamanhoChunk += tamanhoChunk;
    }
  }
  // Adicione o último chunk ao array
  chunks.push(chunkAtual);

  // Retorne o array de chunks
  return chunks;
}

// Variáveis para medir tempo (reiniciadas a cada tipo de solicitação)
  let tempoInicio;
  let tempoFim;
  let tempoInicioPredicao = 0;
  let tempoFimPredicao = 0;
  let tempoTotalPredicao = 0;
  let tempoInicioMarcacao = 0;
  let tempoFimMarcacao = 0;
  let tempoTotalMarcacao = 0;

chrome.runtime.onMessage.addListener(async function (
  request,
  sender
) {
  // Armazena informações da aba do remetente
  const tab = sender.tab;

  // Manipulador de mensagens recebidas do content script
  if (request.type === "startTimer") {
    // Registra o tempo inicial de execução
    tempoInicio = performance.now();
  }

  if (request.type === "predict") {

    // Caminho para o modelo BERT
    const caminhoModelo = "lener_bert";

    // Carrega o tokenizer e o pipeline
    const tokenizer = await AutoTokenizer.from_pretrained(caminhoModelo);
    const pipe = await pipeline("token-classification", caminhoModelo);

    // Obtém o número de frases na mensagem
    const totalSentencas = Object.keys(request.message).length;

    // Prepara variáveis para armazenar dados processados
    const novosObjetos = [];
    let novoTexto = "";
    let textoEntidade = "";
    let entidade;
    let resultadoPredicao = [];

    // Itera por cada frase na mensagem (começa em 1 para evitar problemas de índice)
    for (let i = 1; i <= totalSentencas; i++) {
      // Registra o tempo inicial de predição
      tempoInicioPredicao = performance.now();

      let frase = request.message[i];

      // Tokeniza a frase
      const tokens = await tokenizer(frase);

      // Verifica se a frase excede o tamanho máximo de tokens
      if (tokens.input_ids.size > 512) {
        resultadoPredicao = [];
        const pedacos = await tokenizador(frase); // Utiliza a função separada de tokenização
        
        for (const pedaço of pedacos) {
          resultadoPredicao = resultadoPredicao.concat(
            await pipe(pedaço, { ignore_labels: [] })
          );
        }
      } else {
        // Realiza a predição para a frase inteira se estiver dentro do limite
        resultadoPredicao = await pipe(frase, { ignore_labels: [] });
      }

      

      // Registra o tempo final de predição
      tempoFimPredicao = performance.now();

      // Acumula o tempo total de predição
      tempoTotalPredicao += tempoFimPredicao - tempoInicioPredicao;

      // Processa o resultado da predição e gera o texto com marcações de entidades

      // Registra o tempo inicial de marcação
      tempoInicioMarcacao = performance.now();

      let indice = 0;
      resultadoPredicao.forEach((elemento) => {
        entidade = elemento.entity;
        textoEntidade = elemento.word;
        let adicionarEspaco = true;

        // Se o token está contido em uma palavra
        if (textoEntidade.slice(0, 2) === "##") {
          let indiceAnterior = indice - 1;
          let separador;

          // itera sobre os tokens anteriores, até achar o início da palavra
          while (
            indiceAnterior >= 0 &&
            resultadoPredicao[indiceAnterior].word.slice(0, 2) === "##"
          ) {
            indiceAnterior--;
          }
          // verifica se essa palavra pertence a alguma entidade
          if (
            indiceAnterior >= 0 &&
            resultadoPredicao[indiceAnterior].entity !== "O"
          ) {
            // caso pertença, marque a entidade desse token como I-entidade
            separador = resultadoPredicao[indiceAnterior].entity.split("-");
            entidade = "I-" + separador[1];
          } else {
            // caso não, a entidade será O
            entidade = resultadoPredicao[indiceAnterior].entity;
          }
          textoEntidade = elemento.word.slice(2, elemento.word.length);
          adicionarEspaco = false;
        }

        // Adiciona espaço antes do texto se necessário
        if (adicionarEspaco) novoTexto += " ";

        // se token não é uma entidade
        if (entidade === "O") {
          // texto da entidade permanece inalterado
          novoTexto += textoEntidade;
        } else {
          // se for uma entidade, o texto sofre os seguintes tratamentos
          if (entidade[0] === "I") {
            let key;
            if (indice > 0) {
              key = indice - 1;
              if (resultadoPredicao[key].entity === "O") {
                let split = entidade.split("-");
                entidade = "B-" + split[1];
              }
            } else {
              let split = entidade.split("-");
              entidade = "B-" + split[1];
            }
          }
          novoTexto += `<span class="${entidade}" id=yyy data-ext-id=yyy>${textoEntidade}</span>`;
        }
        indice++;
      });

      novoTexto = novoTexto.slice(1, novoTexto.length); // Remove space from the beginning.
      novosObjetos.push({ text: novoTexto, id: i });
      novoTexto = "";

      // Registra o tempo final de marcação
      tempoFimMarcacao = performance.now();

      // Acumula o tempo total de marcação
      tempoTotalMarcacao += tempoFimMarcacao - tempoInicioMarcacao;
    }


    await chrome.tabs.sendMessage(tab.id, {
      type: "replaceBody",
      content: novosObjetos,
      tabId: request.tabId,
    });
  } 
  else if (request.type === "highlight") {
    await chrome.scripting.insertCSS({
      files: ["style.css"],
      target: { tabId: tab.id },
    });


    tempoFim = performance.now() - tempoInicio;


    await chrome.tabs.sendMessage(tab.id, {
      type: "markTime",
      content: { tempoFim, tempoTotalMarcacao, tempoTotalPredicao},
      tabId: request.tabId,
    });
    tempoTotalPredicao = 0;
    tempoTotalMarcacao = 0;
  }
});










