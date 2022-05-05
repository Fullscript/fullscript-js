[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Description

Fullscript.js is a JavaScript library that allows you to embed [Fullscript](https://fullscript.com/) features into your web application. In its current form, Fullscript.js cannot be used without the [Fullscript API](https://us.fullscript.com/docs/api/reference). Each embeddable feature requires attributes which can only be retrieved from the API.

## Installation

Fullscript-js can be included in your application via a NPM module or script tag.

### UMD Build

To use the **UMD build**, include it as a script tag in your page:

```
<script src="https://public-assets.fullscript.com/fullscript.js/1.0.5/fullscript-js.umd.min.js"></script>
```

### NPM Package

To use the NPM build, first you will need to add it to your dependencies:

```
npm install --save @fullscript/fullscript-js

// or with yarn

yarn add @fullscript/fullscript-js
```

Finally you can import the package with the following

```
import { Fullscript } from "@fullscript/fullscript-js";

// or with CommonJS

var Fullscript = require("@fullscript/fullscript-js").Fullscript;
```

### Usage

Now that you have fullscript-js included in your app, we can start using it!

**Step 1**

Fullscript.js requires a unique mount point for every feature. You need to create a DOM element for a feature to be embedded in.

```
<div style="width: 100vw; height: 100vh;" id="treatment-plan-container"></div>
```

> The feature is scaled to 100% of the size of its container. To control the size of the iframe, you can change the styles of aforementioned DOM element.

**Step 2**

Initialize a fullscript-js client with a `publicKey` and `env`:

```
var client = Fullscript({
    publicKey: "xxxxx",
    env: "us|ca|us-snd|ca-snd",
});
```

> More details on the publicKey, env, patientId, and secretToken values can be found [here-TODO](#)

**Step 3**

Once you have a client, you can initialize **features**:

```
var treatmentPlanFeature = client.create("treatmentPlan", {
  patient: {
    id: "xxxxx"
  },
  secretToken: "xxxxx",
});
```

**Step 4**

You can also listen for "events" that occur on a feature:

```
function handleTreatmentPlanActivated(data) {
  console.log("data", data);
  // you can use this as an opportunity to unmount the feature
  // you define the callback and whatever you want to do with the treatment plan created data
};

treatmentPlanFeature.on("treatmentPlan.activated", handleTreatmentPlanActivated);
// You can use the feature to subscribe to specific events by registering callbacks.
// In the example above, once the treatment plan is activated, data about the treatment plan will be passed to you via the callback
```

> To read more about data and what its format is, please view our [docs-TODO](#)

**Step 5 (optional)**

To stop listening to an event you can run the following:

```
treatmentPlanFeature.off("treatmentPlan.activated", handleTreatmentPlanActivated);
```

> This is completely optional as whenever you unmount a feature, it will un-register all event listeners associated with that feature. This off function is provided for convenience if you need to un-register while a feature is mounted.

**Step 6**

Now that everything it setup, you can mount the feature:

```
document.addEventListener("DOMContentLoaded", function() {
  treatmentPlanFeature.mount("treatment-plan-container");
});
```

> When mounting a feature, you need to ensure that the mount point has been rendered to the DOM. In the example above, we use the DOMContentLoaded to ensure that the mount point has been rendered.

**Step 7 (optional)**

To unmount a feature when you are done with it:

```
treatmentPlanFeature.unmount();
```

### Demo

In the project directory, we have two demo apps - React demo and UMD demo that you can experiment with.

#### create-react-app demo

The `create-react-app` demo app will use the npm package version of the fullscript-js library. Compared to the CDN version, the npm package version will contain typing information for your IDE and requires a bundler for packaging.

To get things started, please run the following from the root of the project:

1. `yarn link`
2. `yarn install`
3. `yarn build`

Next run the following from the react-demo directory `cd demo/react-demo`:

1. `yarn link @fullscript/fullscript-js`
2. `yarn install`

Next, you can run the React app from one of the options below:

- `yarn start` (from inside demo/react-demo)
- `yarn demo:npm` (from the root of the project)

#### UMD demo

The UMD version of the fullscript-js library is pre-packaged for consumption by browsers. This does not rely on a bundler such as webpack and can be included via a single script tag in any html file. The downside of this version is that you do no benefit from typing information.

To run the demo, you need simply run the following from the root of the project:

- `yarn install` (from inside demo/javascript-demo/server)
- `yarn demo:umd` (from the root of the project)

### Docs

For more detailed information, please refer to our [//TODO](#) where you can view the API references, endpoints, parameters, and example responses.

### Guides

For best practices and gotchas on how to use fullscript-js, please refer to our [//TODO](#).

### Versioning

// TODO

### Authors

Team Bifrost @ Fullscript including: Andrew Markle, Alfred Pararajasingam, Caileigh Simpson, Ryan O'Connor, Sean Graves, Yuhan Lee

### License

// TODO

### Who uses fullscript-js

//TODO: adding this later
