const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// This exports our helper function that we use in the files for each event,
// such as /functions/events/discord/message/create.js.
module.exports = {
  updateUserCache: async (userId, eventType) => {
    
    // Get the current cache for the user's points
    let cacheData = await lib.keyvalue.store['@0.1.16'].get({
      key: `${process.env.KV_PREFIX}_LB_${userId}_CACHEDATA`,
      defaultValue: {},
    });

    // If the user already has points in the cache for this event, increment by 1
    // If they don't, set to 1
    cacheData.hasOwnProperty(eventType)
      ? (cacheData[eventType] += 1)
      : (cacheData[eventType] = 1);

    // Update the user's cache with their new points value
    // NOTE: these points are not the same as the ones used on the leaderboard
    // They're used in the scheduler to work out if a user should gain points for that leaderboard
    await lib.keyvalue.store['@0.1.16'].set({
      key: `${process.env.KV_PREFIX}_LB_${userId}_CACHEDATA`,
      value: cacheData,
    });

    // Now we need to update our list of users with active pending points updates
    // Grab the user cache from KV
    let userCache = await lib.keyvalue.store['@0.1.16'].get({
      key: `${process.env.KV_PREFIX}_LB_USERCACHE`,
    });

    // Add the user ID of the current user if they're not already in the user cache
    userCache == null || userCache == ""  ? (userCache = []) : (userCache = userCache.split(','));
    if (!userCache.includes(`${userId}`)) {
      userCache.push(`${userId}`);
    }

    // Update user cache with new user if needed
    await lib.keyvalue.store['@0.1.16'].set({
      key: `${process.env.KV_PREFIX}_LB_USERCACHE`,
      value: userCache.toString(),
    });
  },
};
