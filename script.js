
const LANGS = ['en', 'zh', 'ru', 'ar'];

function getSavedLang() {
  const saved = localStorage.getItem('siteLang4');
  return LANGS.includes(saved) ? saved : 'en';
}

function applyText(lang) {
  document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : lang);
  const rtl = lang === 'ar';
  document.body.classList.toggle('rtl', rtl);

  document.querySelectorAll('[data-en]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val !== null) el.innerHTML = val;
  });

  const selector = document.getElementById('lang-select');
  if (selector) selector.value = lang;
}

function setLang(lang) {
  localStorage.setItem('siteLang4', lang);
  applyText(lang);
  renderCart();
}

function getCart() {
  return JSON.parse(localStorage.getItem('siteCart4') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('siteCart4', JSON.stringify(cart));
}

const products = [
  {
    id:'injector',
    price:100,
    name:{en:'Fuel Injector', zh:'燃油喷油器', ru:'Топливная форсунка', ar:'حاقن الوقود'}
  },
  {
    id:'filter',
    price:20,
    name:{en:'Filter Kit', zh:'滤芯套装', ru:'Комплект фильтров', ar:'طقم الفلاتر'}
  },
  {
    id:'piston',
    price:80,
    name:{en:'Piston Set', zh:'活塞组件', ru:'Комплект поршней', ar:'مجموعة المكابس'}
  },
  {
    id:'gasket',
    price:35,
    name:{en:'Gasket Kit', zh:'垫片维修包', ru:'Комплект прокладок', ar:'طقم الحشيات'}
  },
  {
    id:'bearing',
    price:45,
    name:{en:'Bearing Set', zh:'轴承组件', ru:'Комплект подшипников', ar:'مجموعة المحامل'}
  },
  {
    id:'generator',
    price:1200,
    name:{en:'Diesel Generator Set', zh:'柴油发电机组', ru:'Дизель-генераторная установка', ar:'مجموعة مولد ديزل'}
  }
];

function addToCart(productId) {
  const cart = getCart();
  cart.push(productId);
  saveCart(cart);
  renderCart();

  const lang = getSavedLang();
  const p = products.find(x => x.id === productId);
  const msg = document.getElementById('cart-notice');
  if (msg && p) {
    const template = {
      en: 'Added to cart: ',
      zh: '已加入购物车：',
      ru: 'Добавлено в корзину: ',
      ar: 'تمت الإضافة إلى السلة: '
    };
    msg.textContent = template[lang] + p.name[lang];
  }
}

function removeCartIndex(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function clearCart() {
  saveCart([]);
  renderCart();
}

function renderCart() {
  const cart = getCart();
  const list = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const countEl = document.getElementById('cart-count');
  if (!list || !totalEl || !countEl) return;

  const lang = getSavedLang();
  const emptyText = {
    en: 'Your cart is currently empty.',
    zh: '你的购物车目前为空。',
    ru: 'Ваша корзина пуста.',
    ar: 'سلة التسوق فارغة حالياً.'
  };
  const removeText = {
    en: 'Remove',
    zh: '删除',
    ru: 'Удалить',
    ar: 'حذف'
  };

  list.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    const li = document.createElement('li');
    li.textContent = emptyText[lang];
    list.appendChild(li);
  } else {
    cart.forEach((id, idx) => {
      const product = products.find(p => p.id === id);
      if (!product) return;
      total += product.price;
      const li = document.createElement('li');
      li.innerHTML = `
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;">
          <div>
            <div style="font-weight:700;color:#0f172a;">${product.name[lang]}</div>
            <div>$${product.price}</div>
          </div>
          <button class="btn btn-dark small" onclick="removeCartIndex(${idx})">${removeText[lang]}</button>
        </div>
      `;
      list.appendChild(li);
    });
  }

  countEl.textContent = String(cart.length);
  totalEl.textContent = '$' + total;
}

document.addEventListener('DOMContentLoaded', function () {
  const selector = document.getElementById('lang-select');
  if (selector) {
    selector.addEventListener('change', function() {
      setLang(this.value);
    });
  }
  applyText(getSavedLang());
  renderCart();
});
