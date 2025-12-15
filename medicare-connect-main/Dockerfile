FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Build arguments for API URLs
ARG VITE_DRUG_SERVICE_URL=/api/drugs
ARG VITE_INTERACTION_SERVICE_URL=/api/interactions
ARG VITE_PRESCRIPTION_SERVICE_URL=/api/prescriptions

ENV VITE_DRUG_SERVICE_URL=$VITE_DRUG_SERVICE_URL
ENV VITE_INTERACTION_SERVICE_URL=$VITE_INTERACTION_SERVICE_URL
ENV VITE_PRESCRIPTION_SERVICE_URL=$VITE_PRESCRIPTION_SERVICE_URL

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

