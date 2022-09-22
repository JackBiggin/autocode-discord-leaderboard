const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const path = require('path');
const helper = require(path.join(process.cwd(), 'helpers/updateUserCache.js' ))

await helper.updateUserCache(context.params.event.author.id, "MESSAGESENT")