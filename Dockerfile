FROM node:8-alpine
WORKDIR /app
COPY . .
RUN npm install
ENV PORT 5050
ENV API_URL http://192.168.1.71:8080/api
EXPOSE 5050
CMD [ "npm", "start" ]