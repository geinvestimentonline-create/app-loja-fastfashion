const WHATSAPP = '5511933872929';

const products = [
  {
    id: 1,
    name: 'Corneta Torcida Brasil',
    category: 'Eventos',
    price: 19.9,
    image: 'assets/corneta.jpg',
    description: 'Produto sazonal para torcida e campanhas de Copa.'
  },
  {
    id: 2,
    name: 'Sutiã DeMillus 061486',
    category: 'Moda íntima',
    price: 59.9,
    image: 'assets/sutia.jpg',
    description: 'Alta sustentação, sem bojo e com excelente percepção de valor.'
  },
  {
    id: 3,
    name: 'Calcinha Modeladora DeMillus',
    category: 'Moda íntima',
    price: 29.9,
    image: 'assets/calcinha.jpg',
    description: 'Cintura alta, modelagem premium e ótimo complemento de ticket.'
  },
  {
    id: 4,
    name: 'Vestido Plus Size Premium',
    category: 'Moda feminina',
    price: 99.9,
    image: 'assets/vestido.jpg',
    description: 'Modelo amplo, confortável e com bolso funcional.'
  },
  {
    id: 5,
    name: 'Macacão Pantalona Elegante',
    category: 'Moda feminina',
    price: 129.9,
    image: 'assets/macacao.jpg',
    description: 'Peça visual forte para campanhas e anúncios.'
  },
  {
    id: 6,
    name: 'Kit 5 Panelas Antiaderentes',
    category: 'Casa & cozinha',
    price: 149.9,
    image: 'assets/panelas_kit5.jpg',
    description: 'Kit com ticket médio maior e boa margem no varejo.'
  },
  {
    id: 7,
    name: 'Kit Panelas com Utensílios',
    category: 'Casa & cozinha',
    price: 119.9,
    image: 'assets/panelas_4pecas_utensilios.jpg',
    description: 'Combo para aumentar valor percebido.'
  },
  {
    id: 8,
    name: 'Kit Panelas 3 Peças Premium',
    category: 'Casa & cozinha',
    price: 89.9,
    image: 'assets/panelas_3pecas.jpg',
    description: 'Opção de entrada para campanhas de preço.'
  },
  {
    id: 9,
    name: 'Kit Panelas 2 Peças',
    category: 'Casa & cozinha',
    price: 69.9,
    image: 'assets/panelas_2pecas.jpg',
    description: 'Oferta rápida para giro de estoque.'
  }
];

const categories = ['Todos', ...new Set(products.map(p => p.category))];
const grid = document.getElementById('productGrid');
const filters = document.getElementById('filters');

function formatBRL(v){
  return v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}

function renderFilters(active='Todos'){
  filters.innerHTML = categories.map(cat => `
    <button class="filter-chip ${cat===active?'active':''}" data-cat="${cat}">${cat}</button>
  `).join('');

  filters.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      renderFilters(cat);
      renderProducts(cat === 'Todos' ? products : products.filter(p => p.category === cat));
    });
  });
}

function buy(name){
  const text = `Olá, quero comprar: ${name}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank');
}

function renderProducts(list){
  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <img src="${p.image}" alt="${p.name}">
      <div class="product-content">
        <span class="product-category">${p.category}</span>
        <div class="product-title">${p.name}</div>
        <p class="product-desc">${p.description}</p>
        <div class="product-bottom">
          <strong class="product-price">${formatBRL(p.price)}</strong>
          <button class="btn btn-primary" onclick="buy('${String(p.name).replace(/'/g, "\\'")}')">Comprar</button>
        </div>
      </div>
    </article>
  `).join('');
}

window.buy = buy;
renderFilters();
renderProducts(products);
