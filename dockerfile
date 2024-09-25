# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the entire application to the working directory in the container
COPY . .

# Expose the port on which the app will run
EXPOSE 5000

# Set environment variables (you can also set these in a docker-compose file or as runtime arguments)
ENV JWT_SECRET=your_jwt_secret \
    RECAPTCHA_SECRET=your_recaptcha_secret \
    PORT=5000

# Command to run the application
CMD ["npm", "start"]
