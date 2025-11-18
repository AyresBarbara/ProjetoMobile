# 📚 Biblioteca Mobile - React Native

## 📱 Sobre o Projeto
App mobile para busca, exploração e gerenciamento de livros com funcionalidades avançadas de geolocalização e sistema de favoritos.

---

## 🎯 Funcionalidades Implementadas

### 1. **Navegação entre Telas (React Navigation)**
- ✅ Stack Navigator com 4 telas
- ✅ Navegação fluida entre Home, Detalhes, Favoritos e Bibliotecas Próximas
- ✅ Header personalizado com botão de favoritos

### 2. **FlatList Otimizada**
- ✅ Lista de livros com renderização personalizada
- ✅ Performance otimizada sem lag
- ✅ Mais de 5 itens dinâmicos
- ✅ Design responsivo para mobile e tablet

### 3. **Consumo de API REST Externa**
- ✅ Google Books API para busca de livros
- ✅ Estados de carregamento, sucesso e erro
- ✅ Tratamento de erros amigável
- ✅ Busca em tempo real

### 4. **Armazenamento Local de Dados**
- ✅ AsyncStorage para favoritos
- ✅ Persistência de dados entre sessões
- ✅ Context API para gerenciamento de estado
- ✅ Adicionar/remover favoritos

### 5. **Sensor do Dispositivo**
- ✅ Geolocalização ativa e funcionando
- ✅ 15 locais encontrados em tempo real
- ✅ Cálculo preciso de distâncias (ex: 475m, 547m)
- ✅ Dados reais da API OpenStreetMap
- ✅ Integração com Google Maps
- ⚠️ *Alguns endereços podem aparecer incompletos - comportamento esperado da API*

---

## 🛠️ Tecnologias e Bibliotecas

### **Core**
- React Native
- Expo
- React Navigation
- AsyncStorage

### **APIs e Sensores**
- Expo Location
- Google Books API
- OpenStreetMap API

### **Gerenciamento de Estado**
- Context API
- React Hooks (useState, useEffect, useContext)

---

## 🔗 APIs Utilizadas

### **Google Books API**
- **URL:** https://www.googleapis.com/books/v1/volumes
- **Autenticação:** Pública (não requer API Key)
- **Uso:** Busca de livros por título e autor

### **OpenStreetMap Nominatim API**
- **URL:** https://nominatim.openstreetmap.org/search
- **Autenticação:** Pública
- **Uso:** Busca de bibliotecas e livrarias próximas

---

## 📲 Sensores Implementados

### **Geolocalização**
- **Biblioteca:** expo-location
- **Funcionalidade:** Encontrar bibliotecas próximas
- **Recursos:** 
  - Permissões de localização
  - Coordenadas em tempo real
  - Cálculo de distância
  - Integração com maps

---

## 🚀 Instalação e Execução

### **Pré-requisitos**
- Node.js 16+
- npm ou yarn
- Expo CLI
- Dispositivo móvel com Expo Go ou emulador

### **Instalação**
```bash
# Clone o repositório
git clone https://github.com/AyresBarbara/ProjetoMobile.git

# Entre na pasta do projeto
cd ProjetoMobile

# Instale as dependências
npm install
```

### **Execução***
```bash
# Execute o projeto com Expo
npx expo start

# Após executar o comando:
# - Escaneie o QR Code com o app Expo Go (dispositivo físico)
# - Ou pressione:
#   'a' para abrir no Android Emulator
#   'i' para abrir no iOS Simulator
#   'w' para abrir no navegador web
```

## 📸 Screenshots

### 🏠 Tela Inicial
![Tela Inicial](https://github.com/AyresBarbara/ProjetoMobile/blob/main/assets/screenshots/Home.jpeg?raw=true)

### 📖 Detalhes do Livro  
![Detalhes do Livro](https://github.com/AyresBarbara/ProjetoMobile/blob/main/assets/screenshots/Detalhes.jpeg?raw=true)

### ❤️ Favoritos
![Tela de Favoritos](https://github.com/AyresBarbara/ProjetoMobile/blob/main/assets/screenshots/Favoritos.jpeg?raw=true)

### 📍 Bibliotecas Próximas
![Bibliotecas Próximas](https://github.com/AyresBarbara/ProjetoMobile/blob/main/assets/screenshots/GeoLocaliza%C3%A7%C3%A3o.jpeg?raw=true)

## 👥 Integrantes do Projeto

| Nome Completo | Matrícula |
|---------------|-----------|
| João Pedro Carneiro da Silva | 01711431 |
| Wilson Francisco do Nascimento | 01710813 |
| Gustavo Andrew Gomes da Silva | 01711566 |
| Bárbara Fernanda Ayres da Silva | 01146760 |
| Silas Rafael Vieira de Albuquerque | 01710966 |
| Isllâne Maria da Silva | 01534705 |