(function () {
  const pricingTableBody = document.getElementById('pricingTableBody');
  const baseCostLabel = document.getElementById('baseCostLabel');

  const fields = {
    custo: document.getElementById('custo'),
    frete: document.getElementById('frete'),
    embalagem: document.getElementById('embalagem'),
    ads: document.getElementById('ads'),
    imposto: document.getElementById('imposto'),
    margem: document.getElementById('margem'),
  };

  const canais = [
    { nome: 'Shopee', taxa: 20, fixo: 5 },
    { nome: 'Mercado Livre', taxa: 16, fixo: 0 },
    { nome: 'Amazon', taxa: 15, fixo: 5 },
    { nome: 'Site', taxa: 0, fixo: 0 },
  ];

  function money(v) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function calcPreco(base, taxa, ads, imposto, margem, fixo) {
    const percent = (taxa + ads + imposto + margem) / 100;
    if (percent >= 0.99) return 0;
    return (base + fixo) / (1 - percent);
  }

  function update() {
    const custo = parseFloat(fields.custo.value || 0);
    const frete = parseFloat(fields.frete.value || 0);
    const embalagem = parseFloat(fields.embalagem.value || 0);
    const ads = parseFloat(fields.ads.value || 0);
    const imposto = parseFloat(fields.imposto.value || 0);
    const margem = parseFloat(fields.margem.value || 0);

    const base = custo + frete + embalagem;
    baseCostLabel.textContent = `Custo base: ${money(base)}`;

    pricingTableBody.innerHTML = canais.map(canal => {
      const preco = calcPreco(base, canal.taxa, ads, imposto, margem, canal.fixo);
      const lucro = preco - base - canal.fixo - (preco * ((canal.taxa + ads + imposto) / 100));
      return `
        <tr>
          <td>${canal.nome}</td>
          <td>${canal.taxa}%</td>
          <td>${money(canal.fixo)}</td>
          <td>${money(preco)}</td>
          <td>${money(lucro)}</td>
        </tr>
      `;
    }).join('');
  }

  Object.values(fields).forEach(field => field.addEventListener('input', update));
  update();
})();
