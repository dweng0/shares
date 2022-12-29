# Shares to CSV App
## A tool that outputs customer shares

What does it do? Reads a CSV from a user specified path and outputs a csv of client shares 

## Design
![sequence diagram](./supporting%20documentation/sequencediagram.png)

## Code Coverage
To run the tests and generate code coverage run
```bash
    npm run test
```
It can then be found in the ```./coverage``` folder. 
![Jest Coverage](./supporting%20documentation/coverage.png)

![LCOV](./supporting%20documentation/lcov.png)

## The CLI

Running 
```bash
    npx ts-node src/index.ts
```

will kick things off.

If you do not wish to use the ts-node transpiler you can run

```bash
    npm run build
```
this will build the app into javascript and it can be run using the following command instead

```bash
    node dist/index.js
```

![The CLI](./supporting%20documentation/cli.gif)

## Documentation

To generate documentation run
```bash
    npm run docs
```
It can then be found in the ```./docs``` folder. It was generated using TypeDoc.

![TypeDoc](./supporting%20documentation/docs.png)

This app uses a some open source projects for rendering the CLI, here are the main ones:

- [Inquirer](https://github.com/SBoudrias/Inquirer.js#readme) - For rendering the CLI.
- [BigNumber](https://github.com/MikeMcl/bignumber.js) - For working with high precision numbers

## Installation
 Just install and run using npm.
 
 Node vesion 16.15.1 was used for deveolpment and Typescript 4.9.4