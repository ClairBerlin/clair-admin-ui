# Clair Admin UI (clair-admin-ui)

[![License][license-image]][license-url]

Administration User Interface for the Clair project

This project was set up using the [Quasar CLI](https://quasar.dev/start/quasar-cli). For editing it is helpful to use VS Code in the configuration described in the [Quasar docs](https://quasar.dev/start/vs-code-configuration).

## Install the dependencies

```bash
yarn
(cd node_modules && patch -p0 < ../@reststate.patch)
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn run lint
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

[license-url]: https://github.com/clairberlin/clair-admin-ui/blob/master/LICENSE
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat
