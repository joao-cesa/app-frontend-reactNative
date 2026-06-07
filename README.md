# 📱 Minha Biblioteca (App Mobile)

Aplicativo mobile desenvolvido em **React Native** com **Expo**. Este app permite ao usuário buscar livros consumindo a API pública da *Open Library* e gerenciar sua estante pessoal consumindo um backend próprio (CRUD).

## 🚀 Tecnologias Utilizadas
* React Native
* Expo
* Axios (Consumo de APIs HTTP)
* Open Library API (Busca de livros)

## 📋 Pré-requisitos
* [Node.js](https://nodejs.org/) instalado.
* Aplicativo **Expo Go** instalado no seu celular (Android ou iOS).
* O **Backend** deste projeto deve estar rodando simultaneamente na sua máquina local.

## ⚠️ ATENÇÃO: Configuração do IP 
Como o aplicativo rodará no seu celular físico, ele não entende o termo `localhost`. Você **precisa** informar o IP exato da sua máquina para que o app encontre o servidor do backend na rede Wi-Fi.

1. Descubra o IP IPv4 da sua máquina (abra o terminal e digite `ipconfig` no Windows ou `ifconfig` no Linux/Mac).
2. Abra o arquivo `App.js` no seu editor de código.
3. Altere a constante `MEU_BACKEND_URL` (localizada no topo do arquivo) inserindo o seu IP real. 
   * **Exemplo de como deve ficar:** `const MEU_BACKEND_URL = 'http://192.168.1.15:3000/livros';`

## 🔧 Como Baixar e Executar o Projeto

1. **Clone este repositório:**
   ```bash
   git clone [https://github.com/joao-cesa/app-frontend-reactNative.git](https://github.com/joao-cesa/app-frontend-reactNative.git)

2. **Instale as dependências:**

npm install

3. **Inicie o servidor do Expo:**

npx expo start
