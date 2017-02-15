#!/bin/bash

#export BIND_IP=128.220.35.129
#for reverse proxying with Apache2
#export ROOT_URL="http://localhost:3000/gtex/gui"
#export ROOT_URL="http://stingray.cs.jhu.edu:8090/gtex/gui/"
#export ROOT_URL_PATH_PREFIX="/gtex/gui"
#meteor run --port 127.0.0.1:3000

export CLUSTER_WORKERS_COUNT=auto
meteor run --port 128.220.35.129:8443
#meteor debug
#meteor run
#to clean the mongodb
#meteor reset
