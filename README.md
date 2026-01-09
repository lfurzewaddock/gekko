# Gekko: WIP

Hard fork from [archived project: Gekko](https://github.com/askmike/gekko)

![Gordon Gekko](http://mikevanrossum.nl/static/gekko.jpg)

_The most valuable commodity I know of is information._

-Gordon Gekko

Gekko is a Bitcoin TA trading and backtesting platform that connects to popular Bitcoin exchanges. It is written in JavaScript and runs on [Node.js](http://nodejs.org).

_Use Gekko at your own risk._

## Documentation

See [the documentation website](https://gekko.wizb.it/docs/introduction/about_gekko.html).

## Installation & Usage

WIP: codebase monorepo organisation

### [pnpm package manager required](https://pnpm.io/installation)

```
pnpm i
pnpm approve-builds
```

### Run all tests (legacy mocha & current jest) in gekko app

```
pnpm --filter gekko test
```

### Start gekko app, exchange app, legacy API and legacy UI

```
pnpm --filter gekko start
```

See [the installing Gekko doc](https://gekko.wizb.it/docs/installation/installing_gekko.html).

## Dev notes

UI rebuild is WIP (stage 1: develop branch)

- stage 1: web UI: React clone of existing Vue SPA with new architecture, high test coverage and some UX improvements/fixes
- stage 2: web API: Fastify clone of existing Koa REST/Socket app with new architecture and high test coverage
- stage 3: web UI: Major changes to existing and new features, if any required
- stage 4: web API: changes to support web UI features, if any required

### React UI (WIP)

```
pnpm --filter gekko-app-ui dev
```

dev url: [http://localhost:3001/](http://localhost:3001/)

## Community & Support

Gekko has [a forum](https://forum.gekko.wizb.it/) that is the place for discussions on using Gekko, automated trading and exchanges. In case you rather want to chat in realtime about Gekko feel free to join the [Gekko Support Discord](https://discord.gg/26wMygt).

## Final

If Gekko helped you in any way, you can always leave me a tip at (BTC) 13r1jyivitShUiv9FJvjLH7Nh1ZZptumwW
