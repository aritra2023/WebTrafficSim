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
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            min-height: 100vh;
            color: #ffffff;
        }
        
        .navbar {
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 0 1rem;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 4px 32px rgba(0, 0, 0, 0.3);
        }
        
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 80px;
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 16px;
        }
        
        .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #00d4ff 0%, #5b73ff 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 18px;
            color: white;
            box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
        }
        
        .logo-text {
            font-size: 24px;
            font-weight: 700;
            background: linear-gradient(135deg, #00d4ff 0%, #5b73ff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.5px;
        }
        
        .hamburger {
            display: none;
            flex-direction: column;
            cursor: pointer;
            padding: 8px;
        }

        .hamburger span {
            width: 25px;
            height: 3px;
            background: #fff;
            margin: 3px 0;
            border-radius: 2px;
            transition: 0.3s;
        }

        .nav-menu {
            display: flex;
            gap: 2rem;
            list-style: none;
        }
        
        .nav-item {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            font-weight: 500;
            padding: 10px 20px;
            border-radius: 10px;
            transition: all 0.3s;
            border: 1px solid transparent;
        }
        
        .nav-item:hover {
            background: rgba(0, 212, 255, 0.1);
            color: #00d4ff;
            border-color: rgba(0, 212, 255, 0.3);
        }
        
        .nav-item.active {
            background: linear-gradient(135deg, #00d4ff 0%, #5b73ff 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
        }

        @media (max-width: 768px) {
            .hamburger {
                display: flex;
            }

            .nav-menu {
                position: fixed;
                left: -100%;
                top: 80px;
                flex-direction: column;
                background: rgba(0, 0, 0, 0.95);
                width: 100%;
                text-align: center;
                transition: 0.3s;
                backdrop-filter: blur(20px);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                padding: 2rem 0;
            }

            .nav-menu.active {
                left: 0;
            }

            .nav-item {
                margin: 1rem 0;
                display: block;
                width: 80%;
                margin: 1rem auto;
            }
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .hero-section {
            text-align: center;
            margin-bottom: 3rem;
            padding: 3rem 0;
        }
        
        .hero-title {
            font-size: 3rem;
            font-weight: 700;
            color: white;
            margin-bottom: 1rem;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            line-height: 1.1;
        }
        
        .hero-subtitle {
            font-size: 1.25rem;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 2rem;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(34, 197, 94, 0.2);
            color: #22c55e;
            padding: 12px 24px;
            border-radius: 50px;
            font-weight: 600;
            border: 2px solid rgba(34, 197, 94, 0.3);
            backdrop-filter: blur(10px);
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
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }
        
        .metric-value {
            font-size: 3rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 0.5rem;
        }
        
        .metric-label {
            color: #64748b;
            font-size: 1rem;
            font-weight: 500;
        }
        
        .metric-card.primary .metric-value {
            color: #667eea;
        }
        
        .metric-card.success .metric-value {
            color: #059669;
        }
        
        .info-section {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .info-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .info-list {
            list-style: none;
            space: 0.75rem;
        }
        
        .info-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 0;
            border-bottom: 1px solid #e2e8f0;
            color: #475569;
        }
        
        .info-item:last-child {
            border-bottom: none;
        }
        
        .info-item i {
            color: #667eea;
            width: 24px;
            font-size: 18px;
        }
        
        .footer {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .footer-content {
            color: #64748b;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .footer-highlight {
            color: #667eea;
            font-weight: 600;
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

        // Hamburger menu toggle
        function toggleMenu() {
            const navMenu = document.getElementById('navMenu');
            navMenu.classList.toggle('active');
        }
    </script>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo">
                <div class="logo-icon">TH</div>
                <div class="logo-text">TurboHits</div>
            </div>
            <div class="hamburger" onclick="toggleMenu()">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="nav-menu" id="navMenu">
                <a href="http://localhost:5000" class="nav-item">Dashboard</a>
                <a href="/" class="nav-item active">Analytics</a>
                <a href="#" class="nav-item" onclick="alert('Website coming soon!')">Website</a>
                <a href="#" class="nav-item" onclick="alert('Premium features coming soon!')">Premium</a>
                <a href="#" class="nav-item" onclick="alert('Support coming soon!')">Support</a>
            </div>
        </div>
    </nav>

    <div class="container">
        <div class="hero-section">
            <h1 class="hero-title">Analytics Overview</h1>
            <p class="hero-subtitle">Key performance metrics and system status at a glance</p>
            <div class="status-badge">
                <i class="fas fa-circle"></i>
                System Running
            </div>
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