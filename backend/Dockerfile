FROM golang:1.12.7-alpine3.9


WORKDIR /app

ADD . /app
RUN cd /app && go build -o goapp

ENTRYPOINT ./goapp
