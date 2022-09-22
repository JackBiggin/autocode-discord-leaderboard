// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.commands['@0.0.0'].create({
  "guild_id": `${process.env.DISCORD_GUILD_ID}`,
  "name": "scoreboard",
  "description": "View the top 10 users of the scoreboard",
  "options": []
});