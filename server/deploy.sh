#!/bin/bash

echo "What should be the version of the new release?"
read VERSION

echo "Deploying version $VERSION - are you sure? (y/n)"
read CONFIRM

if [ "$CONFIRM" == "y" ]; then
  echo "Deploying version $VERSION"

  # build
  docker build -t marcadrian/sharesphere:$VERSION .
  docker push marcadrian/sharesphere:$VERSION

  # ssh and pull amd yag and deploy
  # stop and remove previous container
  ssh root@209.38.232.216 "docker pull marcadrian/sharesphere:$VERSION && docker tag marcadrian/sharesphere:$VERSION dokku/api:$VERSION && dokku tags:deploy api $VERSION"


  

  

else
  echo "Aborted"
fi
