// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// Grab the scores from Airtable, sorted by score (descending)
let airtableData = await lib.airtable.query['@1.0.0'].records.find.formula({
  baseId: `${process.env.AIRTABLE_BASE_ID}`,
  table: `Scores`,
  sort: [
    {
      'field': `Score`,
      'direction': `desc`
    }
  ]
});

let fields = [] // we'll add to this in the for loop
let url = `https://${context.service.path[0]}.api.stdlib.com/${context.service.path[1]}@${context.service.environment}`

// Loop through the scoreboard and add each user (max 10) to the fields array
for (let i = 0; i < airtableData.length; i++) {
  let score = airtableData[i]
  console.log(score)
  let discordId 
  fields.push({
    "name": `${airtableData[i]['fields']['Discord Display Name']}`,
    "value": `${airtableData[i]['fields']['Score']} points`
  })
}

await lib.discord.interactions['@1.0.1'].responses.ephemeral.create({
  token: `${context.params.event.token}`,
  content: ``,
  response_type: 'CHANNEL_MESSAGE_WITH_SOURCE',
  embeds: [
    {
      "type": "rich",
      "title": `🌟 Scoreboard - Top 10 Members`,
      "description": `View the full scoreboard at ${url}`,
      "color": 0x4b7bec,
      "fields": fields,
      "url": `${url}`
    }
  ]
  
});