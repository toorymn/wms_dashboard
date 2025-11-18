# WMS Admin Docker Deployment

## Quick Start

### Build and run locally
```bash
# Build the Docker image
docker build -t wms-admin .

# Run the container
docker run -p 8080:8080 wms-admin
```

### Using Docker Compose
```bash
# Build and start
docker-compose up -d

# Stop
docker-compose down
```

## Deployment to Dockploy Virtual Server

### Prerequisites
1. Dockploy installed on your virtual server
2. Docker and Docker Compose installed
3. Domain name configured (optional)

### Deployment Steps

1. **Push your code to a Git repository** (GitHub, GitLab, etc.)

2. **In Dockploy dashboard:**
   - Create a new application
   - Connect your Git repository
   - Set the build context to root directory
   - Configure the Dockerfile path: `./Dockerfile`

3. **Environment Variables (if needed):**
   ```
   VITE_API_URL=https://your-api-domain.com
   NODE_ENV=production
   ```

4. **Port Configuration:**
   - Container Port: 8080
   - Public Port: 8080 (or your preferred port)
   - Note: Avoid port 3000 as it may conflict with Dockploy dashboard

5. **Deploy:**
   - Click "Deploy" in Dockploy
   - Monitor the build logs
   - Access your application once deployment is complete

### Custom Domain Setup
1. Point your domain to your server IP
2. In Dockploy, configure the domain in the application settings
3. Enable SSL/TLS certificate (Let's Encrypt)

### Health Check
The container includes a health check endpoint at `/health` that returns "healthy" when the application is running properly.

Access it at: `http://your-server:8080/health`

### Monitoring
- Check container logs in Dockploy dashboard
- Monitor resource usage
- Set up alerts for application downtime

## Build Optimization

The Dockerfile uses multi-stage builds:
- **Stage 1 (Builder):** Installs dependencies and builds the React app
- **Stage 2 (Production):** Serves static files with Nginx

This results in a smaller final image (~50MB) compared to serving with Node.js.

## Security Features
- Security headers configured in Nginx
- Gzip compression enabled
- Static asset caching
- Health check endpoint

## Troubleshooting

### Build Issues
```bash
# Check build logs
docker build -t wms-admin . --progress=plain

# Interactive debug
docker run -it --entrypoint sh node:18-alpine
```

### Runtime Issues
```bash
# Check container logs
docker logs <container-id>

# Access container shell
docker exec -it <container-id> sh
```

### Common Issues
1. **Build fails:** Check if all dependencies are in package.json
2. **404 errors:** Verify Nginx configuration for SPA routing
3. **API calls fail:** Check VITE_API_URL environment variable