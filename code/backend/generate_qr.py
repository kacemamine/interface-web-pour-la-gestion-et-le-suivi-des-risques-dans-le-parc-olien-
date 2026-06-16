import qrcode
import json
import os
import sys
import socket
from datetime import datetime


def get_local_ip():
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            sock.connect(("8.8.8.8", 80))
            return sock.getsockname()[0]
    except OSError:
        return "localhost"

def generate_access_qr(ip_address=None):
    # S'assurer que le dossier QR existe
    qr_dir = "QR"
    if not os.path.exists(qr_dir):
        os.makedirs(qr_dir)

    if not ip_address:
        ip_address = get_local_ip()

    # Préparer les informations d'accès
    frontend_url = f"http://{ip_address}:3000"
    access_info = {
        "url": frontend_url,
        "timestamp": datetime.now().strftime("%Y%m%d_%H%M%S")
    }

    # Générer un nom de fichier basé sur le timestamp
    timestamp = access_info["timestamp"]
    qr_filename = f"frontend_qr_{timestamp}.png"
    json_filename = f"access_info_{timestamp}.json"
    html_filename = f"qr_code_{timestamp}.html"

    # Sauvegarder les informations d'accès en JSON
    json_path = os.path.join(qr_dir, json_filename)
    with open(json_path, 'w') as f:
        json.dump(access_info, f, indent=2)

    # Générer le QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(access_info["url"])
    qr.make(fit=True)

    # Sauvegarder le QR code
    qr_path = os.path.join(qr_dir, qr_filename)
    qr_image = qr.make_image(fill_color="black", back_color="white")
    qr_image.save(qr_path)

    # Créer la page HTML
    html_content = f"""
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>QR Code d'accès - Gestion des Dangers</title>
        <style>
            body {{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                padding: 20px;
            }}
            .container {{
                background-color: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 500px;
                width: 100%;
            }}
            h1 {{
                color: #333;
                margin-bottom: 20px;
            }}
            img {{
                max-width: 300px;
                width: 100%;
                height: auto;
                margin: 20px 0;
            }}
            .urls {{
                text-align: left;
                margin: 20px 0;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 5px;
            }}
            .info {{
                color: #666;
                font-size: 0.9em;
                margin-top: 20px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔗 Accès à l'application</h1>
            <img src="{qr_filename}" alt="QR Code d'accès">
            <div class="urls">
                <p><strong>URL:</strong> {access_info["url"]}</p>
            </div>
            <p class="info">Scannez ce QR code avec votre téléphone pour accéder à l'application</p>
            <p class="info">Date de génération: {datetime.now().strftime("%d/%m/%Y %H:%M:%S")}</p>
        </div>
    </body>
    </html>
    """
    
    html_path = os.path.join(qr_dir, html_filename)
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f"\nQR Code généré avec succès!")
    print(f"Fichier QR: {qr_path}")
    print(f"Fichier JSON: {json_path}")
    print(f"Fichier HTML: {html_path}")

    # Ouvrir automatiquement la page HTML dans le navigateur par défaut
    import webbrowser
    webbrowser.open(html_path)

if __name__ == "__main__":
    # Récupérer l'IP depuis les arguments de la ligne de commande
    ip_address = sys.argv[1] if len(sys.argv) > 1 else None
    generate_access_qr(ip_address)
