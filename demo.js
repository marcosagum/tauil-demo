// Retirada da produção da demonstração: lista guardada no navegador de quem está vendo,
// para o total mudar em todas as telas quando alguém registra uma retirada nova.
const CARDAPIO = [
  { nome: 'Cerveja lata', preco: 10 },
  { nome: 'Água 500 ml', preco: 5 },
  { nome: 'Coca lata', preco: 7 },
  { nome: 'Energético', preco: 15 },
  { nome: 'Drink da casa', preco: 25 },
  { nome: 'Hambúrguer', preco: 32 },
  { nome: 'Espetinho de carne', preco: 12 },
];
const QUEM = ['Coord. produção', 'Coord. palco', 'Camarim', 'Equipe técnica', 'Segurança'];
const LIMITE = 3000;
const INICIAL = [
  { item: 'Cerveja lata', qtd: 36, preco: 10, para: 'Artístico', quem: 'Camarim', hora: '18:50' },
  { item: 'Água 500 ml', qtd: 48, preco: 5, para: 'Produção', quem: 'Coord. produção', hora: '19:15' },
  { item: 'Hambúrguer', qtd: 10, preco: 32, para: 'Produção', quem: 'Equipe técnica', hora: '20:30' },
  { item: 'Energético', qtd: 12, preco: 15, para: 'Produção', quem: 'Coord. palco', hora: '21:05' },
  { item: 'Coca lata', qtd: 24, preco: 7, para: 'Artístico', quem: 'Camarim', hora: '21:40' },
];
const CHAVE = 'tauil-demo-retiradas';

function carregar() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE) || 'null');
    if (Array.isArray(salvo)) return salvo;
  } catch (e) { /* navegador sem armazenamento: segue com a lista inicial */ }
  return INICIAL.slice();
}
function salvar(lista) {
  try { localStorage.setItem(CHAVE, JSON.stringify(lista)); } catch (e) { /* ignora */ }
}
let retiradas = carregar();
let filtro = 'Todas';
let ultimoNovo = -1;

const brl = v => 'R$ ' + Math.round(v).toLocaleString('pt-BR');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const valor = r => r.qtd * r.preco;

function desenhar() {
  const total = retiradas.reduce((s, r) => s + valor(r), 0);
  const pct = Math.round(total / LIMITE * 100);
  const soma = para => retiradas.filter(r => r.para === para).reduce((s, r) => s + valor(r), 0);
  const situacao = pct >= 100 ? ['Limite estourado', 'bad'] : pct >= 80 ? ['Perto do limite', 'warn'] : ['Dentro do limite', 'ok'];

  document.querySelectorAll('[data-ret]').forEach(el => {
    const tipo = el.dataset.ret;
    if (tipo === 'total') el.textContent = brl(total);
    else if (tipo === 'pct') el.textContent = pct + '%';
    else if (tipo === 'producao') el.textContent = brl(soma('Produção'));
    else if (tipo === 'artistico') el.textContent = brl(soma('Artístico'));
    else if (tipo === 'qtd') el.textContent = retiradas.length;
    else if (tipo === 'barra') { el.style.width = Math.min(pct, 100) + '%'; el.classList.toggle('alto', pct >= 100); }
    else if (tipo === 'chip') {
      el.className = 'chip ' + situacao[1];
      el.textContent = el.dataset.formato === 'pct' ? pct + '% do limite' : situacao[0];
    }
    else if (tipo === 'lista') desenharLista(el);
  });
}

function desenharLista(el) {
  const modo = el.dataset.modo;
  // Mais recente primeiro; o índice original marca a linha que acabou de entrar.
  let linhas = retiradas.map((r, i) => ({ r, i })).reverse();
  if (modo === 'celular' && filtro !== 'Todas') linhas = linhas.filter(x => x.r.para === filtro);
  if (modo === 'mini') linhas = linhas.slice(0, 2);
  const novo = i => (i === ultimoNovo ? ' novo' : '');

  if (!linhas.length) { el.innerHTML = '<div class="vazio">Nenhuma retirada aqui ainda.</div>'; return; }
  if (modo === 'tabela') {
    el.innerHTML = linhas.map(({ r, i }) =>
      '<tr class="' + novo(i) + '"><td>' + esc(r.hora) + '</td><td class="pt-name">' + esc(r.item) + '</td><td class="r">' + r.qtd +
      '</td><td><span class="chip ' + (r.para === 'Produção' ? 'grey' : 'warn') + '">' + esc(r.para) + '</span></td><td>' + esc(r.quem) +
      '</td><td class="r">' + brl(r.preco) + '</td><td class="r"><b>' + brl(valor(r)) + '</b></td></tr>').join('');
  } else if (modo === 'mini') {
    el.innerHTML = linhas.map(({ r }) =>
      '<div class="mini-row"><span><b>' + esc(r.item) + ' × ' + r.qtd + '</b><br><span class="muted" style="font-size:13px">' +
      esc(r.para) + ' · ' + esc(r.hora) + '</span></span><b class="num">' + brl(valor(r)) + '</b></div>').join('');
  } else {
    el.innerHTML = linhas.map(({ r, i }) =>
      '<div class="m-row' + novo(i) + '"><div><div class="m-item">' + esc(r.item) + ' × ' + r.qtd + '</div><div class="m-meta">' +
      esc(r.para) + ' · ' + esc(r.quem) + ' · ' + esc(r.hora) + '</div></div><div class="m-val">' + brl(valor(r)) + '</div></div>').join('');
  }
}

function abrirNovaRetirada() {
  const veu = document.createElement('div');
  veu.className = 'veu';
  veu.innerHTML =
    '<form class="janela" role="dialog" aria-modal="true" aria-labelledby="nr-titulo">' +
    '<h3 id="nr-titulo">Nova retirada</h3>' +
    '<label class="campo"><span>Item</span><select name="produto">' +
    CARDAPIO.map((c, i) => '<option value="' + i + '">' + esc(c.nome) + ' · ' + brl(c.preco) + '</option>').join('') + '</select></label>' +
    '<div class="campo"><span>Quantidade</span><div class="qtd"><button type="button" data-q="-1" aria-label="Menos um">−</button>' +
    '<input name="qtd" type="number" inputmode="numeric" min="1" max="999" value="6" aria-label="Quantidade"><button type="button" data-q="1" aria-label="Mais um">+</button></div></div>' +
    '<div class="campo"><span>Para quem</span><div class="seg" data-para><button type="button" class="on">Produção</button><button type="button">Artístico</button></div></div>' +
    '<label class="campo"><span>Quem retirou</span><select name="quem">' + QUEM.map(q => '<option>' + esc(q) + '</option>').join('') + '</select></label>' +
    '<div class="janela-total"><span class="muted">Valor da retirada</span><b data-nr-total></b></div>' +
    '<div class="janela-botoes"><button type="button" class="btn" data-fechar>Cancelar</button><button type="submit" class="btn primary">Registrar</button></div>' +
    '</form>';
  document.body.appendChild(veu);
  const form = veu.querySelector('form');
  const qtd = form.elements.qtd;
  const atualizar = () => {
    const n = Math.max(1, Math.min(999, parseInt(qtd.value, 10) || 1));
    form.querySelector('[data-nr-total]').textContent = brl(n * CARDAPIO[form.elements.produto.value].preco);
  };
  const fechar = () => { veu.remove(); document.removeEventListener('keydown', tecla); };
  const tecla = e => { if (e.key === 'Escape') fechar(); };
  document.addEventListener('keydown', tecla);
  veu.addEventListener('click', e => {
    if (e.target === veu || e.target.closest('[data-fechar]')) fechar();
    const q = e.target.closest('[data-q]');
    if (q) { qtd.value = Math.max(1, (parseInt(qtd.value, 10) || 1) + Number(q.dataset.q)); atualizar(); }
    const p = e.target.closest('[data-para] button');
    if (p) { form.querySelectorAll('[data-para] button').forEach(b => b.classList.toggle('on', b === p)); }
  });
  form.addEventListener('input', atualizar);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const c = CARDAPIO[form.elements.produto.value];
    const agora = new Date();
    retiradas.push({
      item: c.nome,
      qtd: Math.max(1, Math.min(999, parseInt(qtd.value, 10) || 1)),
      preco: c.preco,
      para: form.querySelector('[data-para] .on').textContent,
      quem: form.elements.quem.value,
      hora: String(agora.getHours()).padStart(2, '0') + ':' + String(agora.getMinutes()).padStart(2, '0'),
    });
    ultimoNovo = retiradas.length - 1;
    salvar(retiradas);
    fechar();
    desenhar();
    avisar('Retirada registrada. O total já mudou em todas as telas.');
  });
  atualizar();
  form.elements.produto.focus();
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-acao]');
  if (el && el.dataset.acao === 'nova-retirada') abrirNovaRetirada();
  if (el && el.dataset.acao === 'restaurar') {
    try { localStorage.removeItem(CHAVE); } catch (err) { /* ignora */ }
    location.reload();
  }
  const f = e.target.closest('[data-filtro]');
  if (f) {
    filtro = f.dataset.filtro;
    f.parentElement.querySelectorAll('[data-filtro]').forEach(b => b.classList.toggle('on', b === f));
    desenhar();
  }
});
// Outra aba registrou uma retirada: atualiza esta também.
window.addEventListener('storage', e => { if (e.key === CHAVE) { retiradas = carregar(); desenhar(); } });

desenhar();
