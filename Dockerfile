# the way to multi-stage build

###### building image ######
FROM golang:latest as builder
ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOARCH=amd64
WORKDIR /go/src/gouml-playground/
COPY . .
RUN make build

###### runtime image ######

FROM alpine:latest
EXPOSE 8080
# to use connection with SSL/TLS
RUN apk add --no-cache ca-certificates

COPY --from=builder /go/src/gouml-playground/bin/app /app
CMD ["/app"]
