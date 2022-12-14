const axios = require('axios');
const {client} = require("tmi.js");

const base = 'https://api.twitch.tv/helix/';

const URI = {
    base,
    auth: 'https://id.twitch.tv/oauth2/token',
    streams: base.concat('streams'),
    channels: base.concat('channels'),
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const UNAUTHORIZED = 401;

const NEW_TOKEN_DELAY = 5000;


class API {
    constructor(clientID, clientSecret) {

        this.#setClientID(clientID)
        this.#setClientSecret(clientSecret)


        this.#setAuthBody()

        this.#getNewBasicToken()


    }

    #getClientID() {
        return this.clientID;
    }

    #setClientID(clientID) {
        this.clientID = clientID;
    }

    #getClientSecret() {
        return this.clientSecret;
    }

    #setClientSecret(clientSecret) {
        this.clientSecret = clientSecret;
    }

    #getAuthBody() {
        return this.authBody;
    }

    #setAuthBody() {
        this.authBody =
            'client_id=' +
            this.#getClientID() +
            '&client_secret=' +
            this.#getClientSecret() +
            '&grant_type=client_credentials'
    }

    #getAuthHeader() {
        return this.authHeader
    }

    #setAuthHeader() {
        this.authHeader = {
            'Client-Id': this.#getClientID(),
            Authorization: `Bearer ${this.accessToken}`,
        };
    }

    #setAccessToken(accessToken) {
        this.accessToken = accessToken;
    }

    #getAccessToken() {
        return this.accessToken;
    }

    #isCreatingNewToken() {
        return this.creatingNewToken;
    }

    #setCreatingNewToken(creatingNewToken) {
        this.creatingNewToken = creatingNewToken;
    }

    #getLastTokenCreation() {
        return this.lastTokenCreation;
    }

    #setLastTokenCreation(lastTokenCreation) {
        this.lastTokenCreation = lastTokenCreation;
    }

    #updateLastTokenCreation() {
        this.#setLastTokenCreation(this.#getCurrentDateValue());
    }

    #compareLastTokenCreation() {
        return this.#getCurrentDateValue() - this.#getLastTokenCreation() < NEW_TOKEN_DELAY;
    }

    #getCurrentDateValue() {
        return new Date().valueOf();
    }


    async #getNewBasicToken() {
        if (this.#isCreatingNewToken() || this.#compareLastTokenCreation()) return false;
        this.#setCreatingNewToken(true);
        this.#updateLastTokenCreation()


        let response;
        try {
            response = await axios.post(URI.auth, this.#getAuthBody());
        } catch (e) {
            console.log(e);
            return false;
        }

        this.#setAccessToken(response.data.access_token)

        this.#setAuthHeader();
        this.#setCreatingNewToken(false);
        return true;
    }

    #createQueryString(querys) {
        const keys = Object.keys(querys)
        if (keys.length === 0) return "";
        let first = true;
        let str = "";
        for (const element of keys) {
            const query = `${element}=${querys[element]}`
            let div = '&'
            if (first) {
                div = '?'
                first = false;
            }
            str = str.concat(`${div}${query}`);
        }
        return str;
    }

    async #authHeaderRequest(URI) {
        return await axios.get(URI, {headers: this.#getAuthHeader()})
    }

    async getStream(querys) {
        const queryStr = this.#createQueryString(querys);
        let response;
        try {
            response = await this.#authHeaderRequest(`${URI.streams}${queryStr}`)
        } catch (error) {

            if (typeof error.response === 'undefined') {
                return undefined;
            } else if (typeof error.response.data === 'undefined') {
                return undefined;
            } else if (error.response.data.status === UNAUTHORIZED) {
                const tokenGenerated = await this.#getNewBasicToken();
                await delay(100);
                if (!tokenGenerated) {
                    return await this.getStream(querys);
                }
            }
            return undefined;
        }

        if (typeof response === 'undefined') return undefined;

        return response.data.data[0];
    }

    async getStreamByName(channelName) {
        return await this.getStream({'user_login': channelName});
    }

    async getStreamByID(channelID) {
        return await this.getStream({'id': channelID});
    }
}

const api = new API('ozjxskqcv0gz8cw0g5a3q6tca9zv04', '8gg3e9sf754t1mq9ydmhum29vnarfa')
exports.API = api;


