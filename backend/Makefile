#!/usr/bin/env make

# Version of the entire package. Do not forget to update this when it's time
# to bump the version.
VERSION = v0.0.1

# Build tag. Useful to distinguish between same-version builds, but from
# different commits.
BUILD = $(shell git rev-parse --short HEAD)

# Full version includes both semantic version and git ref.
FULL_VERSION = $(VERSION)-$(BUILD)

LDFLAGS = -X main.appVersion=$(FULL_VERSION)
GOCMD := ./cmd
GO ?= go
TARGETDIR := target

FILLER     := ${TARGETDIR}/filler

TAGS = nocgo

clean: clean/db

clean/db:
	rm -rf ./postgres-data

build: build/filler

build/filler:
	@echo "+ $@"
	${GO} build -tags "$(TAGS)" -ldflags "$(LDFLAGS)" -o ${FILLER} ${GOCMD}/filler

fmt:
	@echo "+ $@"
	@test -z "$$(gofmt -s -l . 2>&1 | grep -v ^vendor/ | tee /dev/stderr)" || \
		(echo >&2 "+ please format Go code with 'gofmt -s'" && false)

vet:
	@echo "+ $@"
	@go tool vet $(shell ls -1 -d */ | grep -v -e vendor)
