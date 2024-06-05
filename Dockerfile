# Use the official lightweight Node.js 18 image.
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the work directory
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build your Next.js app
RUN npm run build

# Inform Docker that the container is listening on port 3000
EXPOSE 3000

# Run the web service on container startup.
CMD ["npm", "start"]
