# Clair Admin UI (clair-admin-ui)

The Clair Admin UI is part of the _Clair Platform_, a system to collect measurements from networked CO2-sensors for indoor air-quality monitoring. It is developed and run by the [Clair Berlin Initiative](https://clair-berlin.de), a non-profit, open-source initiative to help operators of public spaces lower the risk of SARS-CoV2-transmission amongst their patrons.

Technically speaking, Clair Admin UI is a Single-Page Web-Application (SPA) that is served by a webserver in he the [Clair Stack](https://github.com/ClairBerlin/clair-stack), the infrastructure-as-code implementation of the Clair Platform.

[![License][license-image]][license-url]

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
