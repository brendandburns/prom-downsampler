FROM debian:bookworm-slim

RUN apt-get update && apt-get install -yy -q nodejs
COPY node_modules /node_modules

COPY dist/aggregator.js /aggregator.js

CMD ["node", "/aggregator.js"]