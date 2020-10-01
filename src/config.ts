interface Configuration {
  serviceUrl: string;
}

const dev: Configuration = {
  serviceUrl: 'https://backend-dev.branniganschess.com'
};

const prod: Configuration = {
  serviceUrl: 'https://backend.branniganschess.com'
};

const local: Configuration = {
  serviceUrl: 'http://localhost:8080'
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
