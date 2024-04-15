# Aplicação NER client-side 

## 💻Descrição do Projeto
Este projeto, resultado da colaboração entre o Instituto de Computação (IComp) da Universidade Federal do Amazonas (UFAM) e a empresa JusBrasil, visa explorar a viabilidade de uma aplicação com arquitetura *client-side* para identificar e destacar entidades nomeadas em texto. Para alcançar esse objetivo, desenvolvemos uma extensão, que nada mais é do que um software adicionado ao navegador e executado exclusivamente no lado do cliente, para o navegador Google Chrome. Além disso, conduzimos testes e coletamos dados para poder entender melhor o funcionamento da extensão.

Tabela de conteúdos
=================
<!--ts-->
   * [Capturas de tela](#-capturas-de-tela)
   * [Como usar](#como-usar)
   * [Tecnologias](#tecnologias)
<!--te-->

## 📸 Capturas de Tela

<p align="center">
  <img src="./assets/screenshot1.png" />
</p>

<p align="center">
  <img src="./assets/Screenshot2.png" />
</p>

## 📖 Como usar

Para poder utilizar a aplicação, você vai precisar ter instalado na sua máquina o navegador [Google Chrome](https://www.google.com/chrome/dr/download/?brand=JJTC&ds_kid=43700077663103092&gad_source=1&gclid=CjwKCAjwoPOwBhAeEiwAJuXRh6_4khON9QuxjT_aLSf2ldXvHtRgmmkHRSgigPImGnzoPdRMuQf2uRoCfFQQAvD_BwE&gclsrc=aw.ds).

```bash
# Clone este repositório
$ https://github.com/gioandrade7/ner_extension.git
```

1. Acesse chrome://extensions/.
2. No canto superior direito, ative o Modo do desenvolvedor.
3. Clique em Carregar sem compactação.
4. Encontre e selecione a pasta *predict_extension_bert* do repositório clonado.
5. Acesse uma página web que contenha texto.
6. Clique na extensão para ativá-la.

## 🛠 Tecnologias
As seguintes ferramentas foram usadas na construção do projeto:

- [Tensorflow](https://www.tensorflow.org/)
- [Tensorflow.js](https://www.tensorflow.org/js)
- [Huggin Face](https://huggingface.co/)
- [Transformer.js](https://huggingface.co/docs/transformers.js/en/index)
- [Onnx Runtime](https://onnxruntime.ai/)
- [Selenium](https://www.selenium.dev/)
