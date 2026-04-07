(function () {
  const grid = document.getElementById('productGrid');
  const searchInput = document.getElementById('searchInput');
  const chips = document.getElementById('quickChips');
  const emptyState = document.getElementById('emptyState');
  const collectionButtons = document.querySelectorAll('[data-filter]');
  let currentFilter = 'all';
  let currentSearch = '';

  function currency(v) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function renderChips(items) {
    const tags = [...new Set(items.map(item => item.tag).filter(Boolean))];
    chips.innerHTML = tags.map(tag => `<button class="chip" data-chip="${tag}">${tag}</button>`).join('');
    chips.querySelectorAll('[data-chip]').forEach(btn => {
      btn.addEventListener('click', () => {
        currentSearch = btn.dataset.chip.toLowerCase();
        searchInput.value = btn.dataset.chip;
        renderProducts();
      });
    });
  }

  function cardTemplate(product) {
    const msg = encodeURIComponent(`Olá, quero comprar: ${product.nome}`);
    return `
      <article class="product-card">
        <div class="product-image-wrap">
          <img src="${product.imagem}" alt="${product.nome}" onerror="this.src='assets/kit-5-panelas.jpg'">
          <span class="product-tag">${product.tag || product.categoria}</span>
        </div>
        <div class="product-body">
          <span class="product-category">${product.categoria}</span>
          <h3>${product.nome}</h3>
          <p>${product.descricao}</p>
          <div class="product-footer">
            <div>
              <strong class="product-price">${currency(product.preco)}</strong>
              <small>ou no WhatsApp</small>
            </div>
            <a class="btn btn-primary btn-small" target="_blank" href="https://wa.me/5511933872929?text=${msg}">Comprar</a>
          </div>
        </div>
      </article>
    `;
  }

  function renderFeatured() {
    const featured = products.find(p => p.destaque) || products[0];
    if (!featured) return;
    document.getElementById('heroFeaturedName').textContent = featured.nome;
    document.getElementById('heroFeaturedDesc').textContent = featured.descricao;
    document.getElementById('heroFeaturedPrice').textContent = currency(featured.preco);
  }

  function renderProducts() {
    const filtered = products.filter(product => {
      const okFilter = currentFilter === 'all' ? true : product.categoria === currentFilter;
      const term = currentSearch.trim().toLowerCase();
      const okSearch = term
        ? [product.nome, product.categoria, product.tag, product.descricao].join(' ').toLowerCase().includes(term)
        : true;
      return okFilter && okSearch;
    });

    grid.innerHTML = filtered.map(cardTemplate).join('');
    emptyState.classList.toggle('hidden', filtered.length !== 0);
  }

  collectionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      collectionButtons.forEach(el => el.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderProducts();
    });
  });

  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderProducts();
  });

  renderFeatured();
  renderChips(products);
  renderProducts();
})();
