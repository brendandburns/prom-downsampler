FROM debian:bookworm-slim

RUN apt-get update && apt-get install -yy -q nodejs
COPY dist/aggregator.js /aggregator.js
COPY config.json /config.json
COPY node_modules /node_modules

CMD ["node", "/aggregator.js"]