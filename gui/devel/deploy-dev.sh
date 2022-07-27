#!/bin/bash

set -ex

TARGET=gs://figurl/draculus-2dev

yarn build

zip -r build/bundle.zip build

gsutil -m cp -R ./build/* $TARGET/