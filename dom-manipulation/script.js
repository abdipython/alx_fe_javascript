// Initialize Quotes
let quotes = loadQuotes();

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const categoryList = document.getElementById('categoryList');
const categoryFilter = document.getElementById('categoryFilter');
const syncStatus = document.getElementById('syncStatus');

// Load from localStorage
function loadQuotes() {
  const stored = localStorage.getItem('quotes');
  return stored ? JSON.parse(stored) : [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Inspiration" }
  ];
}

// Save to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display Random Quote
function displayRandomQuote() {
  const filteredQuotes = applyCategoryFilter();
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerText = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.innerHTML = `<strong>${quote.category}</strong>: "${quote.text}"`;

  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Apply category filter
function applyCategoryFilter() {
  const selected = categoryFilter.value;
  if (selected === 'all') return quotes;
  return quotes.filter(q => q.category.toLowerCase() === selected.toLowerCase());
}

// Add New Quote
function addQuote() {
  const quoteText = document.getElementById('newQuoteText').value.trim();
  const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (!quoteText || !quoteCategory) {
    alert('Please fill both fields');
    return;
  }

  const newQuote = { text: quoteText, category: quoteCategory };
  quotes.push(newQuote);
  saveQuotes();
  updateCategoryList();
  populateCategories();

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
}

// Update Category List Buttons
function updateCategoryList() {
  const categories = [...new Set(quotes.map(q => q.category))];

  categoryList.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.innerText = cat;
    btn.onclick = () => showQuoteByCategory(cat);
    categoryList.appendChild(btn);
  });
}

// Show Quote by Category Button
function showQuoteByCategory(category) {
  const filtered = quotes.filter(q => q.category.toLowerCase() === category.toLowerCase());
  if (filtered.length === 0) {
    quoteDisplay.innerText = `No quotes found for category: ${category}`;
    return;
  }
  const randomIndex = Math.floor(Math.random() * filtered.length);
  const quote = filtered[randomIndex];
  quoteDisplay.innerHTML = `<strong>${quote.category}</strong>: "${quote.text}"`;

  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Populate Filter Dropdown
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.innerText = cat;
    categoryFilter.appendChild(option);
  });

  // Load last filter
  const lastFilter = localStorage.getItem('lastFilter');
  if (lastFilter) {
    categoryFilter.value = lastFilter;
  }
}

// Filter Quotes from Dropdown
function filterQuotes() {
  localStorage.setItem('lastFilter', categoryFilter.value);
  displayRandomQuote();
}

// Export to JSON
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// Import from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        updateCategoryList();
        populateCategories();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format.');
      }
    } catch {
      alert('Error reading JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Simulate Server Sync
function syncWithServer() {
  syncStatus.innerText = 'Syncing...';
  fetch('https://jsonplaceholder.typicode.com/posts')
    .then(res => res.json())
    .then(serverData => {
      // Simulate server having 3 quotes
      const serverQuotes = [
        { text: serverData[0].title, category: 'Server' },
        { text: serverData[1].title, category: 'Server' },
        { text: serverData[2].title, category: 'Server' }
      ];

      // Conflict Resolution: Server wins
      const combined = [...quotes, ...serverQuotes];
      const uniqueQuotes = Array.from(new Set(combined.map(q => JSON.stringify(q)))).map(q => JSON.parse(q));

      quotes = uniqueQuotes;
      saveQuotes();
      updateCategoryList();
      populateCategories();

      syncStatus.innerText = 'Synced with server (Server data merged)';
    })
    .catch(() => {
      syncStatus.innerText = 'Failed to sync with server';
    });
}

// Load last viewed quote on page load
window.addEventListener('load', () => {
  const lastQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    quoteDisplay.innerHTML = `<strong>${quote.category}</strong>: "${quote.text}"`;
  }
});

// Event Listeners
newQuoteBtn.addEventListener('click', displayRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);

// Initialize
updateCategoryList();
populateCategories();
