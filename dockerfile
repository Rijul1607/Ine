# Stage 1: Build Vite frontend
FROM node:20 AS frontend-build
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .

# Pass Vite env variables at build time
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_API_BASE

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_API_BASE=$VITE_API_BASE

RUN npm run build

# Stage 2: Setup backend (Express)
FROM node:20 AS backend
WORKDIR /app

COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Copy Vite build into backend public folder
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 8080
CMD ["node", "index.js"]
