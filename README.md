# Fullscript Embed Documentation

Please visit [the Fullscript Embed docs](https://fullscript.dev/docs/how-to-guides/fullscript-embed/what-is-fullscript-embed) to get started.

## Demo

In the project directory, we have two demo apps - React demo and UMD demo that you can experiment with.

### create-react-app demo

The `create-react-app` demo app will use the npm package version of the Fullscript Embed library. Compared to the CDN version, the npm package version will contain typing information for your IDE and requires a bundler for packaging.

To get things started, please run the following from the root of the project:

1. `yarn link`
2. `yarn install`
3. `yarn build`

Next run the following from the react-demo directory `cd demo/react-demo`:

1. `yarn link @fullscript/fullscript-js`
2. `yarn install`

Next you can run the React app using one of the options below:

- `yarn start` (from inside demo/react-demo)
- `yarn demo:npm` (from the root of the project)

### UMD demo

The UMD version of the Fullscript Embed library is pre-packaged for consumption by browsers. This does not rely on a bundler such as webpack and can be included via a single script tag in any html file. The downside of this version is that you do no benefit from typing information.

To run the demo, you need simply run the following from the root of the project:

- `yarn install` (from inside demo/javascript-demo/server)
- `yarn demo:umd` (from the root of the project)
