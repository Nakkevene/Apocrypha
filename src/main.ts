// @ts-ignore
import { Client, Events, GatewayIntentBits } from "discord.js";
// @ts-ignore
import inquirer from "inquirer";
// @ts-ignore
import chalk from "chalk";
import fs from "node:fs";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const storage = {
  serverid: "",
  token: "",
  tag: "",
};

storage.token = JSON.parse(
  fs.readFileSync("config.json").toString()
).apocrypha.token;

client.once(Events.ClientReady, () => {
  menu();
});

client.login(storage.token);

const menu = async () => {
  let servers: string[] = [];
  let username: string = "";

  storage.tag = client.user.tag;

  //* Get servers
  await client.guilds.cache.forEach((guild: any) => {
    servers.push(guild.name);
  });

  inquirer
    .prompt([
      {
        type: "list",
        name: "server",
        message: storage.tag,
        choices: servers,
      },
    ])
    .then(async (answers: any) => {
      //* Compare server name and id and add to storage
      await client.guilds.cache.forEach((guild: any) => {
        if (guild.name == answers.server) storage.serverid = guild.id;
      });

      //* Get channels
      await client.channels.cache.forEach((channel: any) => {
        if (channel.guild.id == storage.serverid) {
          //* Delete
          console.log(
            chalk.magenta(
              `[Apocrypha] Attempting to delete channel ${channel.name}@${channel.guild.name}`
            )
          );
          client.channels.cache.get(channel.id).delete();
        }
      });

      client.destroy();
    });
};
