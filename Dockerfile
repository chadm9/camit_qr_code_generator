# Stage 1: Build and Minify
FROM node:18-alpine AS builder

WORKDIR /build

# Copy source files
COPY index.html ./
COPY styles/ ./styles/
COPY js/ ./js/
COPY images/ ./images/

# Install minification tools globally
RUN npm install -g html-minifier-terser terser clean-css-cli

# Minify in-place (outputting to temporary files, then overwriting) to avoid changing HTML links
RUN html-minifier-terser --collapse-whitespace --remove-comments --remove-optional-tags index.html -o index.html && \
    terser js/script.js -m -c -o js/script.js && \
    cleancss -o styles/style.css styles/style.css


# Stage 2: Runtime
FROM nginx:1.25-alpine-slim

# Set default port if not provided
ENV PORT=80

# Remove default nginx static assets to save space
RUN rm -rf /usr/share/nginx/html/*

# Copy optimized Nginx template
# The official nginx image automatically extracts environment variables for any .template 
# file found in /etc/nginx/templates/ and places the result in /etc/nginx/conf.d/
COPY default.conf.template /etc/nginx/templates/

# Copy minified assets from builder stage
COPY --from=builder /build/index.html /usr/share/nginx/html/
COPY --from=builder /build/styles/ /usr/share/nginx/html/styles/
COPY --from=builder /build/js/ /usr/share/nginx/html/js/
COPY --from=builder /build/images/ /usr/share/nginx/html/images/

# Expose the configured port (informative, actual binding is set dynamically)
EXPOSE ${PORT}

# Use the default Nginx entrypoint and command which handles the templates
CMD ["nginx", "-g", "daemon off;"]
