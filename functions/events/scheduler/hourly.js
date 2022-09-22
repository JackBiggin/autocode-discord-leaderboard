// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const fs = require('fs');
const path = require('path');

// Grab our points values and limits from the /helpers/config.json file
let jsonFileData = fs.readFileSync(path.join(process.cwd(), 'helpers/config.json'));
let eventData = JSON.parse(jsonFileData);

// Grab the current userCache from KV
// This contains the IDs of all users who need updating in Airtable
let userCache = await lib.keyvalue.store['@0.1.16'].get({
  key: `${process.env.KV_PREFIX}_LB_USERCACHE`,
});

// If the userCache is empty, set it to an empty array
userCache == null || userCache == "" ? (userCache = []) : (userCache = userCache.split(','));

// Loop through the users in our userCache
// For each user, we'll update their Airtable value as required
let length = userCache.length // we do this to prevent loops being missed as we modify the array length
for (let i = 0; i < length; i++) {

  // Grab the current user's cacheData
  // This contains all their points for their various interactions since the last time this scheduler ran
  let cacheData = await lib.keyvalue.store['@0.1.16'].get({
    key: `${process.env.KV_PREFIX}_LB_${userCache[0]}_CACHEDATA`,
    defaultValue: {},
  });

  let earnedPoints = 0; // we'll calculate this in the next for loop

  // Calculate points that the user is owed
  for (const event in cacheData) {
    let validEventCount =
      cacheData[event] > eventData[event].limit
        ? eventData[event].limit
        : cacheData[event]; // this is set to the number of times the user has done this action since the last scheduler, or the maximum number of events counted (the limit value in config.json), whichever's lowest
    earnedPoints += eventData[event].points * validEventCount; // points in config.json multiplied by validEventCount
  }

  // Check to see if this user is already on our scoreboard (ie: in our Airtable)
  let airtableData = await lib.airtable.query['@1.0.0'].select({
    baseId: `${process.env.AIRTABLE_BASE_ID}`,
    table: 'Scores',
    where: [
      {
        'Discord ID__is': `${userCache[0]}`, // we use userCache[0] rather than userCache[i] throughout this for loop since we .shift() the cache array every loop
      },
    ],
    limit: {
      count: 1,
      offset: 0,
    },
  });

  // If the user isn't already on the scoreboard, then...
  if (airtableData.rows.length == 0) {
    // Grab the user's Discord username and discriminator to populate the leaderboard with
    let discordData = await lib.discord.users['@0.2.1'].retrieve({
      user_id: `${userCache[0]}`,
    });

    // Add the user to the leaderboard in Airtable
    await lib.airtable.query['@1.0.0'].insert({ // if you have a large community, you might want to refactor this to insert multiple users at once, especially if you run into API rate limits
      baseId: `${process.env.AIRTABLE_BASE_ID}`,
      table: `Scores`,
      fieldsets: [
        {
          'Discord ID': `${userCache[0]}`,
          'Discord Display Name': `${discordData.username}#${discordData.discriminator}`,
          Score: earnedPoints,
        },
      ],
      typecast: false,
    });

    // If the user is already on the scoreboard, then...
  } else {
    // Update the Airtable with the user's new score
    await lib.airtable.query['@1.0.0'].records.update({
      baseId: `${process.env.AIRTABLE_BASE_ID}`,
      table: 'Scores', // required
      id: `${airtableData.rows[0].id}`,
      fields: {
        Score: airtableData.rows[0].fields.Score + earnedPoints,
      },
    });
  }
  
  // Clear the owed points from the user's cacheData
  await lib.keyvalue.store['@0.1.16'].clear({
    key: `${process.env.KV_PREFIX}_LB_${userCache[0]}_CACHEDATA`
  });
  
  // Remove the user from the userCache as they're no longer potentially owed points
  userCache.shift() // remove the first value off the start of the array, ie: the current value
  await lib.keyvalue.store['@0.1.16'].set({
    key: `${process.env.KV_PREFIX}_LB_USERCACHE`,
    value: userCache.toString()
  });
}
