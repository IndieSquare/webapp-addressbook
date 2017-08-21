#!/bin/sh

branch=$(git rev-parse --abbrev-ref HEAD)

echo "start deploy $branch"

git pull
npm install

if [ "$branch" = "develop" ]
then
  echo "ng build -op build --aot"
  ng build -op build --aot
elif [ "$branch" = "master" ]
then
  echo "ng build -op build -prod"
  ng build -op build -prod
fi

rm -rf dist
mv build dist

echo "deploy done"