/**
 * JS Assessoria Contábil – recebe os checklists e grava na planilha.
 * Cole este código em Extensões > Apps Script da sua planilha Google.
 *
 * IMPORTANTE: troque a senha abaixo por uma só sua antes de implantar.
 * Ela fica só na sua conta Google (não vai para o GitHub).
 */
const SENHA_PAINEL = 'TROQUE-ESTA-SENHA';

const ABA = 'Respostas';
const ITENS = [
  'CNH ou RG e CPF', 'Comprovante de residência', 'Estado civil e regime de casamento', 'E-mail e telefone',
  'Contrato social e alterações', 'Inscrição municipal', 'Inscrição estadual', 'Comprovante de endereço da empresa', 'Alvarás e licenças',
  'NF de vendas', 'NF de compras e serviços tomados',
  'Extratos bancários PJ 2026', 'Extratos de aplicações', 'Relatórios de cartão/plataformas', 'Comprovantes de despesas',
  'Contratos de empréstimos', 'Contas a pagar e a receber', 'Balanço, DRE e balancetes', 'Pró-labore e distribuição de lucros',
  'Procuração digital Receita Federal', 'Senha do portal de NF anterior', 'Autorização portal da Prefeitura'
];
const FIXAS = ['ID', 'Empresa', 'Responsável', 'Marcados', 'Status', 'Primeiro envio', 'Atualizado em', 'Observações', 'Dados (não editar)'];

function doPost(e) {
  let req;
  try { req = JSON.parse(e.postData.contents); } catch (err) { return resposta({ ok: false, erro: 'json' }); }
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    if (req.action === 'salvar') return resposta(salvar(req.dados || {}));
    if (req.action === 'listar' || req.action === 'excluir') {
      if (SENHA_PAINEL === 'TROQUE-ESTA-SENHA' || String(req.senha) !== SENHA_PAINEL) return resposta({ ok: false, erro: 'senha' });
      return resposta(req.action === 'listar' ? { ok: true, respostas: listar() } : excluir(String(req.id || '')));
    }
    return resposta({ ok: false, erro: 'acao' });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return resposta({ ok: true, servico: 'checklist JS Assessoria' });
}

function aba() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(ABA);
  if (!sh) {
    sh = ss.insertSheet(ABA);
    sh.appendRow(FIXAS.concat(ITENS));
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, FIXAS.length + ITENS.length).setFontWeight('bold');
  }
  return sh;
}

// Evita que um texto digitado pelo cliente vire fórmula na planilha
function texto(v, max) {
  let s = String(v == null ? '' : v).slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function salvar(d) {
  const id = String(d.id || '');
  if (!/^[a-f0-9]{32}$/.test(id)) return { ok: false, erro: 'id' };
  const empresa = texto(d.empresa, 200);
  if (!empresa) return { ok: false, erro: 'empresa' };
  const itens = {};
  for (let i = 1; i <= ITENS.length; i++) itens['c' + i] = !!(d.itens && d.itens['c' + i]);
  const marcados = Object.keys(itens).filter(k => itens[k]).length;
  const agora = new Date();

  const sh = aba();
  const ids = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues().map(r => r[0]) : [];
  const pos = ids.indexOf(id);
  const criado = pos >= 0 ? sh.getRange(pos + 2, 6).getValue() : agora;
  const dados = { itens: itens, marcados: marcados };
  const linha = [id, empresa, texto(d.responsavel, 200), marcados + ' de ' + ITENS.length,
    marcados >= ITENS.length ? 'Completo' : 'Pendente', criado, agora, texto(d.observacoes, 4000), JSON.stringify(dados)]
    .concat(ITENS.map((_, i) => itens['c' + (i + 1)] ? 'Sim' : 'Não'));

  if (pos >= 0) sh.getRange(pos + 2, 1, 1, linha.length).setValues([linha]);
  else sh.appendRow(linha);
  return { ok: true };
}

function listar() {
  const sh = aba();
  if (sh.getLastRow() < 2) return [];
  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, FIXAS.length).getValues();
  return rows.filter(r => r[0]).map(r => {
    let dados = {};
    try { dados = JSON.parse(r[8]); } catch (e) {}
    return {
      id: String(r[0]), empresa: String(r[1]).replace(/^'/, ''), responsavel: String(r[2]).replace(/^'/, ''),
      marcados: dados.marcados || 0, itens: dados.itens || {},
      criadoEm: r[5] instanceof Date ? r[5].getTime() : null,
      atualizadoEm: r[6] instanceof Date ? r[6].getTime() : null,
      observacoes: String(r[7]).replace(/^'/, '')
    };
  });
}

function excluir(id) {
  const sh = aba();
  if (sh.getLastRow() < 2) return { ok: false };
  const ids = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues().map(r => r[0]);
  const pos = ids.indexOf(id);
  if (pos < 0) return { ok: false };
  sh.deleteRow(pos + 2);
  return { ok: true };
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
