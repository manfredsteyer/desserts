#!/bin/bash
for file in *.jpg; do
    jpegoptim --max=60 "$file"
done