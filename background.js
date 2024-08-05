chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        const headers = details.requestHeaders;
        for (let header of headers) {
            if (header.name.toLowerCase() === 'authorization' && header.value.startsWith('Bearer ')) {
                const token = header.value.substring(7);

                chrome.tabs.get(details.tabId || 0, (tab) => {
                    if (chrome.runtime.lastError || !tab) {
                        console.error('Error getting tab information:', chrome.runtime.lastError);
                        return;
                    }

                    const baseUrl = tab.url.split('/').slice(0,5).join('/')

                    console.log('Bearer Token:', token);
                    console.log('Base URL:', baseUrl);

                    // Store the token and base URL in chrome.storage
                    chrome.storage.local.get('tokens', (data) => {
                        const tokens = data.tokens || {};
                        if (!Object.values(tokens).includes(token)) {
                            tokens[baseUrl] = token;
                            chrome.storage.local.set({ tokens: tokens }, () => {
                                console.log('Token and Base URL stored');
                            });
                        } else {
                            console.log('Skipped token which already exists', token)
                        }
                    });
                });
            }
        }
        return { requestHeaders: headers };
    },
    { urls: ["<all_urls>"] },
    ["requestHeaders"]
);
