# HAAPI demo application with React

This is a demo application that implements the Hypermedia Authentication API to log users in. The application is written
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
2. Copy `/idsvr/idsvr.env-template` to `/idsvr/idsvr.env`. You need to fill the proper configuration options only if you
   want to use the Google authenticator. See [the section below](#configuring-the-google-authenticator) for details.
3. Start the server with `./idsvr/deploy.sh`
4. Start the demo app as described above.

### Configuring the Google Authenticator

The provided instance of the Curity Identity Server has a Google authenticator configured. This is to show how the Hypermedia
Authentication API deals with authenticators that have to redirect the user to an external page. In order for the authenticator
to work properly, you need to configure it with the client ID and client secret that will be used to perform the OIDC flow
at Google. Have a look at [this documentation](https://cloud.google.com/docs/authentication/end-user) to learn how to
register an OAuth client in the Google console. Once you've obtained an ID and secret, paste them in the `/idsvr/idsvr.env` file.

Have a look at the [authenticator's documentation](https://curity.io/docs/idsvr/latest/authentication-service-admin-guide/authenticators/google.html)
to learn what other options can be configured for this method.

### Accept the Self-Signed Certificate

The instance of the Curity Identity Server uses self-signed SSL certificates. Before testing with the SPA, navigate to
[https://localhost:8443](https://localhost:8443) and let your browser trust the certificate. This can be done in a few ways
and depends on your Operating System and browser:
- Download the certificate and add it to your system keychain.
- Choose to trust the certificate by selecting an appropriate option from the toolbar.
- Accept the security exception when visiting the website.

### Testing the App

Navigate to `https://localhost:3000` and log in using either of the options:

- With the username authenticator, enter any username. It will be used as the subject in the resulting tokens.
- With the Username-password authenticator using the credentials `demouser / Password1`.

### Teardown

Use the `./idsvr/teardown.sh` script to clear any containers created.

## Further Resources

Have a look at these resources to learn more about Curity and HAAPI:

- [The Curity Identity Server's documentation](https://curity.io/docs)
- [HAAPI documentation](https://curity.io/docs/haapi-web-sdk/latest/)
- [HAAPI overview](https://curity.io/resources/learn/api-driven-demo-client/)
- [Curity's resources](https://curity.io/resources/)

Don't hesitate to [contact us](https://curity.io/contact/) should you need any assistance with this demo. 
