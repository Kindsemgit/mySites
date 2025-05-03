// Загружаем сайты из localStorage или используем начальный список
let sites = JSON.parse(localStorage.getItem('sites')) || [
  // Инвистиции
  {
    name: "Dohod",
    url: "https://www.dohod.ru",
    category: "Инвистиции",
    favicon: "https://www.dohod.ru/favicon.ico"
  },
  {
    name: "Dohod-Дивиденды",
    url: "https://www.dohod.ru/ik/analytics/dividend",
    category: "Инвистиции",
    favicon: "https://www.dohod.ru/favicon.ico"
  },
  // Портфель
  {
    name: "Intelinvest",
    url: "https://intelinvest.ru/app/#/portfolio",
    category: "Портфель",
    favicon: "https://intelinvest.ru/favicon.png"
  },
  {
    name: "Snowball",
    url: "https://snowball-income.com/assets",
    category: "Портфель",
    favicon: "https://snowball-income.com/favicon.ico"
  },
  {
    name: "БКС",
    url: "https://lk.bcs.ru/",
    category: "Портфель",
    favicon: "https://lk.bcs.ru/favicon.ico"
  },
  {
    name: "Тинькофф",
    url: "https://www.tbank.ru/invest/portfolio/",
    category: "Портфель",
    favicon: "https://www.tbank.ru/favicon.ico"
  },

  // Криптовалюта
  {
    name: "Tradingview",
    url: "https://ru.tradingview.com/chart/Y7ITplla/",
    category: "Криптовалюта",
    favicon: "https://ru.tradingview.com/favicon.ico"
  },
  {
    name: "Capico",
    url: "https://capico.app/app/terminal",
    category: "Криптовалюта",
    favicon: "https://capico.app/assets/favicon/android-chrome-144x144.png"
  },
  {
    name: "OKX",
    url: "https://www.okx.com/en-us",
    category: "Криптовалюта",
    favicon: "https://www.okx.com/favicon.ico"
  },

  // Работа
  {
    name: "Тинькофф-Учеба",
    url: "https://my.tbank.ru/edu/my-activities",
    category: "Работа",
    favicon: "https://www.tbank.ru/favicon.ico"
  },
  {
    name: "Тинькофф-Вакансии",
    url: "https://www.tbank.ru/career/vacancies/all/nizhny-novgorod/",
    category: "Работа",
    favicon: "https://www.tbank.ru/favicon.ico"
  },
  {
    name: "Прослушка-встреч",
    url: "https://tqm.tinkoff.ru/filter/communications/voice",
    category: "Работа",
    favicon: "https://www.tbank.ru/favicon.ico"
  },

];

// Текущая выбранная категория
let currentCategory = 'all';
// Текущий поисковый запрос
let currentSearch = '';

// Функция для сохранения сайтов в localStorage
function saveSites() {
  localStorage.setItem('sites', JSON.stringify(sites));
}

// Функция для получения favicon сайта
async function getFavicon(url) {
  try {
    // Пробуем получить favicon стандартным способом
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}`;
  } catch {
    return 'https://www.google.com/s2/favicons?domain=google.com'; // Дефолтный favicon
  }
}

// Функция для отображения списка сайтов
async function displaySites() {
  const siteList = document.getElementById('siteList');
  siteList.innerHTML = '';

  // Фильтрация сайтов по категории и поисковому запросу
  const filteredSites = sites.filter(site => {
    const matchesCategory = currentCategory === 'all' || site.category === currentCategory;
    const matchesSearch = site.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
      site.url.toLowerCase().includes(currentSearch.toLowerCase()) ||
      site.category.toLowerCase().includes(currentSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Группировка по категориям
  const categories = {};
  filteredSites.forEach(site => {
    if (!categories[site.category]) {
      categories[site.category] = [];
    }
    categories[site.category].push(site);
  });

  // Если нет сайтов, показываем сообщение
  if (filteredSites.length === 0) {
    siteList.innerHTML = '<div class="no-sites">Сайты не найдены. Добавьте новый сайт.</div>';
    return;
  }

  // Отображаем сайты по категориям
  for (const [category, sitesInCategory] of Object.entries(categories)) {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'site-category';
    categoryDiv.innerHTML = `<div class="category-title">${category}</div>`;

    sitesInCategory.forEach(site => {
      const siteItem = document.createElement('div');
      siteItem.className = 'site-item';
      siteItem.innerHTML = `
                    <img src="${site.favicon}" class="site-icon" alt="${site.name} favicon" onerror="this.src='https://www.google.com/s2/favicons?domain=google.com'">
                    <div class="site-info">
                        <div class="site-name"><a href="${site.url}" target="_blank">${site.name}</a></div>
                        <div class="site-url">${site.url}</div>
                    </div>
                    <div class="site-actions">
                        <button class="action-btn" onclick="editSite('${site.url}')" title="Редактировать"><i class="fas fa-edit"></i></button>
                        <button class="action-btn" onclick="deleteSite('${site.url}')" title="Удалить"><i class="fas fa-trash"></i></button>
                    </div>
                `;
      categoryDiv.appendChild(siteItem);
    });

    siteList.appendChild(categoryDiv);
  }
}

// Функция для обновления списка категорий
function updateCategories() {
  const categorySelect = document.getElementById('categorySelect');
  const categoryTabs = document.getElementById('categoryTabs');

  // Получаем уникальные категории
  const categories = ['all', ...new Set(sites.map(site => site.category))];

  // Обновляем выпадающий список
  categorySelect.innerHTML = '';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category === 'all' ? 'Все категории' : category;
    categorySelect.appendChild(option);
  });

  // Обновляем табы категорий (кроме "Все")
  categoryTabs.innerHTML = '<div class="category-tab all active" data-category="all">Все</div>';
  categories.filter(c => c !== 'all').forEach(category => {
    const tab = document.createElement('div');
    tab.className = `category-tab ${currentCategory === category ? 'active' : ''}`;
    tab.textContent = category;
    tab.dataset.category = category;
    tab.addEventListener('click', () => {
      currentCategory = category;
      document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector('.category-tab.all').classList.remove('active');
      displaySites();
    });
    categoryTabs.appendChild(tab);
  });

  // Добавляем обработчик для таба "Все"
  document.querySelector('.category-tab.all').addEventListener('click', () => {
    currentCategory = 'all';
    document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.category-tab.all').classList.add('active');
    displaySites();
  });
}

// Функция для добавления нового сайта
async function addSite() {
  const nameInput = document.getElementById('newSiteName');
  const urlInput = document.getElementById('newSiteUrl');
  const categoryInput = document.getElementById('newSiteCategory');

  const name = nameInput.value.trim();
  let url = urlInput.value.trim();
  const category = categoryInput.value.trim() || 'Без категории';

  if (name && url) {
    // Добавляем https:// если его нет в URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // Получаем favicon
    const favicon = await getFavicon(url);

    // Добавляем новый сайт
    sites.push({
      name,
      url,
      category,
      favicon
    });

    // Сохраняем и обновляем отображение
    saveSites();
    displaySites();
    updateCategories();

    // Очищаем поля ввода
    nameInput.value = '';
    urlInput.value = '';
    categoryInput.value = '';
  } else {
    alert('Пожалуйста, заполните название и URL сайта');
  }
}

// Функция для удаления сайта
function deleteSite(url) {
  if (confirm('Вы уверены, что хотите удалить этот сайт?')) {
    sites = sites.filter(site => site.url !== url);
    saveSites();
    displaySites();
    updateCategories();
  }
}

// Функция для редактирования сайта (упрощенная версия)
function editSite(url) {
  const site = sites.find(s => s.url === url);
  if (site) {
    document.getElementById('newSiteName').value = site.name;
    document.getElementById('newSiteUrl').value = site.url;
    document.getElementById('newSiteCategory').value = site.category;

    // Удаляем старый сайт
    sites = sites.filter(s => s.url !== url);
  }
}

// Инициализация при загрузке страницы
window.onload = function () {
  displaySites();
  updateCategories();

  // Обработчик поиска
  document.getElementById('searchInput').addEventListener('input', function () {
    currentSearch = this.value;
    displaySites();
  });

  // Обработчик выбора категории
  document.getElementById('categorySelect').addEventListener('change', function () {
    currentCategory = this.value;
    document.querySelectorAll('.category-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.category === currentCategory);
    });
    displaySites();
  });
};
