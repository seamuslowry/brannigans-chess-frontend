interface Configuration {
  serviceUrl: string;
  reduxDevtools: boolean;
}

const dev: Configuration = {
  serviceUrl: 'https://backend-dev.branniganschess.com',
  reduxDevtools: true
};

const prod: Configuration = {
  serviceUrl: 'https://backend.branniganschess.com',
  reduxDevtools: false
};

const local: Configuration = {
  serviceUrl: 'http://localhost:8080',
  reduxDevtools: true
};

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
