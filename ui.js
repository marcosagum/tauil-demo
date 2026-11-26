// Partes que se repetem em todas as telas: ícones, menu lateral, barra do topo e aviso rápido.
// Abrir uma tela com ?print na URL deixa ela no tamanho exato usado nos prints da apresentação.
if (location.search.indexOf('print') !== -1) document.documentElement.classList.add('print');

const ICONES = {
  painel: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  eventos: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  retirada: '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  parceiros: '<path d="M3 16V7h11v9M14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  fechamento: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12l3 3 5-6"/>',
  equipe: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.8c1.6.8 2.6 2.6 3 5.2"/>',
  cardapio: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  relatorios: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  seta: '<path d="M6 9l6 6 6-6"/>',
  sino: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  mais: '<path d="M12 5v14M5 12h14"/>',
  compartilhar: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  enviar: '<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/>',
  alerta: '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17.5v.5"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  computador: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  celular: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  baixar: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
};
function icone(nome) {
  return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true">' + ICONES[nome] + '</svg>';
}
document.querySelectorAll('i[data-i]').forEach(el => { el.outerHTML = icone(el.dataset.i); });

// Menu lateral: [id, nome, endereço]. Sem endereço = "em breve" nesta demonstração.
const MENU = [
  ['painel', 'Painel', 'painel.html'],
  ['eventos', 'Eventos', null],
  ['retirada', 'Retirada da produção', 'retirada.html'],
  ['parceiros', 'Parceiros', 'parceiros.html'],
  ['fechamento', 'Fechamento', 'fechamento.html'],
  ['equipe', 'Equipe', 'equipe.html'],
  ['cardapio', 'Cardápio', null],
  ['relatorios', 'Relatório do evento', 'relatorio.html'],
];
const lado = document.getElementById('side');
if (lado) {
  const ativo = lado.dataset.on;
  lado.className = 'side';
  lado.innerHTML =
    '<a class="logo" href="index.html"><div class="logo-mark"><span style="height:8px"></span><span style="height:13px"></span><span style="height:20px"></span></div><div class="logo-name">Tauil System</div></a>' +
    MENU.map(([id, nome, href]) => href
      ? '<a class="nav' + (id === ativo ? ' on' : '') + '" href="' + href + '">' + icone(id) + nome + '</a>'
      : '<div class="nav off" data-acao="breve">' + icone(id) + nome + '<span class="soon">EM BREVE</span></div>'
    ).join('') +
    '<div class="side-foot">Demonstração com dados de exemplo.<br><a href="celular-app.html">Ver no celular</a> · <button data-acao="restaurar" style="color:var(--amber);font-weight:700;font-size:13px">Recomeçar</button></div>';

  const aviso = document.createElement('div');
  aviso.className = 'aviso-celular';
  aviso.innerHTML = icone('computador') + 'Esta é a tela do computador.<a href="celular-app.html">Ver a do celular</a>';
  document.body.prepend(aviso);
}
const topo = document.getElementById('top');
if (topo) {
  topo.className = 'top';
  topo.innerHTML =
    '<div class="event-pick" data-acao="breve">' + icone('eventos') + 'Evento de exemplo · Sáb, 22/11' + icone('seta') + '</div>' +
    '<span class="chip live">AO VIVO</span>' +
    '<div class="top-right"><span class="chip demo">DADOS DE EXEMPLO</span><span class="muted" data-acao="aviso" data-msg="Nenhum aviso novo.">' + icone('sino') + '</span><div class="avatar">T</div></div>';
}

// Aviso rápido no rodapé da tela.
let avisoTimer = null;
function avisar(texto) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.innerHTML = icone('check') + '<span></span>';
  t.querySelector('span').textContent = texto;
  clearTimeout(avisoTimer);
  avisoTimer = setTimeout(() => t.remove(), 2800);
}

// Ações simples de demonstração (as da retirada ficam em demo.js).
document.addEventListener('click', e => {
  const el = e.target.closest('[data-acao]');
  if (!el) return;
  const acao = el.dataset.acao;
  if (acao === 'breve') avisar('Essa parte entra na versão completa do sistema.');
  else if (acao === 'aviso') avisar(el.dataset.msg || 'Feito.');
  else if (acao === 'imprimir') window.print();
  else if (acao === 'enviar-link') enviarLink(el, true);
  else if (acao === 'enviar-todos') {
    document.querySelectorAll('[data-acao="enviar-link"]').forEach(b => enviarLink(b, false));
    avisar('Extratos enviados por link para todos os parceiros.');
  }
  else if (acao === 'aprovar') {
    el.disabled = true;
    el.innerHTML = icone('check') + 'Fechamento aprovado';
    const st = document.querySelector('[data-aprovacao]');
    if (st) { st.className = 'chip ok'; st.innerHTML = icone('check'); }
    avisar('Fechamento do Bar aprovado. O relatório já está pronto.');
  }
});
function enviarLink(botao, comAviso) {
  const chip = document.createElement('span');
  chip.className = 'chip ok';
  chip.textContent = 'Enviado agora';
  botao.replaceWith(chip);
  const cont = document.querySelector('[data-extratos]');
  if (cont) cont.textContent = '2 de 2';
  if (comAviso) avisar('Extrato enviado por link ao parceiro.');
}
