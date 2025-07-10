const playwright = require('playwright');
const { 
    getRandomUserAgent, 
    getRandomReferrer 
} = require('./user-agents');

// Configuration for faster visits
const config = {
    minPageTime: 8000,  // 8 seconds
    maxPageTime: 20000, // 20 seconds
    minWaitBetweenVisits: 10000, // 10 seconds
    maxWaitBetweenVisits: 25000, // 25 seconds
    pageTimeout: 30000,
    headless: true
};

// Target blog URL (90% visits to your blog)
const targetUrls = [
    'https://digitalproductssssss.blogspot.com/2024/01/blog-post.html',
    'https://digitalproductssssss.blogspot.com/2024/01/blog-post.html',
    'https://digitalproductssssss.blogspot.com/2024/01/blog-post.html',
    'https://digitalproductssssss.blogspot.com/2024/01/blog-post.html',
    'https://digitalproductssssss.blogspot.com/2024/01/blog-post.html',
    'https://digitalproductssssss.blogspot.com/2024/01/blog-post.html',
    'https://digitalproductssssss.blogspot.com/2024/01/blog-post.html',
    'https://digitalproductssssss.blogspot.com/2024/01/blog-post.html',
    'https://digitalproductssssss.blogspot.com/2024/01/blog-post.html',
    'https://www.google.com'
];

function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function log(message, type = 'INFO') {
    const timestamp = new Date().toISOString();
    const colors = {
        INFO: '\x1b[36m',
        SUCCESS: '\x1b[32m',
        ERROR: '\x1b[31m',
        WARNING: '\x1b[33m'
    };
    const reset = '\x1b[0m';
    console.log(`${colors[type]}[${timestamp}] ${type}: ${message}${reset}`);
}

async function visitWithPlaywright(url) {
    let browser = null;
    let page = null;
    
    try {
        const userAgent = getRandomUserAgent();
        const referrer = getRandomReferrer();
        
        log(`Visiting: ${url}`);
        log(`User-Agent: ${userAgent}`);
        log(`Referrer: ${referrer || 'Direct'}`);
        
        // Try Chrome first, then Firefox as fallback
        try {
            browser = await playwright.chromium.launch({
                headless: config.headless,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        } catch (e) {
            log('Chrome not available, trying Firefox...', 'WARNING');
            browser = await playwright.firefox.launch({
                headless: config.headless
            });
        }
        
        page = await browser.newPage();
        
        // Set user agent
        await page.setUserAgent(userAgent);
        
        // Set referrer if available
        if (referrer) {
            await page.setExtraHTTPHeaders({
                'Referer': referrer
            });
        }
        
        const startTime = Date.now();
        
        // Navigate to page
        await page.goto(url, {
            waitUntil: 'networkidle',
            timeout: config.pageTimeout
        });
        
        log(`Page loaded successfully!`, 'SUCCESS');
        
        // Wait a bit
        await page.waitForTimeout(getRandomDelay(2000, 5000));
        
        // Simulate scrolling
        const scrollCount = getRandomDelay(2, 5);
        for (let i = 0; i < scrollCount; i++) {
            await page.evaluate(() => {
                window.scrollBy(0, window.innerHeight / 2);
            });
            await page.waitForTimeout(getRandomDelay(1000, 3000));
        }
        
        // Stay on page for remaining time
        const timeSpent = Date.now() - startTime;
        const remainingTime = getRandomDelay(config.minPageTime, config.maxPageTime) - timeSpent;
        
        if (remainingTime > 0) {
            log(`Staying for additional ${Math.round(remainingTime / 1000)} seconds...`);
            await page.waitForTimeout(remainingTime);
        }
        
        const totalTime = Date.now() - startTime;
        log(`Total time spent: ${Math.round(totalTime / 1000)} seconds`, 'SUCCESS');
        
        return true;
        
    } catch (error) {
        log(`Error visiting ${url}: ${error.message}`, 'ERROR');
        return false;
    } finally {
        if (page) await page.close();
        if (browser) await browser.close();
    }
}

async function startBrowserBot() {
    log('Starting Browser-Based Traffic Bot (Real Browser Visits)...', 'SUCCESS');
    log('This will show up in Blogger Analytics!', 'SUCCESS');
    
    let visitCount = 0;
    
    while (true) {
        try {
            const randomUrl = targetUrls[Math.floor(Math.random() * targetUrls.length)];
            
            visitCount++;
            log(`\n=== Visit #${visitCount} ===`, 'INFO');
            
            await visitWithPlaywright(randomUrl);
            
            const waitTime = getRandomDelay(config.minWaitBetweenVisits, config.maxWaitBetweenVisits);
            log(`Waiting ${Math.round(waitTime / 1000)} seconds before next visit...`, 'INFO');
            await new Promise(resolve => setTimeout(resolve, waitTime));
            
        } catch (error) {
            log(`Critical error: ${error.message}`, 'ERROR');
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
}

// Start the bot
if (require.main === module) {
    startBrowserBot().catch(error => {
        log(`Failed to start browser bot: ${error.message}`, 'ERROR');
        process.exit(1);
    });
}

module.exports = { startBrowserBot };