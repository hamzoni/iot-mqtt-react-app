#!/usr/bin/env bash

yarn build
cd build && aws s3 sync . s3://fsb-iot-app/ --profile taquy --acl public-read
aws cloudfront create-invalidation --distribution-id E12XR40UZ29TZC --paths / --profile taquy