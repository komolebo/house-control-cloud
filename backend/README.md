# Initial steps
# copy environment file
cp .env.debug .env

# Installation
$ npm install

# Running the app
# development
$ npm run start
# watch mode
$ npm run start:dev
# production mode
$ npm run start:prod

# Test
# unit tests
$ npm run test
# e2e tests
$ npm run test:e2e
# test coverage
$ npm run test:cov

# Migration
1. Go to database folder and setup config/config.json 
2.1. Set migration file name in Database provider
2.1.1 Put a counter in name to ease a downgrade

2.2. Compile and check file is created
2.3. Run
npx sequelize-cli db:migrate --to 00000001-migration--append.js
2.4. To downgrade run
npx sequelize-cli db:migrate:undo --name 00000001-migration--append.js

FYI:
npx sequelize-cli db:migrate:status