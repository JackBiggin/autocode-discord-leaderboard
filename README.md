> ℹ️ This project is designed to be hosted on Autocode, and the setup instructions below are designed to be followed on the Autocode App page. Click the `Open in Autocode` button below to be taken to this project on Autocode's website.
>
> [<img src="https://open.autocode.com/static/images/open.svg?" width="192">](https://autocode.com/JacklynBiggin/apps/discord-leaderboard/)


# Discord Leaderboard - Powered by Airtable

![](/readme/gallery/gallery-2-min.png)

Everyone wants their Discord server to be as engaged as possible, but sometimes it's difficult to know how to encourage activity. This plug-and-play leaderboard app is designed to make it as easy as possible to add a scoreboard to your Discord server. By default, users earn points for sending messages, adding reactions and creating threads, although you can modify the project to award points for almost any action.

## Features
* A `/scoreboard` command (automatically setup when you install this app) which shows your top 10 members and links to a web-based leaderboard
* Leaderboard website showing your full rankings, which is automatically deployed when this app is installed
* Automatic points tracking - you don't have to do anything manually!
* Scoreboard automatically updates hourly


## FAQ
* **How many requests will this app use if I install it?**
  * This app is quite request intensive, as we use endpoints such as `message.create` (which runs every time anyone sends a message on your Discord server) to award users points. We recommend updating to a [paid Autocode plan](https://autocode.com/pricing) if you're planning to use this project on a large server.
* **Is this app suitable for large servers?**
  * In general, yes! This app is provided as a starting point, so you might want to add some optimisations if you have many members - such as modifying how often the scheduler runs, or adding pagination to the scoreboard website. However, these are quality of life changes and shouldn't strictly be neccesary.
* **Can I modify how many points a user gets for each action? Can I modify the cap of how many actions count per scheduler run?**
  * Yup! Just modify the values in `/helpers/config.json`.

## Setup
### You will need
* A free Airtable account
* A Discord server to install your bot onto
* Discord Developer Mode enabled on your account - [watch this video if you're unsure how to enable this](https://www.youtube.com/watch?v=FmeQte6S7D8)

### Setting up the Airtable template
1. Visit [this link](https://airtable.com/shrXbIAzhQrtVsRjG) and click `Copy base`.

![](/readme/images/airtable-1-min.png)

2. Select the workspace that you want to install the base into, then click `Add base`.

![](/readme/images/airtable-2-min.png)

3. Open the base that was just created from the template by clicking on it.

![](/readme/images/airtable-3-min.png)

4. We'll need the base's ID in the next part of this guide, so copy it down for safe keeping. The base ID is the characters between the first two slashes in the base's URL that begin with app. In the example below, the base ID is `appy6fyolcI1FoJMR`.

![](/readme/images/airtable-4-min.png)

Awesome - our Airtable template is all setup and ready to go! Now let's install our Autocode app.

### Setting up the Autocode project

1. Scroll up on this page and click the green `Install Free` button.

![](/readme/images/autocode-1-min.png)

2. Select the organization you'd like to install this app into, give your project a name, then click `Next`.

![](/readme/images/autocode-2-min.png)

3. For each account type (Airtable and Discord), click `Link` then `Link New Resource`. Then follow the instructions in the window that pops up.
    - You should ensure you link to the same Airtable account that you duplicated the base onto

![](/readme/images/autocode-3-min.png)

4. Once you've finished linking all the required resources, your page should look like the screenshot below. Once it does, click the `Continue` button.

![](/readme/images/autocode-4-min.png)

5. Nearly there! We now need to set some environment variables 
    - **KV Prefix** - we'll prefix all KV names with this value for internal purposes. This allows you to run multiple instances of this app on one Autocode account. If you're not sure what to set this to, and you've not already installed this app, use `LEADERBOARD`.
    - **Airtable Base ID** - the base ID, beginning with `app`, that you copied earlier in this tutorial.
    - **Discord Guild ID** - the ID of your Discord server. To find this, right click your server's icon with Developer Mode enabled and click `Copy ID`.

  Then click `Install App`.

![](/readme/images/autocode-5-min.png)

Awesome, your app is now installed! You should now be able to use `/scoreboard` on your Discord server!

### Modifying points values
The settings for this project are stored in `/helpers/config.json`. For each event type (`MESSAGESENT`, `REACTIONADDED` and `THREADCREATED`) there is a `points` and `limit` value.

The `points` value is the number of points a user gets each time they complete the action. For example, if `MESSAGESENT`'s points is set to 2, the user will get two points for each message they send.

The `limit` value is the maximum number of events of that type that counts towards earning points per scheduler run. In simpler terms, if the scheduler is set to run hourly and `MESSAGESENT`'s limit is set to 10, only the first ten messages every hour will earn points. Think of this as an anti-spam measure to avoid users being awarded for spammy behaviour.





You can also add your own events that earn points to this app. Simply copy the code inside `/functions/events/discord/message/create.js` into a new file, set that file's event trigger to be whatever you want to earn points, then replace `context.params.event.author.id` with whatever value contains the user's Discord ID. You should then replace `MESSAGESENT` with a unique identifier for this event, then add that event's settings (points and limit) to `/helpers/config.json`.







