# localtvads-website

## Project setup

```
npm install
```

### Copy config.js file in public folder

```js
window.endpoint = 'https://dev-api.localtvads.com/';
window.socketendpoint = 'https://dev-api.localtvads.com:9997/';
window.googleCredentials = {
    apiKey: '20k8iF8V4pJnjAwrhQqexEq2',
    clientId: '955842204870-l42aal4di5env4ud2t31m4ici46l70lf.apps.googleusercontent.com'
};
window.facebook = {
    appId: '639711399851969'
};
window.bucketendpoint = 'https://storage.googleapis.com/localtvads-dev-bucket/';
Stripe.setPublishableKey('pk_test_tvB0M3nfDwXeHv7heAxjEYTc');
window.slotduration = 175;
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### Commit Guidelines

Keep first keyword as one of the below `(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|chore|types|wip)`

example :

```angular2
fix(login): issue fixed related to login
```

```angular2
chore: updated the code in babel.config.js
```

```angular2
feat: new feature added for changing the user password
```

```angular2
docs: documentation updated for the project
```
