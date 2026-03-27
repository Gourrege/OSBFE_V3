FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production

FROM nginx:alpine

COPY --from=build /app/dist/front-end-f1/browser /usr/share/nginx/html
COPY render/default.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 10000
CMD ["nginx", "-g", "daemon off;"]
