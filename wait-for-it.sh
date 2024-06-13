#!/bin/sh
# Use this script to test if a given TCP host/port are available
# Based on: https://github.com/vishnubob/wait-for-it

TIMEOUT=15

HOST="$1"
PORT="$2"
shift 2

cmd="$@"

echo "Waiting for $HOST:$PORT..."

for i in `seq $TIMEOUT` ; do
  nc -z "$HOST" "$PORT" > /dev/null 2>&1
  result=$?
  if [ $result -eq 0 ] ; then
    break
  fi
  echo -n .
  sleep 1
done

if [ $result -ne 0 ] ; then
  echo "Could not connect to $HOST:$PORT"
  exit 1
fi

exec $cmd
