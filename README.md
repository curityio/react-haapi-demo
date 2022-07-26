# HAAPI demo application with React

This is a demo application tha implements the Hypermedia Authentication API to log users in. The application is written
using the React framework.

## Running the demo

To run the demo app:

1. Install dependencies by running `npm i`
2. Set configuration settings in `src/config.js`, e.g. endpoints of the Curity Identity Server, client ID, etc.
3. Run the app with `npm start`. A browser will be opened navigating to `http://localhost:3000`.

## Running with the provided instance of the Curity Identity Server

The `/idsvr` folder contains scripts that let you start an instance of the Curity Identity Server preconfigured to work with this app.
You need Docker Desktop installed on your machine to run the scripts. To run the instance:

1. Copy a `license.json` file to the `/idsvr` folder that contains a valid license for the Curity Identity Server. You can obtain
   the license through Curity's [dev portal](https://developer.curity.io).
2. Start the server with `./idsvr/deploy.sh`
3. Start the demo app as described above.

Use the `./idsvr/teardown.sh` script to clear any containers created.

## Further Resources

Have a look at these resources to learn more about Curity and HAAPI:

- [The Curity Identity Server's documentation](https://curity.io/docs)
- [HAAPI documentation](https://curity.io/docs/haapi-web-sdk/latest/)
- [HAAPI overview](https://curity.io/resources/learn/api-driven-demo-client/)
- [Curity's resources](https://curity.io/resources/)

Don't hesitate to [contact us](https://curity.io/contact/) should you need any assistance with this demo. 
