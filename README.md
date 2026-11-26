# Checklist de documentação – JS Assessoria Contábil

- `index.html`: formulário que o cliente abre e preenche (sem login).
- `painel.html`: acompanhamento das respostas, protegido por senha (só o escritório).
- `apps-script/Codigo.gs`: código que recebe as respostas e grava numa planilha Google sua.
- `config.js`: link do Apps Script e lista de documentos.

## Configuração (uma vez só)

1. Crie uma planilha nova no Google Planilhas (ex.: "Checklists clientes").
2. Na planilha: **Extensões > Apps Script**. Apague o conteúdo e cole o arquivo `apps-script/Codigo.gs`.
3. Na linha `const SENHA_PAINEL = 'TROQUE-ESTA-SENHA';` coloque uma senha só sua. Salve.
4. Clique em **Implantar > Nova implantação**, tipo **App da Web**:
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
5. Autorize o acesso quando o Google pedir e copie o **URL do app da Web** (termina em `/exec`).
6. Cole esse URL em `config.js`, no lugar de `COLE_AQUI_O_LINK_DO_APPS_SCRIPT`.

## Uso

- Link para os clientes: `https://jsassessoria.github.io/checklist-js/`
- Seu painel: `https://jsassessoria.github.io/checklist-js/painel.html` (pede a senha)
- As respostas também aparecem na aba **Respostas** da planilha, uma linha por cliente.

Se mudar o código do Apps Script depois, use **Implantar > Gerenciar implantações > Editar > Nova versão** para manter o mesmo link.
