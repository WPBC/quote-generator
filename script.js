const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

// Show loading
function loading() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

// Hide loading
function complete() {
    if (!loader.hidden) {
        loader.hidden = true;
        quoteContainer.hidden = false;
    }
}

// Get Quote Function
async function getQuote() {
    loading();

    // Add proxy url to combat CORS error
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

    // Get quotes from API url
    const apiUrl = 'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
    
    try {
        const response = await fetch(proxyUrl + apiUrl);
        const data = await response.json();

        // If author is blank, add 'Unknown'
        if(data.quoteAuthor !== '') {
            authorText.innerText = data.quoteAuthor;
        } else {
            authorText.innerText = 'Unknown';
        }

        // Reduce font size for long quotes
        if (data.quoteText.length > 120) {
            quoteText.classList.add('long-quote');
        } else {
            quoteText.classList.remove('long-quote');
        }

        quoteText.innerText = data.quoteText;

        // Stop loader and show quote
        complete();

    } catch (error) {
        getQuote();
        console.log('Whoops, no quote', error);
        complete();
    }
}

// Tweet quote
function tweetQuote() {
    const quote = quoteText.innerText;
    const author = authorText.innerText;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}&hashtags=${author},famousquote`;
    window.open(twitterUrl, '_blank');
}

// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

// On Load
getQuote();