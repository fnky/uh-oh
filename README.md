#  uh-oh

**uh-oh** is an error handler for [Express](https://expressjs.com/) with a stylistic and useful interface for viewing application error traces.

![Preview of uh-oh's interface](https://user-images.githubusercontent.com/995050/28497800-8bc822d8-6f8f-11e7-9e34-3d67aa2163db.png)

## Features

- **Stack Traces** – Get a list of errors and where they happend.
- **Source Code Preview** – Get a quick summary of where errors occurred with indicators.
- **Context Overview** – See context of your application and the request body.
- **Open In Editor** – Quickly open source files from the browser with a click.

... and more to come.

## Install

Simply install it using [npm](https://www.npmjs.com/)

```
npm install --save uh-oh
```

or using [Yarn](https://yarnpkg.com/)

```
yarn add uh-oh
```

## Usage

```js
import uhOh from 'uh-oh'

// Register it after routes and middlewares, that you
// want uh-oh to handle.
app.use(uhOh(app))
```

> Note: It also registers a middleware to allow opening file URLs in your editor.

## API

#### `uhOh(app: express.Application[, options: Object]) -> Function`

Returns a middleware function, which catches errors passed by other middleware.

### Options

#### `stackTraceOptions: Object`

Options are passed in to [parsetrace](https://github.com/floatdrop/node-parsetrace).

#### `editorOptions: Object`

Additional options are passed in to [express-open-in-editor](https://github.com/lahmatiy/express-open-in-editor).

## Future Plans

Uh-oh is still in the works, and a few plans to improve it are under way:

- Support sourcemaps for compiled/minified source files.
- Syntax highlighting for source view.

## Contributing

You're welcome to create an [issue](issues) or submit a [pull request](pulls) if you either have a great addition or just found a bug.

## License

[MIT License](LICENSE)
