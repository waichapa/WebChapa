let currentLang = 'ru';
let currentTag = null;
let chart = null;

function formatDate(dateStr, lang) {
  const date = new Date(dateStr);
  const options = { day: 'numeric', month: 'short' };
  
  if (lang === 'ru') {
    return date.toLocaleDateString('ru-RU', options);
  } else if (lang === 'ko') {
    return date.toLocaleDateString('ko-KR', options);
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

function getSortedPosts() {
  return [...postsData].sort((a, b) => b.id - a.id);
}

function getAllTags() {
  const tags = new Set();
  getSortedPosts().forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

function getFilteredPosts() {
  const sortedPosts = getSortedPosts();
  if (!currentTag) return sortedPosts;
  return sortedPosts.filter(post => post.tags.includes(currentTag));
}

function getMonthlyData() {
  const monthStats = new Map();
  
  const sortedPosts = [...postsData].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  sortedPosts.forEach(post => {
    const date = new Date(post.date);
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    let monthName;
    
    if (currentLang === 'ru') {
      monthName = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    } else if (currentLang === 'ko') {
      monthName = date.toLocaleDateString('ko-KR', { month: 'long', year: 'numeric' });
    } else {
      monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    
    if (!monthStats.has(yearMonth)) {
      monthStats.set(yearMonth, { count: 0, label: monthName });
    }
    monthStats.get(yearMonth).count++;
  });
  
  const sorted = Array.from(monthStats.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  const labels = sorted.map(item => item[1].label);
  const data = sorted.map(item => item[1].count);
  
  return { labels, data };
}

function getChartColors() {
  const isDark = document.body.classList.contains('dark');
  return {
    gridColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    textColor: isDark ? '#e5e7eb' : '#1f2937',
    lineColor: '#2563eb',
    fillColor: isDark ? 'rgba(37, 99, 235, 0.2)' : 'rgba(37, 99, 235, 0.1)',
    pointColor: '#2563eb',
    pointBackground: isDark ? '#2563eb' : '#3b82f6'
  };
}

function renderChart() {
  const { labels, data } = getMonthlyData();
  const colors = getChartColors();
  const ctx = document.getElementById('postsChart').getContext('2d');
  
  if (chart) {
    chart.destroy();
  }
  
  if (labels.length === 0) {
    return;
  }
  
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: uiText[currentLang].chart.posts,
        data: data,
        borderColor: colors.lineColor,
        backgroundColor: colors.fillColor,
        borderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: colors.pointBackground,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: {
            color: colors.textColor,
            font: { size: 12, weight: '500' }
          },
          position: 'top'
        },
        tooltip: {
          backgroundColor: colors.gridColor,
          titleColor: colors.textColor,
          bodyColor: colors.textColor,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += context.parsed.y;
              if (context.parsed.y === 1) {
                label += ' пост';
              } else if (context.parsed.y >= 2 && context.parsed.y <= 4) {
                label += ' поста';
              } else {
                label += ' постов';
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: colors.textColor,
            callback: function(value) {
              return value;
            }
          },
          grid: {
            color: colors.gridColor
          },
          title: {
            display: true,
            text: uiText[currentLang].chart.posts,
            color: colors.textColor,
            font: { size: 12 }
          }
        },
        x: {
          ticks: {
            color: colors.textColor,
            maxRotation: 45,
            minRotation: 45
          },
          grid: {
            color: colors.gridColor
          },
          title: {
            display: true,
            text: uiText[currentLang].chart.months,
            color: colors.textColor,
            font: { size: 12 }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });
}

function renderTags() {
  const tagsBar = document.getElementById('tagsBar');
  const allTags = getAllTags();
  
  tagsBar.innerHTML = `<button class="tag-btn ${!currentTag ? 'active-tag' : ''}" data-tag="">${uiText[currentLang].all}</button>`;
  
  allTags.forEach(tag => {
    tagsBar.innerHTML += `<button class="tag-btn ${currentTag === tag ? 'active-tag' : ''}" data-tag="${tag}">#${tag}</button>`;
  });
  
  document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentTag = btn.dataset.tag || null;
      renderTags();
      renderPosts();
    });
  });
}

function renderPosts() {
  const container = document.getElementById('postsContainer');
  const filteredPosts = getFilteredPosts();
  
  if (filteredPosts.length === 0) {
    container.innerHTML = `<div class="no-posts">${uiText[currentLang].noPosts}</div>`;
    return;
  }
  
  container.innerHTML = filteredPosts.map(post => `
    <div class="post">
      <div class="post-header">
        <img src="images/profilePicture.jpg" alt="avatar" class="avatar">
        <div class="post-meta">
          <div class="post-author">waichapa</div>
          <div class="post-date">${formatDate(post.date, currentLang)}</div>
        </div>
      </div>
      <div class="post-text">${post.text[currentLang] || post.text.ru}</div>
      ${post.image ? `<img class="post-img" src="${post.image}" alt="post image">` : ''}
      <div class="post-tags">
        ${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function updateThemeButtonText() {
  const themeToggle = document.getElementById('themeToggle');
  const isDark = document.body.classList.contains('dark');
  
  if (isDark) {
    themeToggle.textContent = uiText[currentLang].theme.dark;
  } else {
    themeToggle.textContent = uiText[currentLang].theme.light;
  }
}

function setLanguage(lang) {
  currentLang = lang;
  
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.dataset.lang === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  updateThemeButtonText();
  renderChart();
  renderTags();
  renderPosts();
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.add(savedTheme);
  updateThemeButtonText();
  
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('light')) {
      document.body.classList.remove('light');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
    updateThemeButtonText();
    renderChart();
  });
}

function init() {
  initTheme();
  
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });
  
  renderChart();
  renderTags();
  renderPosts();
}

init();