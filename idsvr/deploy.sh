#!/bin/bash

#############################################################################
#  Copyright 2022 Curity AB                                                 #
#                                                                           #
#  Licensed under the Apache License, Version 2.0 (the "License");          #
#  you may not use this file except in compliance with the License.         #
#  You may obtain a copy of the License at                                  #
#                                                                           #
#      http://www.apache.org/licenses/LICENSE-2.0                           #
#                                                                           #
#  Unless required by applicable law or agreed to in writing, software      #
#  distributed under the License is distributed on an "AS IS" BASIS,        #
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. #
#  See the License for the specific language governing permissions and      #
#  limitations under the License.                                           #
#############################################################################

#################################################################
# Deploy the Curity Identity Server with the required settings. #
# This enables to test the SPA                                  #
#################################################################

#
# Ensure that we are in the folder containing this script
#
cd "$(dirname "${BASH_SOURCE[0]}")"

#
# This is for Curity developers only
#
cp ./pre-commit ../.git/hooks

#
# Check for a license file
#
if [ ! -f './license.json' ]; then
  echo "Please provide a license.json file in the test/idsvr folder"
  exit 1
fi

#
# Run Docker to deploy the Curity Identity Server
#
docker compose --project-name idsvr up --force-recreate -d
if [ $? -ne 0 ]; then
  echo "Problem encountered starting Docker components"
  exit 1
fi

