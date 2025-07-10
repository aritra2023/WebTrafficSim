// User-Agent configurations for desktop and mobile browsers
// These are real user agents to simulate authentic traffic

const desktopUserAgents = [
    // Chrome Desktop
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    
    // Firefox Desktop
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
    
    // Safari Desktop
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
    
    // Edge Desktop
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
];

const mobileUserAgents = [
    // Chrome Mobile
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.6099.119 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.193 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.193 Mobile Safari/537.36',
    
    // Safari Mobile
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    
    // Samsung Internet
    'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36',
    
    // Firefox Mobile
    'Mozilla/5.0 (Mobile; rv:121.0) Gecko/121.0 Firefox/121.0',
    'Mozilla/5.0 (Android 14; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0'
];

// Popular referrer URLs to simulate traffic from different sources
const referrers = [
    'https://www.google.com/',
    'https://www.google.com/search?q=',
    'https://www.bing.com/',
    'https://www.facebook.com/',
    'https://www.twitter.com/',
    'https://www.linkedin.com/',
    'https://www.reddit.com/',
    'https://www.youtube.com/',
    'https://www.instagram.com/',
    'https://www.pinterest.com/',
    'https://duckduckgo.com/',
    'https://www.yahoo.com/',
    'https://t.co/',
    'https://news.google.com/',
    'https://www.wikipedia.org/',
    '', // Direct traffic (no referrer)
    '', // Direct traffic (no referrer)
    '' // Direct traffic (no referrer)
];

/**
 * Get a random desktop user agent
 * @returns {string} Random desktop user agent string
 */
function getRandomDesktopUserAgent() {
    return desktopUserAgents[Math.floor(Math.random() * desktopUserAgents.length)];
}

/**
 * Get a random mobile user agent
 * @returns {string} Random mobile user agent string
 */
function getRandomMobileUserAgent() {
    return mobileUserAgents[Math.floor(Math.random() * mobileUserAgents.length)];
}

/**
 * Get a random user agent (desktop or mobile)
 * @returns {string} Random user agent string
 */
function getRandomUserAgent() {
    // 70% chance for desktop, 30% for mobile to simulate real traffic patterns
    const useDesktop = Math.random() < 0.7;
    return useDesktop ? getRandomDesktopUserAgent() : getRandomMobileUserAgent();
}

/**
 * Get a random referrer URL
 * @returns {string} Random referrer URL
 */
function getRandomReferrer() {
    return referrers[Math.floor(Math.random() * referrers.length)];
}

/**
 * Check if user agent is mobile
 * @param {string} userAgent - User agent string to check
 * @returns {boolean} True if mobile user agent
 */
function isMobileUserAgent(userAgent) {
    return mobileUserAgents.includes(userAgent);
}

module.exports = {
    getRandomDesktopUserAgent,
    getRandomMobileUserAgent,
    getRandomUserAgent,
    getRandomReferrer,
    isMobileUserAgent,
    desktopUserAgents,
    mobileUserAgents,
    referrers
};
