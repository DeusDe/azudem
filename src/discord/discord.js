const {
    REST,
    Routes,
    Client,
    ActivityType,
    Collection,
    GatewayIntentBits: {
        GuildMessages,
        Guilds,
        MessageContent
    }
} = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

const dotenv = require('dotenv');
dotenv.config()
const env = process.env;


const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


module.exports = class Bot {
    constructor(token, twitchAPI) {
        this.client = new Client({
            intents: [
                Guilds,
                GuildMessages,
                MessageContent,
            ],
        })

        this.rest = new REST({version: '9'}).setToken(token);
        this.twitchAPI = twitchAPI;
        this.client.commands = new Collection()
        this.commands = []

        this.client.login(token)

        this.#createCommands()

        this.#onceReady()

        this.#onInteractionCreate()

    }

    static createDefaultBot() {
        const TwitchAPI = require('../twitch/api/api')
        const twitchAPI = TwitchAPI.createDefaultAPI()

        return new this(env.DISCORD_TOKEN, twitchAPI)
    }

    #createCommands() {
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                this.client.commands.set(command.data.name, command);
                this.commands.push(command.data.toJSON());
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }

    #onceReady() {
        this.client.once('ready', async () => {
            console.log('DiscordBot is ready');

            this.client.user.setActivity('Commands', {
                type: ActivityType.Listening,
            });

            await this.#registerSlashCommands()
        })
    }

    #onInteractionCreate() {
        this.client.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;
            const command = this.client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.execute(interaction, {twitchAPI: this.twitchAPI});
            } catch (error) {
                if (error) console.error(error);
                await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
            }
        });
    }

    async #registerSlashCommands() {
        try {
            await this.rest.put(
                Routes.applicationCommands(this.client.user.id), {
                    body: this.commands
                },
            );
            console.log('Successfully registered application commands globally');

        } catch (error) {
            if (error) console.error(error);
        }
    }
}