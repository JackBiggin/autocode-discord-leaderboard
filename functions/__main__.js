// This file is the HTML page that the user is taken to when they click the
// link in that is shown when /scoreboard is used

const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

// Initialize variables so we can access them outside of the try/catch block
let airtableData;
let htmlTable = "";

// All of this takes place in a try/catch block
// If an error occurs, we return an error page and console.log() the error
// Errors are caused by missing get variables, invalid codes, etc.
try {
  
  // Check if the email/verification code combination in the URL is valid
  airtableData = await lib.airtable.query['@1.0.0'].records.find.formula({
    baseId: `${process.env.AIRTABLE_BASE_ID}`,
    table: `Scores`,
    sort: [
      {
        'field': `Score`,
        'direction': `desc`
      }
    ]
  });
  
  for (let i = 0; i < airtableData.length; i++) {
    htmlTable += `<tr><td>${i + 1}</td><td>${airtableData[i].fields['Discord Display Name']}</td><td>${airtableData[i].fields['Score']}</td>`
  }

// If there's an error, we console.log() the error then show the user an error page
} catch (e) {
  console.log(e);
  return {
    statusCode: 200,
    headers: {'Content-Type': 'text/html'},
    body: Buffer.from(`
    
    <!DOCTYPE html>
    <html>
      <head>
        <title>Discord Leaderboard</title>
      </head>
      <body>
        <h1>Oops!</h1>
        <p>An error occured while loading the leaderboard. If you're the owner of this leaderboard, check your Autocode logs to see what went wrong.
      </body>
    </html>
    
    `),
  };
}

// If we get to this point, everything worked!
// Return the successfully verified page
return {
  statusCode: 200,
  headers: {'Content-Type': 'text/html'},
  body: Buffer.from(`
  
  <!DOCTYPE html>
  <html>
    <head>
      <title>Discord Leaderboard</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
      <link rel="stylesheet" href="./styles.css">
    </head>
    <body>
      <div class="container">
        <h1>Discord Community Leaderboard</h1>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Member</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody>
            ${htmlTable}
          </tbody>
        </table>
        
      </div>
    </body>
  </html>

  `),
};
