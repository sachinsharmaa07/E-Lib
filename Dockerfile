FROM node:18-alpine

WORKDIR /app

# Copy the entire project
COPY . .

# Install dependencies for backend
WORKDIR /app/Backend
RUN npm install

# Expose port
EXPOSE 4000

# Start the backend
CMD ["npm", "start"]
