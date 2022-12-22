//Twitch API
const tools = require('../tools/tools')

const twitchAPI = require('../twitch/api/api').createDefaultAPI();


const dotenv = require('dotenv')
dotenv.config()

const env = process.env;
const DB = require("../db/db");
const db = new DB(`${env.MONGODB_URI}/${tools.conf.database.stats_database}?retryWrites=true&w=majority`);


class twitchGatherer {

    async getChannel(channel) {
        const channelData = await twitchAPI.getUserByChannelName(channel)
        if (typeof channelData === 'undefined') return;
        await db.createChannel({
                channel_id: channelData.id,
                channel_name: channelData.login,
                channel_display_name: channelData.display_name,
                description: channelData.description,
                type: channelData.type,
                broadcaster_type: channelData.broadcaster_type,
                thumbnail_url: channelData.profile_image_url,
                offline_image_url: channelData.offline_image_url,
                view_count: channelData.view_count,
                created_at: channelData.created_at,
                priority: 0,
            }
        )
    }

    async getLiveInfo(channel) {
        const channelStats = await twitchAPI.getStreamByChannelName(channel);
        if (typeof channelStats === 'undefined') return;
        await db.createLiveInfo({
            stream_id: channelStats.id,
            title: channelStats.title,
            started_at: channelStats.started_at,
            language: channelStats.language,
            tag_ids: channelStats.tag_ids,
            tags: channelStats.tags,
            is_mature: channelStats.is_mature,

            viewer_count: channelStats.viewer_count,
            game_id: channelStats.game_id,
            type: channelStats.type,

            channel_id: channelStats.user_id,
            channel_display_name: channelStats.user_name,
            channel_name: channelStats.user_login,

            timestamp: new Date(),
        })
    }

}

module.exports = twitchGatherer;