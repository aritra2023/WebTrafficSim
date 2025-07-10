const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TurboHits - Analytics Overview</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0f172a;
            color: #e2e8f0;
            min-height: 100vh;
        }
        
        .navbar {
            background: #1e293b;
            border-bottom: 1px solid #334155;
            padding: 0 2rem;
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        
        .nav-container {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 70px;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
            font-weight: bold;
        }
        
        .logo-text {
            font-size: 24px;
            font-weight: 700;
            color: #f1f5f9;
            letter-spacing: -0.5px;
        }
        
        .nav-menu {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        
        .nav-item {
            color: #94a3b8;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
        }
        
        .nav-item:hover, .nav-item.active {
            color: #3b82f6;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .page-header {
            margin-bottom: 2rem;
        }
        
        .page-title {
            font-size: 2rem;
            font-weight: 700;
            color: #f1f5f9;
            margin-bottom: 0.5rem;
        }
        
        .page-subtitle {
            color: #94a3b8;
            font-size: 1.1rem;
        }
        
        .status-banner {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .status-icon {
            width: 48px;
            height: 48px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
        }
        
        .status-content h3 {
            color: white;
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.25rem;
        }
        
        .status-content p {
            color: rgba(255, 255, 255, 0.8);
            font-size: 0.875rem;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .metric-card {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 12px;
            padding: 2rem;
            text-align: center;
        }
        
        .metric-value {
            font-size: 3rem;
            font-weight: 700;
            color: #3b82f6;
            margin-bottom: 0.5rem;
        }
        
        .metric-label {
            color: #94a3b8;
            font-size: 1rem;
            font-weight: 500;
        }
        
        .metric-card.primary .metric-value {
            color: #3b82f6;
        }
        
        .metric-card.success .metric-value {
            color: #22c55e;
        }
        
        .info-section {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .info-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #f1f5f9;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .info-list {
            list-style: none;
            space: 0.75rem;
        }
        
        .info-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 0;
            border-bottom: 1px solid #334155;
            color: #e2e8f0;
        }
        
        .info-item:last-child {
            border-bottom: none;
        }
        
        .info-item i {
            color: #3b82f6;
            width: 20px;
        }
        
        .footer {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
        }
        
        .footer-content {
            color: #94a3b8;
            font-size: 0.875rem;
        }
        
        .footer-highlight {
            color: #3b82f6;
            font-weight: 500;
        }
    </style>
    <script>
        function updateStats() {
            fetch('/api/stats')
                .then(r => r.json())
                .then(data => {
                    document.getElementById('total').textContent = data.totalVisits || 0;
                    document.getElementById('blog').textContent = data.urls ? (data.urls['https://digitalproductssssss.blogspot.com/2024/01/blog-post.html'] || 0) : 0;
                    document.getElementById('success').textContent = data.successfulVisits || 0;
                    document.getElementById('updated').textContent = data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : 'Never';
                })
                .catch(err => {
                    console.log('Dashboard not available yet');
                });
        }
        
        // Update every 3 seconds
        setInterval(updateStats, 3000);
        
        // Initial load
        window.onload = updateStats;
    </script>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo">
                <div class="logo-icon">TH</div>
                <div class="logo-text">TurboHits</div>
            </div>
            <div class="nav-menu">
                <a href="http://localhost:5000" class="nav-item">Dashboard</a>
                <a href="/" class="nav-item active">Analytics</a>
                <a href="#" class="nav-item">Settings</a>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="page-header">
            <h1 class="page-title">Analytics Overview</h1>
            <p class="page-subtitle">Simplified view of your traffic generation performance</p>
        </div>
        
        <div class="status-banner">
            <div class="status-icon">
                <i class="fas fa-rocket"></i>
            </div>
            <div class="status-content">
                <h3>Traffic Generation Active</h3>
                <p>All bots are running and generating traffic to your blog</p>
            </div>
        </div>
        
        <div class="metrics-grid">
            <div class="metric-card primary">
                <div class="metric-value" id="total">0</div>
                <div class="metric-label">Total Visits Generated</div>
            </div>
            
            <div class="metric-card success">
                <div class="metric-value" id="blog">0</div>
                <div class="metric-label">Your Blog Visits</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-value" id="success">0</div>
                <div class="metric-label">Successful Visits</div>
            </div>
        </div>
        
        <div class="info-section">
            <h2 class="info-title">
                <i class="fas fa-cogs"></i>
                Active Traffic Generation
            </h2>
            <ul class="info-list">
                <li class="info-item">
                    <i class="fas fa-bolt"></i>
                    HTTP Bot: Fast visits every 15-30 seconds
                </li>
                <li class="info-item">
                    <i class="fas fa-globe"></i>
                    Real Browser Bot: Analytics visits every 8-20 seconds
                </li>
                <li class="info-item">
                    <i class="fas fa-bullseye"></i>
                    80% visits focused on your blog
                </li>
                <li class="info-item">
                    <i class="fas fa-random"></i>
                    Multiple user agents and referrers
                </li>
            </ul>
        </div>
        
        <div class="info-section">
            <h2 class="info-title">
                <i class="fas fa-chart-line"></i>
                Traffic Sources
            </h2>
            <ul class="info-list">
                <li class="info-item">
                    <i class="fas fa-desktop"></i>
                    Multiple browsers: Chrome, Firefox, Safari
                </li>
                <li class="info-item">
                    <i class="fas fa-mobile-alt"></i>
                    Mobile & Desktop traffic simulation
                </li>
                <li class="info-item">
                    <i class="fas fa-link"></i>
                    Referrers: Google, Facebook, Instagram, LinkedIn
                </li>
            </ul>
        </div>
        
        <div class="footer">
            <div class="footer-content">
                Last updated: <span id="updated" class="footer-highlight">Never</span> | 
                Analytics: <span class="footer-highlight">http://localhost:3000</span>
            </div>
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
    console.log('TurboHits Analytics running at http://localhost:3000');
});