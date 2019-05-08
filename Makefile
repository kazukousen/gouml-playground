REVISION := $(shell git rev-parse --short HEAD)
LDFLAGS := -ldflags="-s -w -extldflags -static"

build:
	GO111MODULE=on go build \
		-o bin/app \
		-a -tags netgo \
		-installsuffix netgo \
		$(LDFLAGS) \
		gouml/main.go

container:
	docker build -t gouml-playground:$(REVISION) .

run:
	REVISION=$(REVISION) docker-compose up
