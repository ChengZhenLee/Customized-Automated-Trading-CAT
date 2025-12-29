# 1. Use a Node image
FROM node:20-slim

# 2. Set the working directory for the frontend
WORKDIR /app/client

# 3. Copy package files first to cache the 'npm install' layer
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the frontend code
COPY . .

# 6. Vite's default dev port
EXPOSE 5173

# 7. Start Vite with the --host flag 
# (Crucial: Docker needs --host to expose the server outside the container)
CMD ["npm", "run", "dev", "--", "--host"]