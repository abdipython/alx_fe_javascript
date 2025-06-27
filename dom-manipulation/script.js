const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Inspiration" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const categoryList = document.getElementById('categoryList');

function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<strong>${quote.category}</strong>: "${quote.text}"`;
}

function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (quoteText === '' || quoteCategory === '') {
        alert('Please fill in both fields.');
        return;
    }

    quotes.push({ text: quoteText, category: quoteCategory });
    alert('Quote added!');

    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    updateCategoryList();
}

function showQuoteByCategory(category) {
    const filtered = quotes.filter(q => q.category.toLowerCase() === category.toLowerCase());
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const quote = filtered[randomIndex];
    quoteDisplay.innerHTML = `<strong>${quote.category}</strong>: "${quote.text}"`;
}

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

// ✅ Attach event listeners
newQuoteBtn.addEventListener('click', displayRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);

// ✅ Initialize categories
updateCategoryList();

