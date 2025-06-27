// Initial quotes array
const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Inspiration" }
];

// DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const categoryList = document.getElementById('categoryList');

// Show random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerText = "No quotes available.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<strong>${quote.category}</strong>: "${quote.text}"`;
}

// Update category list dynamically
function updateCategoryList() {
    const categories = [...new Set(quotes.map(q => q.category))];

    categoryList.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.innerText = cat;
        btn.style.margin = "5px";
        btn.onclick = () => showQuoteByCategory(cat);
        categoryList.appendChild(btn);
    });
}

// Show quote by category
function showQuoteByCategory(category) {
    const filtered = quotes.filter(q => q.category.toLowerCase() === category.toLowerCase());
    if (filtered.length === 0) {
        quoteDisplay.innerText = `No quotes found for category: ${category}`;
        return;
    }

    const randomIndex = Math.floor(Math.random() * filtered.length);
    const quote = filtered[randomIndex];
    quoteDisplay.innerHTML = `<strong>${quote.category}</strong>: "${quote.text}"`;
}

// Add new quote
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (quoteText === '' || quoteCategory === '') {
        alert('Please fill in both quote and category.');
        return;
    }

    const newQuote = {
        text: quoteText,
        category: quoteCategory
    };

    quotes.push(newQuote);
    alert('New quote added!');
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    updateCategoryList();
}

// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);

// Initialize category list
updateCategoryList();

