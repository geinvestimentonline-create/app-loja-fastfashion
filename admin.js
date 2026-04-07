(function () {
  const storageProductsKey = 'ff_products';
  const storageConfigKey = 'ff_config';

  let products = JSON.parse(localStorage.getItem(storageProductsKey) || 'null') || JSON.parse(JSON.stringify(defaultProducts));
  let config = JSON.parse(localStorage.getItem(storageConfigKey) || 'null') || JSON.parse(JSON.stringify(defaultSiteConfig));

  const configFields = ['storeName','storeSubtitle','whatsapp','heroBadge','heroTitle','heroText','heroButton1','heroButton2','footerText'];
  const editorList = document.getElementById('productEditorList');
  const msg = document.getElementById('adminMessage');

  function showMessage(text) {
    msg.textContent = text;
    setTimeout(() => { msg.textContent = ''; }, 3000);
  }

  function fillConfig() {
    configFields.forEach(key => {
      const el = document.getElementById(key);
      if (el) el.value = config[key] || '';
    });
  }

  function productEditor(item, index) {
    return `
      <div class="editor-card" data-index="${index}">
        <div class="editor-card-head">
          <strong>Produto ${index + 1}</strong>
          <button class="link-danger" type="button" data-remove="${index}">Remover</button>
        </div>
        <div class="form-grid">
          <label>Nome
            <input data-field="nome" type="text" value="${item.nome || ''}">
          </label>
          <label>Categoria
            <input data-field="categoria" type="text" value="${item.categoria || ''}">
          </label>
          <label>Preço
            <input data-field="preco" type="number" step="0.01" value="${item.preco || 0}">
          </label>
          <label>Imagem
            <input data-field="imagem" type="text" value="${item.imagem || ''}">
          </label>
          <label>Tag
            <input data-field="tag" type="text" value="${item.tag || ''}">
          </label>
          <label>ID
            <input data-field="id" type="number" value="${item.id || index + 1}">
          </label>
          <label class="span-3">Descrição
            <input data-field="descricao" type="text" value="${item.descricao || ''}">
          </label>
        </div>
      </div>
    `;
  }

  function renderEditors() {
    editorList.innerHTML = products.map(productEditor).join('');
  }

  function syncFromForm() {
    configFields.forEach(key => {
      const el = document.getElementById(key);
      config[key] = el.value.trim();
    });

    const cards = editorList.querySelectorAll('.editor-card');
    products = Array.from(cards).map(card => {
      const get = field => card.querySelector(`[data-field="${field}"]`).value;
      return {
        id: Number(get('id')) || Date.now(),
        nome: get('nome'),
        categoria: get('categoria'),
        preco: Number(get('preco')) || 0,
        imagem: get('imagem'),
        descricao: get('descricao'),
        tag: get('tag')
      };
    });
  }

  editorList.addEventListener('input', () => syncFromForm());

  editorList.addEventListener('click', (e) => {
    const removeIndex = e.target.getAttribute('data-remove');
    if (removeIndex === null) return;
    products.splice(Number(removeIndex), 1);
    renderEditors();
    syncFromForm();
  });

  document.getElementById('addProductBtn').addEventListener('click', () => {
    products.push({
      id: Date.now(),
      nome: 'Novo produto',
      categoria: 'Categoria',
      preco: 0,
      imagem: 'assets/kit-5-panelas.jpg',
      descricao: 'Descrição do produto.',
      tag: 'Novo'
    });
    renderEditors();
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
    syncFromForm();
    localStorage.setItem(storageProductsKey, JSON.stringify(products));
    localStorage.setItem(storageConfigKey, JSON.stringify(config));
    showMessage('Alterações salvas no navegador. Abra a loja para conferir.');
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    localStorage.removeItem(storageProductsKey);
    localStorage.removeItem(storageConfigKey);
    products = JSON.parse(JSON.stringify(defaultProducts));
    config = JSON.parse(JSON.stringify(defaultSiteConfig));
    fillConfig();
    renderEditors();
    showMessage('Configuração padrão restaurada.');
  });

  document.getElementById('exportBtn').addEventListener('click', () => {
    syncFromForm();
    const data = { config, products };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'backup-loja.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  document.getElementById('importInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const data = JSON.parse(text);
    if (data.config) config = data.config;
    if (Array.isArray(data.products)) products = data.products;
    localStorage.setItem(storageProductsKey, JSON.stringify(products));
    localStorage.setItem(storageConfigKey, JSON.stringify(config));
    fillConfig();
    renderEditors();
    showMessage('Backup importado com sucesso.');
  });

  fillConfig();
  renderEditors();
})();
