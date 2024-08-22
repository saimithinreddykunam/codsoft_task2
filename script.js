document.addEventListener('DOMContentLoaded', function() {
    const quoteElement = document.getElementById('quote');
    const authorElement = document.getElementById('author');
    const newQuoteButton = document.getElementById('new-quote');
    const shareQuoteButton = document.getElementById('share-quote');
    const favoriteQuoteButton = document.getElementById('favorite-quote');
    const favoritesList = document.getElementById('favorites-list');

    let currentQuote = "";
    let currentAuthor = "";

    async function fetchQuote() {
        try {
            const response = await fetch('https://api.quotable.io/random');
            const data = await response.json();
            currentQuote = data.content;
            currentAuthor = data.author;
            quoteElement.textContent = `"${currentQuote}"`;
            authorElement.textContent = `- ${currentAuthor}`;
        } catch (error) {
            console.error('Error fetching quote:', error);
        }
    }

    function shareQuote() {
        if (navigator.share) {
            navigator.share({
                title: 'Quote of the Day',
                text: `${currentQuote} - ${currentAuthor}`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            alert('Sharing not supported in this browser.');
        }
    }

    function addToFavorites() {
        const favoriteItem = document.createElement('li');
        favoriteItem.textContent = `${currentQuote} - ${currentAuthor}`;
        favoritesList.appendChild(favoriteItem);
        saveFavorites();
    }

    function saveFavorites() {
        const favorites = Array.from(favoritesList.children).map(item => item.textContent);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    function loadFavorites() {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        savedFavorites.forEach(favorite => {
            const favoriteItem = document.createElement('li');
            favoriteItem.textContent = favorite;
            favoritesList.appendChild(favoriteItem);
        });
    }

    newQuoteButton.addEventListener('click', fetchQuote);
    shareQuoteButton.addEventListener('click', shareQuote);
    favoriteQuoteButton.addEventListener('click', addToFavorites);

    // Load favorites on page load
    loadFavorites();

    // Fetch the initial quote
    fetchQuote();
});
