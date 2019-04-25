# Just a basic template I wrote to use express with typescript!

[![CircleCI](https://circleci.com/gh/pringon/express-typescript.svg?style=svg)](https://circleci.com/gh/pringon/express-typescript)

# Usage

## Run in development

- ```docker-compose up```
  - The app will automatically reload when you make changes.

## Generate production build

- ```docker build -t <image-name> .```
  - This will generate a docker image ready to be used on whatever cloud service you want (don't forget the **dot**!).
- ```docker push <image-name>```
  - Makes getting the image onto the cloud machine a little easier.

## Testing

- ```npm run test```
  - Will run your test suite.