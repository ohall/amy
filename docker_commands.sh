#!/usr/bin/env bash
docker build -t oakley349/amy .
docker kill $(docker ps -q)
docker run --env-file ./env.list -p 3000:3000 -d oakley349/amy

sleep 5

docker logs -f $(docker ps -q)