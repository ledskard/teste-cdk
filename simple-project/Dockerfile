# Escolha uma imagem base
FROM node:alpine

# Defina o diretório de trabalho no container
WORKDIR /app

# Copie o package.json e o package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o resto dos arquivos do projeto para o diretório de trabalho
COPY . .

# Construa o projeto Next.js
RUN npm run build

# Exponha a porta que o Next.js roda (por padrão, 3000)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
