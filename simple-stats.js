const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Blog Traffic Stats</title>
    <style>
        body { font-family: Arial; background: #f0f8ff; padding: 20px; }
        .stats { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .big-number { font-size: 48px; color: #4CAF50; font-weight: bold; }
        .label { font-size: 18px; color: #666; margin-bottom: 20px; }
        .status { background: #4CAF50; color: white; padding: 10px; border-radius: 5px; display: inline-block; }
        .detail { margin: 10px 0; font-size: 16px; }
    </style>
    <script>
        setInterval(() => {
            fetch('/api/stats')
                .then(r => r.json())
                .then(data => {
                    document.getElementById('total').textContent = data.totalVisits;
                    document.getElementById('blog').textContent = data.urls['https://digitalproductssssss.blogspot.com/2024/01/blog-post.html'] || 0;
                    document.getElementById('success').textContent = data.successfulVisits;
                    document.getElementById('updated').textContent = new Date(data.lastUpdated).toLocaleString();
                });
        }, 3000);
    </script>
</head>
<body>
    <div class="stats">
        <h1>🚀 Blog Traffic Dashboard</h1>
        <div class="status">✅ TRAFFIC BOT ACTIVE</div>
        
        <div style="margin: 30px 0;">
            <div class="big-number" id="total">0</div>
            <div class="label">Total Visits Generated</div>
        </div>
        
        <div style="margin: 30px 0;">
            <div class="big-number" id="blog" style="color: #2196F3;">0</div>
            <div class="label">Your Blog Visits</div>
        </div>
        
        <div class="detail">✅ Successful Visits: <strong id="success">0</strong></div>
        <div class="detail">🌐 Multiple browsers: Chrome, Firefox, Safari</div>
        <div class="detail">📱 Mobile & Desktop traffic</div>
        <div class="detail">🔗 Referrers: Google, Facebook, Instagram, LinkedIn</div>
        <div class="detail">⏰ Last Updated: <span id="updated">Never</span></div>
        
        <div style="margin-top: 30px; padding: 20px; background: #e3f2fd; border-radius: 5px;">
            <h3>🎯 Current Traffic Generation:</h3>
            <ul>
                <li>HTTP Bot: Fast visits every 15-30 seconds</li>
                <li>Real Browser Bot: Analytics visits every 8-20 seconds</li>
                <li>80% visits focused on your blog</li>
                <li>Multiple user agents and referrers</li>
            </ul>
        </div>
    </div>
</body>
</html>
    `);
});

app.get('/api/stats', async (req, res) => {
    try {
        const response = await fetch('http://localhost:5000/api/stats');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.json({ error: 'Dashboard not available' });
    }
});

app.listen(3000, '0.0.0.0', () => {
    console.log('📊 Simple Stats Dashboard running at http://localhost:3000');
});