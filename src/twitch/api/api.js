const axios = require('axios');
const {client} = require("tmi.js");

const dotenv = require('dotenv');
dotenv.config()
const env = process.env;

const base = 'https://api.twitch.tv/helix/';

const URI = {
    base,
    auth: 'https://id.twitch.tv/oauth2/token',
    streams: base.concat('streams'),
    users: base.concat('users'),
    videos: base.concat('videos'),
    usersFollow: base.concat('users/follows')
}
const REQUEST_LIMIT = 800;

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const UNAUTHORIZED = 401;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const NEW_TOKEN_DELAY = 5000;


class API {
    constructor(clientID, clientSecret) {

        this.currentRequests = 0;
        this.#setClientID(clientID)
        this.#setClientSecret(clientSecret)


        this.#setAuthBody()

        this.#refreshAuthToken()


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

    async #createAuthToken() {
        this.#updateLastTokenCreation()
        this.#setCreatingNewToken(true);

        const response = await axios.post(URI.auth, this.#getAuthBody());
        const {access_token} = response.data;
        this.#setAccessToken(access_token)
        this.#setAuthHeader();
        this.#setCreatingNewToken(false);
    }

    async #refreshAuthToken() {
        if (this.#isCreatingNewToken() || this.#compareLastTokenCreation()) return false;
        await this.#createAuthToken()
        return true;
    }

    #createQueryString(querys) {
        if (querys === null || typeof querys === 'undefined') return "";
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

    async #authHeaderRequestWrapper(queryStr, uri) {
        let response;
        try {
            response = await this.#authHeaderRequest(`${uri}${queryStr}`)
        } catch (error) {
            if (typeof error.response === 'undefined' || typeof error.response.data === 'undefined') {
                return undefined;
            }
            const statusCode = error.response.data.status;
            if (statusCode === UNAUTHORIZED) {

                if (error.response.data.message !== 'Invalid OAuth token') return undefined;

                const tokenGenerated = await this.#refreshAuthToken();
                await delay(100);
                if (!tokenGenerated) {
                    return await this.#authHeaderRequestWrapper(queryStr, uri)
                }
            } else if (statusCode === BAD_REQUEST) {
                console.log(error.response.data.message, `${uri}${queryStr}`)
            } else if (statusCode === NOT_FOUND) {
                console.log('SITE NOT FOUND')
            }
            return undefined;
        }

        if (typeof response === 'undefined') return undefined;

        return response.data.data;
    }

    async #callRequestWrapper(querys, uri) {
        let waitCount = 0;

        while (this.currentRequests >= REQUEST_LIMIT && waitCount < 5) {
            await delay(5_000)
            waitCount++
        }

        if (waitCount === 5) {
            console.log("TOO MANY REQUESTS PLEASE CHANGE THE REQUEST AMOUNT");
            return 'undefined'
        }

        this.currentRequests++;
        setTimeout(e => (this.currentRequests--), 1000);

        const queryStr = this.#createQueryString(querys);
        return await this.#authHeaderRequestWrapper(queryStr, uri);
    }

    async #callRequestWrapperSingle(querys, uri) {
        const response = await this.#callRequestWrapper(querys, uri);
        return response[0];
    }

    //Streams

    async getStream(querys) {
        return await this.#callRequestWrapper(querys, URI.streams)
    }

    async getStreamByChannelName(channelName) {
        const channels = await this.getStream({'user_login': channelName})
        return this.#return_singleElement(channels);
    }

    async getStreamByChannelID(channelID) {
        const channels = await this.getStream({'id': channelID});
        return this.#return_singleElement(channels);
    }

    #return_singleElement(arr) {
        if (typeof arr === "undefined" || arr === null) return undefined;
        else return arr[0]
    }

    async getUser(querys) {
        return await this.#callRequestWrapper(querys, URI.users);
    }

    async getUserByChannelName(channelName) {
        const users = await this.getUser({'login': channelName})
        return this.#return_singleElement(users);
    }

    async getUserByChannelID(channelID) {
        const users = await this.getUser({'id': channelID})
        return this.#return_singleElement(users);
    }

    // MULTIPLE RESPONSE

    async getVideo(querys) {
        return await this.#callRequestWrapper(querys, URI.videos)
    }

    async getVideoByChannelID(channelID) {
        return await this.getVideo({'user_id': channelID})
    }

    async getFollowList(querys) {
        return await this.#callRequestWrapper(querys, URI.usersFollow)
    }

    async getFollowListFromID(channelID) {
        return await this.getFollowList({'from_id': channelID})
    }

    async getFollowListToID(channelID) {
        return await this.getFollowList({'to_id': channelID})
    }

    async getBlocklist(querys) {
        const queryStr = this.#createQueryString(querys);
        return this.#authHeaderRequestWrapper(queryStr, URI.base.concat('users/follows'));
    }

    static createDefaultAPI() {
        return new this(env.TWITCH_CLIENT_ID, env.TWITCH_CLIENT_SECRET);
    }

}

module.exports = API


