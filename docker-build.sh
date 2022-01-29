# Set permission to 777 (chmod 777) in order to execute this file.

# Stop current container if its running.
docker rm $(docker stop $(docker ps -a -q --filter ancestor=fgo-planner-api-server --format="{{.ID}}"))

# Remove previous image if it exists.
docker image rm fgo-planner-api-server

# Build new image.
docker build . --no-cache -t fgo-planner-api-server