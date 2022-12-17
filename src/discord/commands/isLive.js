const {SlashCommandBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ttv_live')
        .setDescription('Tells you if a twitch Channel is live')
        .addStringOption(option =>
            option.setName('channel')
                .setDescription('The Twitch Channel to check')
                .setRequired(true)),
    async execute(interaction, dependencies) {
        const channelname = interaction.options.getString('channel')
        const channel = await dependencies.twitchAPI.getStreamByChannelName(channelname);
        console.log(channel);
        let out;
        if (typeof channel === 'undefined') out = "false"
        else out = "true";
        await interaction.reply(out);
    },
};