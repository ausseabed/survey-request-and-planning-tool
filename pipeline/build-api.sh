#!/usr/bin/env bash
set -xe
docker build \
    -t crcsi/qa4mbes-api:$IMAGE_TAG \
    --build-arg AUTH_HOST=$AUTH_HOST \
    --build-arg AUTH_CLIENT_ID=$AUTH_CLIENT_ID \
    server
