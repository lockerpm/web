![Locker Password Manager](https://raw.githubusercontent.com/lockerpm/.github/main/images/locker3.png)

# Locker Web Vault

Locker Web Vault is the client-side web application for the Locker Password Manager, an end-to-end encryption software that allows users to securely store and manage their sensitive data and secrets. This repository contains the code and resources for the user interface, enabling users to interact with the Locker backend through API calls.

## Getting Started

To run the Web Vault locally, follow these steps:

- Clone this repository to your local machine.
- Ensure you have Node.js and npm (Node Package Manager) installed.
- Build and run the Web Vault.

  ```shell
  # install dependencies
  yarn

  # install submodules
  yarn sub:init

  # serve app with hot reload
  yarn dev-web
  ```

- Open your browser and navigate to `https://localhost:3011`.

### SSL Certificate

It's recommended to generate an SSL certificate for local development to prevent browser warnings about invalid certificates and properly support WebAuth which is blocked on websites with certificate errors. Please follow [the official NUXT documentation](https://v2.nuxt.com/docs/configuration-glossary/configuration-server/#example-using-https-configuration) on how to enable HTTPS.

```shell
# Generate local key and certificate
openssl genrsa 2048 > server.key
chmod 400 server.key
openssl req -new -x509 -nodes -sha256 -days 365 -key server.key -out server.crt

# Put server.key and server.crt inside src/renderer

# Add the following line to src/renderer/.env
ENABLE_HTTPS="1"
```

### Configuring

By default, the Web Vault will use Locker official server. You can use your local server instead or configure custom endpoints.

### Custom Endpoints

You can manually set your API endpoint and web socket settings by creating a `src/renderer/.env` file with the following content:

```
WS_URL="<wss://your-websocket-url>"
BASE_API_URL="<https://your-api-url>"
```

## Credits

The Locker Web Vault project utilizes the [Jslib library from Bitwarden](https://github.com/bitwarden/jslib). Jslib is a JavaScript library for working with cryptographic algorithms and other utility functions.

## Contributing

Contributions to the Locker Web project are welcome! If you find any issues or want to suggest improvements, please feel free to open an issue or submit a pull request.

Before contributing, please review the [Contribution Guidelines](https://github.com/lockerpm/.github/blob/main/CONTRIBUTING.md).

## License

The Locker Web is open-source and released under the [GPLv3](./LICENSE) License. Feel free to use, modify, and distribute the code as per the terms of the license.
