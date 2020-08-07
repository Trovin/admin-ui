#!/bin/bash
echo "starting deployment"
env | grep project_
echo
ls -ltra /opt/
echo "--"
ls -ltra /opt/${project_name}/
echo "-----"
ls -ltr /opt/${project_name}/client/
echo
echo "------------------ cd /opt/${project_name}/client && npm -y install"
cd /opt/${project_name}/client && npm -y install
echo
echo "------------------ npm run ${project_env}"
npm run ${project_env}
echo
echo "------------------ run galaxy-ui-${project_env}"
npm run galaxy-ui-${project_env}