# lerna_monorepo
an amateur attempt at learning to architect monorepos with lerna and configure it to take advantage of hoisting, symlinking, caching and other optimizations offered by Nx. I was too LAZY to write a proper readMe but the commit messages are highly detailed and give a better sense of direction.

## package_a
it is configured just like the way a component library is configured, ie. with `lib` config to focus on exporting consumable js.

## package_b
it is configures as a normal vite react project that exports html, js and css to be served by a http server.
