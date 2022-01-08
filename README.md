# ProjectNg

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.8.

## Development server

Run `ng serve` or `npm run dev` command to run a local development server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Project structures

```
  /src                          -> source files
    /app                        -> Main app
      /components               -> UI components module
      /core                     -> core logic app module
        /mock                   -> mock data to test
        /models                 -> data models
        /services               -> app services (Auth, Location, Navigation, QS API, Storage)
      /directives               -> custom angular directives
      /icons                    -> customizable svg icons
      /pages                    -> app pages modules
      /utils                    -> tools if needed
    /assets                     -> assets folder
    /environments               -> angular environment source file
  custom-webpack.config.ts      -> Additional webpack configuration if needed
  .env.example                  -> Env file example
  ...                           -> The rest of the files are generated from angular CLI
```

## Environment files

Environment variables examples are inside `.env.example`, for local development you can create `.env` files.

## Library used

This project is using third party mapbox API to render a map with custom layout, the map rendering library used here is leafletJS, to get a mapbox token, please go to [Mapbox](https://account.mapbox.com/access-tokens/), you can register and get a free public default access token.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
