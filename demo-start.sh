#!/bin/bash

# Start the first process
echo "Start 1st"
./golang-object-store-service -D &
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start goserver: $status"
  exit $status
fi
echo "Start 2nd one"
# Start the second process
npm start -D &
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start webserver: $status"
  exit $status
fi

while /bin/true; do
  ps aux |grep golang-object-store-service |grep -q -v grep
  PROCESS_1_STATUS=$?
  ps aux |grep npm |grep -q -v grep
  PROCESS_2_STATUS=$?
  # If the greps above find anything, they will exit with 0 status
  # If they are not both 0, then something is wrong
  if [ $PROCESS_1_STATUS -ne 0 -o $PROCESS_2_STATUS -ne 0 ]; then
    echo "One of the processes has already exited."
    exit -1
  fi
  sleep 60
done

