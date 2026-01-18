# Minha Biblioteca - Gerenciador de Livros

Uma aplicação web responsiva para organizar e acompanhar suas leituras, desenvolvida com HTML, CSS e JavaScript vanilla.

## Funcionalidades

### ✅ Gerenciamento de Livros
- **Adicionar** novos livros à biblioteca
- **Editar** informações de livros existentes
- **Excluir** livros da biblioteca
- **Listar** todos os livros com layout responsivo

### ✅ Informações do Livro
- **Título** (obrigatório)
- **Autor** (obrigatório)
- **URL da Imagem** (opcional)
- **Status**: Quero ler, Lendo, Lido
- **Avaliação** em estrelas (0-5)
- **Comentário** pessoal sobre o livro

### ✅ Recursos Adicionais
- **Busca** por título ou autor
- **Filtro** por status de leitura
- **Estatísticas** em tempo real
- **localStorage** para persistência dos dados
- **Layout responsivo** para desktop e mobile
- **Modal** para adicionar/editar livros

## Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos responsivos com CSS Grid/Flexbox
- **JavaScript ES6+** - Lógica da aplicação
- **Google Fonts** - Inter font family
- **localStorage** - Persistência de dados

## Estrutura do Projeto

```
styleguide/
├── index.html           # Página principal da aplicação
├── app.js              # Lógica principal da aplicação
├── css/
│   ├── variables.css   # Variáveis CSS (design tokens)
│   └── typography.css  # Sistema de tipografia
├── components/
│   ├── buttons.css     # Estilos dos botões
│   ├── buttons.js      # Funcionalidade dos botões
│   ├── fields.css      # Estilos dos campos de formulário
│   ├── fields.js       # Funcionalidade dos campos
│   ├── cards.css       # Estilos dos cards de livros
│   └── cards.js        # Funcionalidade dos cards
└── icons/              # Pasta para ícones personalizados
```

## Como Usar

1. **Abra** o arquivo `index.html` no seu navegador
2. **Clique** em "Adicionar livro" para criar seu primeiro livro
3. **Preencha** as informações no modal que aparecerá
4. **Clique** nas estrelas para dar uma avaliação
5. **Salve** o livro e veja-o aparecer na sua biblioteca

## Funcionalidades Implementadas

### 📱 Interface Responsiva
- ✅ Layout desktop com grid de cards
- ✅ Layout mobile com cards empilhados
- ✅ Modal responsivo para formulários

### 💾 Persistência de Dados
- ✅ Dados salvos no localStorage do navegador
- ✅ Carregamento automático dos dados ao abrir a aplicação

### 🔍 Busca e Filtros
- ✅ Campo de busca por título ou autor
- ✅ Filtro por status de leitura
- ✅ Atualização em tempo real dos resultados

### ⭐ Sistema de Avaliação
- ✅ Rating interativo com estrelas
- ✅ Hover effects nas estrelas
- ✅ Botão para limpar avaliação

### 📊 Estatísticas
- ✅ Contadores em tempo real
- ✅ Total de livros
- ✅ Livros por status (Quero ler, Lendo, Lidos)

## Navegadores Compatíveis

- ✅ Chrome (versões recentes)
- ✅ Firefox (versões recentes)
- ✅ Safari (versões recentes)
- ✅ Edge (versões recentes)

## Design System

A aplicação utiliza um design system consistente com:

- **Cores**: Paleta baseada em cinzas com acentos coloridos
- **Tipografia**: Inter font com hierarquia clara
- **Espaçamentos**: Sistema consistente de margens e paddings
- **Componentes**: Botões, campos e cards reutilizáveis

## Desenvolvido por

**Bilie Silva** - Janeiro 2026

---

*Esta aplicação foi desenvolvida como parte de um projeto de estudos em desenvolvimento web frontend.*