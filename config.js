// Cole aqui o endereço do "App da Web" gerado no Google Apps Script (termina em /exec).
window.SCRIPT_URL = "COLE_AQUI_O_LINK_DO_APPS_SCRIPT";

// Lista de documentos do checklist (usada pelo formulário e pelo painel).
window.SECOES = [
  ["Documentação pessoal dos sócios", [
    "CNH ou RG e CPF.",
    "Comprovante de residência atualizado.",
    "Estado civil e regime de casamento, se aplicável.",
    "E-mail e telefone."]],
  ["Documentação empresarial e societária", [
    "Contrato social e todas as alterações contratuais.",
    "Inscrição municipal.",
    "Inscrição estadual, se houver.",
    "Comprovante de endereço da empresa.",
    "Alvarás e licenças existentes."]],
  ["Documentação fiscal", [
    "Notas fiscais de vendas, se houver.",
    "Notas fiscais de compras e serviços tomados."]],
  ["Documentação contábil e financeira", [
    "Extratos de todas as contas bancárias PJ de 2026.",
    "Extratos de aplicações financeiras da empresa.",
    "Relatórios de recebimentos por cartão e plataformas de pagamento, se houver.",
    "Comprovantes de despesas empresariais.",
    "Contratos de empréstimos e financiamentos.",
    "Relação de contas a pagar e a receber.",
    "Balanço patrimonial, DRE e balancetes disponíveis.",
    "Histórico de pró-labore e distribuição de lucros."]],
  ["Acessos e autorizações", [
    "Procuração digital para acesso à Receita Federal.",
    "Senha de acesso ao portal de emissão de notas fiscais utilizado anteriormente.",
    "Autorização de acesso ao portal da Prefeitura."]]
];

window.ITENS = [];
window.SECOES.forEach(function (s) {
  s[1].forEach(function (t) { window.ITENS.push({ id: "c" + (window.ITENS.length + 1), t: t, s: s[0] }); });
});

window.h = function (tag, attrs) {
  var e = document.createElement(tag);
  for (var k in (attrs || {})) {
    if (k === "class") e.className = attrs[k];
    else if (k === "text") e.textContent = attrs[k];
    else e.setAttribute(k, attrs[k]);
  }
  for (var i = 2; i < arguments.length; i++) { if (arguments[i] != null) e.append(arguments[i]); }
  return e;
};

window.chamarScript = function (corpo) {
  if (!window.SCRIPT_URL || window.SCRIPT_URL.indexOf("http") !== 0) {
    return Promise.reject(new Error("config"));
  }
  // text/plain evita a verificação CORS prévia, que o Apps Script não responde
  return fetch(window.SCRIPT_URL, { method: "POST", body: JSON.stringify(corpo) })
    .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.json(); });
};
