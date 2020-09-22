const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error');
var errorCounter = 0;

function showLoadingSpinner() {
    loader.hidden = false;
    quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
    if (!loader.hidden) {
        loader.hidden = true;
        quoteContainer.hidden = false;
    }
}

// Get Quote Function
async function getQuote() {
    showLoadingSpinner();

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
        
        errorMessage.innerText = '';

        removeLoadingSpinner();
    } catch (error) {
        // Retry getQuote 'x' amount of times, then trigger error message
        if (errorCounter < 10){
            errorCounter++
            getQuote();
        } else {
            removeLoadingSpinner();
            errorMessage.innerText = 'Sorry, something went wrong. Please try again!';
        }
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