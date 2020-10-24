interface Configuration {
  serviceUrl: string;
  clientId: string;
}

const clientId = '422426494180-ra8k12sftd9bk5nabo6nc0suti8if8f9.apps.googleusercontent.com';

const dev: Configuration = {
  serviceUrl: 'https://backend-dev.branniganschess.com',
  clientId
};

const prod: Configuration = {
  serviceUrl: 'https://backend.branniganschess.com',
  clientId
};

const local: Configuration = {
  serviceUrl: 'http://localhost:8080',
  clientId
};

// eslint-disable-next-line import/no-mutable-exports
let config: Configuration;

switch (process.env.REACT_APP_ENV) {
  case 'production':
    config = prod;
    break;
  case 'development':
    config = dev;
    break;
  default:
    config = local;
    break;
}

export default config;
