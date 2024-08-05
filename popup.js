document.addEventListener('DOMContentLoaded', () => {
    searchAndRender()

    const clearButton = document.getElementById('clearButton');

    clearButton.addEventListener('click', () => {
        chrome.storage.local.remove('tokens', () => {
            console.log('Tokens cleared');
            // Optionally reload the popup content to reflect the change
            location.reload();
        });
    })

    const search = document.getElementById('search');
    search.addEventListener('keydown', () => {
        searchAndRender(search.value)
    })
});

const searchAndRender = (searchValue) => {
    chrome.storage.local.get('tokens', (data) => {
        const tokens = data.tokens || {};
        const tokenContainer = document.getElementById('tokenContainer');
        tokenContainer.innerHTML = ''; // Clear any existing content

        let filteredTokens = {};
        if ( searchValue && searchValue.length > 0 ) {
            Object.keys(tokens).filter(key => {
                if (key.includes(searchValue)) {
                    filteredTokens[key] = tokens[key];
                }
            })
        } else {
            filteredTokens = tokens
        }
        if (Object.keys(filteredTokens).length === 0) {
            tokenContainer.textContent = 'No tokens found';
        } else {
            for (const [url, token] of Object.entries(filteredTokens)) {
                const tokenElement = document.createElement('div');
                tokenElement.innerHTML = `<strong>URL:</strong> ${url} <br> <strong>Token:</strong> ${token.substring(0, 50)} ${token.length > 50 ? '...': ''} <button class="copyButton" data-token="${token}">Copy</button><br><br>`;
                tokenContainer.appendChild(tokenElement);
            }
        }

        // Add event listeners to copy buttons
        const copyButtons = document.querySelectorAll('.copyButton');
        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const token = button.getAttribute('data-token');
                navigator.clipboard.writeText(token).then(() => {
                    console.log('Token copied to clipboard');
                }).catch(err => {
                    console.error('Failed to copy token: ', err);
                });
            });
        });
    });
}
