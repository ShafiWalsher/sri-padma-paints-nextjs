<?php
$isApiRequest = isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;

if ($isApiRequest) {
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'healthy',
        'uptime' => round((microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"]), 4),
        'timestamp' => date('c'),
        'version' => 'v1.0.0'
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>API Service Dashboard</title>
    <style>
        body {
            font-family: system-ui, sans-serif;
            background: #f4f4f4;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .container {
            max-width: 600px;
            text-align: center;
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
        }

        h1 {
            margin-top: 0;
            font-size: 2rem;
        }

        p.description {
            color: #555;
            margin-bottom: 1.5rem;
        }

        .info {
            margin-top: 1rem;
            color: #666;
            font-size: 0.95rem;
        }

        .highlight {
            font-weight: 500;
            color: #000;
        }

        button {
            margin-top: 1rem;
            padding: 0.6rem 1.2rem;
            font-size: 1rem;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        button:disabled {
            background-color: #7aaefb;
            cursor: not-allowed;
        }

        .spinner-inside {
            width: 18px;
            height: 18px;
            border: 3px solid rgba(255, 255, 255, 0.4);
            border-top: 3px solid #fff;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }

        #healthStatus {
            margin-top: 1.5rem;
            display: none;
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 1rem;
            border-radius: 8px;
            text-align: left;
            font-family: 'Courier New', monospace;
            font-size: 0.95rem;
            white-space: pre-wrap;
            overflow-x: auto;
            box-shadow: inset 0 0 0 1px #333;
        }

        footer {
            margin-top: 2rem;
            font-size: 0.85rem;
            color: #888;
        }

        footer a {
            color: #007BFF;
            text-decoration: none;
        }

        footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>🚀 API Service</h1>
        <p class="description">
            This is the entry point to the backend API that powers various application services and integrations.
        </p>

        <button id="healthBtn" onclick="checkHealth()">
            <span>Check API Health</span>
            <span id="btnSpinner" class="spinner-inside" style="display: none;"></span>
        </button>

        <div id="healthStatus"></div>

        <div class="info">
            <p><strong>Version:</strong> <span class="highlight">v1.0.0</span></p>
            <p><strong>Environment:</strong> <span class="highlight">Production</span></p>
        </div>

        <footer>
            For support or documentation, contact your API administrator.
        </footer>
    </div>

    <script>
        function checkHealth() {
            const statusDiv = document.getElementById('healthStatus');
            const button = document.getElementById('healthBtn');
            const btnSpinner = document.getElementById('btnSpinner');

            statusDiv.style.display = 'none';
            statusDiv.textContent = '';
            button.disabled = true;
            btnSpinner.style.display = 'inline-block';

            setTimeout(() => {
                fetch('index.php', {
                        headers: {
                            'Accept': 'application/json'
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        statusDiv.style.display = 'block';
                        statusDiv.textContent = JSON.stringify(data, null, 2);
                    })
                    .catch(() => {
                        statusDiv.style.display = 'block';
                        statusDiv.textContent = '❌ Error fetching health info.';
                    })
                    .finally(() => {
                        button.disabled = false;
                        btnSpinner.style.display = 'none';
                    });
            }, 300);
        }
    </script>
</body>

</html>