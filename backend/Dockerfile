# Build enviroment
FROM golang:1.12.7-alpine3.9  AS build-env

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh make
ADD . /app
RUN cd /app && make build

# Run enviroment
FROM alpine
WORKDIR /app
COPY --from=build-env /app/target/filler /app/
