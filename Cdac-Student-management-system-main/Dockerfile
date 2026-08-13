# Stage 1: Build React App
FROM node:18-alpine AS build
WORKDIR /app
ENV CI=false
ENV DISABLE_ESLINT_PLUGIN=true
COPY package*.json ./
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    (npm ci || npm install)
COPY . .
RUN npm run build

# Stage 2: Serve via Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
