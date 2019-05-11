FROM node:8-alpine
WORKDIR /app
COPY . .
RUN npm install
ENV API_URL http://192.168.1.71:8080/api
EXPOSE 5151
CMD [ "npm", "start" ]