# CAMIT Device WIFI QR Code Generator

This is a lightweight static web application designed to generate secure configuration QR codes for CAMIT devices to connect to WIFI networks.

## Architecture and Stack

The application is built with a singular focus on performance, simplicity, and zero-dependency footprint where possible:

- **HTML5:** Provides the semantic structure and the modal popup.
- **CSS3:** Modern, custom styling with CSS variables, Flexbox layouts, and smooth micro-animations. No heavy CSS frameworks (like Bootstrap or Tailwind) are used to keep the footprint minimal.
- **Vanilla JavaScript (ES6+):** Handles form submission, parses the user input securely into a base64 string, and generates the resulting unified payload string format (`4={base64_ssid}/{base64_pass}`).
- **QRCode.js:** A lightweight, client-side only JavaScript library loaded via CDN, used strictly for drawing the generated payload into a visible canvas element in the UI.

## Local Development Usage

Because this is a static site without backend frameworks, development is extremely simple.
1. Clone or open the directory.
2. Open `index.html` directly in your browser.
3. Enter your SSID and Password, then click "Generate".
4. The QR Code renders instantly in a popup overlay on the same page.

## Extreme Optimization Docker Setup

To serve this application in production environments (such as Kubernetes or Cloud Run), it has been containerized with an intense focus on minimizing both image footprint and cold-start latency. 

### Multi-Stage Build Strategy

The `Dockerfile` employs a multi-stage process to guarantee that absolutely zero build tools end up in the final runtime container.

1. **Stage 1 (Builder):**
    - Built on `node:18-alpine`.
    - Tools (`html-minifier-terser`, `terser`, `clean-css-cli`) are installed temporarily.
    - `index.html`, `style.css`, and `script.js` are rigorously minified in place to strip off spaces, comments, and non-essential characters.

2. **Stage 2 (Runtime):**
    - Built on the ultra-minimal `nginx:alpine-slim` image.
    - Default Nginx assets (`/usr/share/nginx/html/*`) are removed to recover every byte possible.
    - A custom `default.conf.template` forces Nginx to:
        - Utilize `$PORT` dynamically.
        - Enable GZip proxying for smaller network payload transfers.
        - Employ aggressive `Cache-Control` max-age headers for static files (so the client browser caches them for 6 months).
        - Disable the `access_log` specifically for static files to save disk I/O latency.
    - Only the completely minified assets and images are pulled from the `builder` stage.

### .dockerignore
To keep the build context transfer to the Docker Daemon virtually instantaneous, the `.dockerignore` safely removes `.git`, `.idea`, `node_modules`, and any Markdown files from ever being seen by the builder.

### Running the Docker Container Locally

1. **Build the image**:
   ```bash
   docker build -t camit-qr-app:optimized .
   ```

2. **Run the container** (Mapping local port 8080 to the container's PORT):
   ```bash
   docker run -p 8080:80 -e PORT=80 camit-qr-app:optimized
   ```

3. Open `http://localhost:8080` in your browser.
