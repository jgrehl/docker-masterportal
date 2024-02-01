FROM node:20.9.0 as dependencies
WORKDIR /masterportal
COPY package.json ./
RUN yarn install --frozen-lockfile

FROM node:20.9.0 as builder
WORKDIR /masterportal
COPY . .
COPY --from=dependencies /masterportal/node_modules ./node_modules
RUN yarn build

FROM node:20.9.0 as runner
WORKDIR /masterportal
ENV NODE_ENV dev
# If you are using a custom next.config.js file, uncomment this line.
# COPY --from=builder /masterportal/next.config.js ./
COPY --from=builder /masterportal/. ./
#COPY --from=builder /masterportal/node_modules ./node_modules
#COPY --from=builder /masterportal/package.json ./package.json

EXPOSE 9001
CMD ["yarn", "start"]