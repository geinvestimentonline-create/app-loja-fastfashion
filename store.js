(function () {
  const storageProductsKey = 'ff_products';
  const storageConfigKey = 'ff_config';
  const products = JSON.parse(localStorage.getItem(storageProductsKey) || 'null') || defaultProducts;
  const config = JSON.parse(localStorage.getItem(storageConfigKey) || 'null') || defaultSiteConfig;

  function money(v) {
    return Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function waLink(text) {
    return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function setHref(id, href) {
    const el = document.getElementById(id);
    if (el) el.href = href;
  }

  function applyConfig() {
    document.title = config.storeName;
    setText('brandName', config.storeName);
    setText('footerName', config.storeName);
    setText('topbarText', config.storeSubtitle);
    setText('heroBadge', config.heroBadge);
    setText('heroTitle', config.heroTitle);
    setText('heroText', config.heroText);
    setText('heroBtn1', config.heroButton1);
    setText('heroBtn2', config.heroButton2);
    setText('footerText', config.footerText);
    setHref('topbarWhatsapp', waLink('Olá, quero atendimento.'));
    setHref('headerWhatsapp', waLink('Olá, quero atendimento.'));
    setHref('heroBtn2', waLink('Olá, vim pela loja e quero atendimento.'));
    setHref('footerWhatsapp', waLink('Olá, vim pela loja e quero atendimento.'));
  }

  function renderCategories(items) {
    const wrap = document.getElementById('categoryGrid');
    const categorias = ['Todos', ...new Set(items.map(i => i.categoria))];
    wrap.innerHTML = categorias.map(cat => `<button class="collection-card ${cat==='Todos' ? 'active' : ''}" data-filter="${cat}">${cat}</button>`).join('');
  }

  function renderFeatured(items) {
    const featured = items[0];
    if (!featured) return;
    setText('heroFeaturedName', featured.nome);
    setText('heroFeaturedDesc', featured.descricao);
    setText('heroFeaturedPrice', money(featured.preco));
  }

  function renderProducts(items, filter='Todos', search='') {
    const grid = document.getElementById('productGrid');
    const emptyState = document.getElementById('emptyState');

    const filtered = items.filter(item => {
      const okFilter = filter === 'Todos' ? true : item.categoria === filter;
      const term = search.trim().toLowerCase();
      const hay = [item.nome, item.categoria, item.descricao, item.tag].join(' ').toLowerCase();
      const okSearch = term ? hay.includes(term) : true;
      return okFilter && okSearch;
    });

    grid.innerHTML = filtered.map(item => `
      <article class="product-card">
        <div class="product-image-wrap">
          <img src="${item.imagem}" alt="${item.nome}">
          <span class="product-tag">${item.tag || item.categoria}</span>
        </div>
        <div class="product-body">
          <span class="product-category">${item.categoria}</span>
          <h3>${item.nome}</h3>
          <p>${item.descricao}</p>
          <div class="product-footer">
            <div>
              <strong class="product-price">${money(item.preco)}</strong>
              <small>Atendimento direto</small>
            </div>
            <a class="btn btn-primary btn-small" target="_blank" href="${waLink('Olá, quero comprar: ' + item.nome)}">Comprar</a>
          </div>
        </div>
      </article>
    `).join('');

    emptyState.classList.toggle('hidden', filtered.length !== 0);
  }

  applyConfig();
  renderCategories(products);
  renderFeatured(products);

  let currentFilter = 'Todos';
  let currentSearch = '';
  renderProducts(products, currentFilter, currentSearch);

  document.getElementById('categoryGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    document.querySelectorAll('#categoryGrid .collection-card').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderProducts(products, currentFilter, currentSearch);
  });

  document.getElementById('searchInput').addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderProducts(products, currentFilter, currentSearch);
  });
})();
