import {createHaapiFetch} from "@curity/identityserver-haapi-web-driver";
import config from "./config";

const haapiFetch = createHaapiFetch({
    clientId: config.clientId,
    tokenEndpoint: config.tokenEndpoint,
})

export default haapiFetch
