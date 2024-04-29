# Frontend for DITCH Telegram Store

## Installation

1. Install the appropriate version of [Node.js](https://nodejs.org/en/download/) and [Yarn](https://yarnpkg.com/en/docs/install). You can check package.json for the version of Node.js and Yarn used in the project.
2. Run `yarn install` in the root directory of the project to install all dependencies

## Development

Run `yarn run dev` to start the development server on `http://localhost:3000`.

The frontend requires the backend to be running to function properly. Once the backend is running, set the `NEXT_PUBLIC_API_URL` environment variable to the URL of the backend server.

Empty .env file is provided for convenience. Copy the contents of .env.example to .env and set the all the required environment variables.

## Deployment

There is a dockerfile in the root directory of the project. You can build the docker image using the following command:

```bash
docker build -t tg-shop-frontend .
```

You can run the docker container using the following command:

```bash
docker run -p 3000:3000 tg-shop-frontend
```

This can be used to deploy the frontend locally. Production deployment is automated using GitHub Actions. Once the code is ready to be pushed to production, increment the version number in the package.json file and open a pull request. Once all the checks are complete, merge the pull request to the main branch. This will trigger the GitHub Actions workflow to build and deploy the frontend to the staging server first. Once the changes are verified, the changes can be deployed to productions manually 
