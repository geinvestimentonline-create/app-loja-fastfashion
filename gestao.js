const MARKETPLACE_DEFAULTS = {
  site: 0,
  shopee: 20,
  mercadolivre: 16,
  amazon: 15
};

const settingsKey = 'ffs_settings';
const historyKey = 'ffs_history';

const freteEl = document.getElementById('frete');
const embalagemEl = document.getElementById('embalagem');
const adsEl = document.getElementById('ads');
const impostoEl = document.getElementById('imposto');
const margemEl = document.getElementById('margem');
const taxaFixaEl = document.getElementById('taxaFixa');
const produtoEl = document.getElementById('produto');
const custoEl = document.getElementById('custo');
const marketplaceEl = document.getElementById('marketplace');
const comissaoEl = document.getElementById('comissao');
const historyBody = document.getElementById('historyBody');

function formatBRL(v){
  return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}

function loadSettings(){
  const saved = JSON.parse(localStorage.getItem(settingsKey) || '{}');
  freteEl.value = saved.frete ?? 25;
  embalagemEl.value = saved.embalagem ?? 2;
  adsEl.value = saved.ads ?? 5;
  impostoEl.value = saved.imposto ?? 5;
  margemEl.value = saved.margem ?? 20;
  taxaFixaEl.value = saved.taxaFixa ?? 5;
}

function saveSettings(){
  const data = getSettings();
  localStorage.setItem(settingsKey, JSON.stringify(data));
  alert('Configuração salva no navegador.');
}

function getSettings(){
  return {
    frete: Number(freteEl.value || 0),
    embalagem: Number(embalagemEl.value || 0),
    ads: Number(adsEl.value || 0),
    imposto: Number(impostoEl.value || 0),
    margem: Number(margemEl.value || 0),
    taxaFixa: Number(taxaFixaEl.value || 0)
  };
}

function syncCommission(){
  comissaoEl.value = MARKETPLACE_DEFAULTS[marketplaceEl.value] ?? 0;
}

function calculate(){
  const settings = getSettings();
  const custo = Number(custoEl.value || 0);
  const comissao = Number(comissaoEl.value || 0);
  const marketplace = marketplaceEl.value;
  const taxaFixa = (marketplace === 'shopee' || marketplace === 'amazon') ? settings.taxaFixa : 0;

  const custoBase = custo + settings.frete + settings.embalagem + taxaFixa;
  const taxaPercentual = (settings.ads + settings.imposto + settings.margem + comissao) / 100;
  const precoIdeal = custoBase / (1 - taxaPercentual);
  const lucroLiquido = precoIdeal - custoBase - (precoIdeal * (settings.ads + settings.imposto + comissao) / 100);
  const margemReal = precoIdeal > 0 ? (lucroLiquido / precoIdeal) * 100 : 0;

  document.getElementById('precoIdeal').textContent = formatBRL(precoIdeal);
  document.getElementById('lucroLiquido').textContent = formatBRL(lucroLiquido);
  document.getElementById('margemReal').textContent = `${margemReal.toFixed(2)}%`;

  return {
    produto: produtoEl.value || 'Produto sem nome',
    canal: marketplaceEl.options[marketplaceEl.selectedIndex].text,
    custoBase,
    precoIdeal,
    lucroLiquido
  };
}

function renderHistory(){
  const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
  historyBody.innerHTML = history.map(item => `
    <tr>
      <td>${item.produto}</td>
      <td>${item.canal}</td>
      <td>${formatBRL(item.custoBase)}</td>
      <td>${formatBRL(item.precoIdeal)}</td>
      <td>${formatBRL(item.lucroLiquido)}</td>
    </tr>
  `).join('');
}

function addToHistory(){
  const item = calculate();
  const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
  history.unshift(item);
  localStorage.setItem(historyKey, JSON.stringify(history.slice(0, 20)));
  renderHistory();
}

document.getElementById('saveSettings').addEventListener('click', saveSettings);
document.getElementById('calcButton').addEventListener('click', calculate);
document.getElementById('addToList').addEventListener('click', addToHistory);
marketplaceEl.addEventListener('change', syncCommission);

loadSettings();
syncCommission();
renderHistory();
calculate();
