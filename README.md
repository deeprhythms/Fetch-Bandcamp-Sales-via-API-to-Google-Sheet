# Fetch daily Bandcamp sales via API to Google Sheets
App Script to fetch Bandcamp Sales Data once a day via API to a Google Sheet

Useful!

**BRIEF'ISH INTRODUCTION TO WHAT IT DOES**

This script fetches yesterday's Bandcamp sales automatically via the Bandcamp API and appends those to the next empty row in a Google Sheet. 
If you'd like to start using it today, uncomment the lines in code to fetch data for a specific date range, add the data range and run the script. Once run, comment out the date range part and the script now fetches yesterday's sales as by default.

I advise you to first test the script by running it manually. 

DISCLAIMER: I am no coder. I used ChatGPT to write this script so the only guarantee for now is "it works on my Google Sheet(s)".

But let's get to it, the stuff below assumes you know your way around computers a little.

**HOW TO USE** 

1. Request for Bandcamp API access
* Easy to do here: https://bandcamp.com/contact?subj=API%20Access
* Once you get a confirmation email (might take a while as the access is granted manually), go to the Bandcamp API Access tab of your Settings page.
* Note down the four(?) digit client_id and the long client_secret hash provided by Bandcamp.
2. Set up Google Sheets:
* Create a new Google Sheet where you want to store the sales data. Give it a nice name.
3. Enable Google Apps Script:
* In your Google Sheet, go to Extensions > Apps Script.
* You'll be taken to the Google Apps Script editor.
* Name the project to something like 'Bandcamp Sales via API' or whatever
4. Copy the attached Google Apps Script:
* In the Google Apps Script editor, copy paste the script code to the editor window overwriting the default function myFunction stuff
* Copy the four digit client_id and the long client_secret hash provided by Bandcamp over YOUR_CLIENT_ID and YOUR_CLIENT_SECRRET

 // Your client ID and client secret from Bandcamp
var clientId = 'YOUR_CLIENT_ID';
var clientSecret = 'YOUR_CLIENT_SECRET';

* Save the project
* I've tried to comment the script so it's easy to follow, ie if you wish to modify the date range and whatnot.
5. Authorize and Run the Script:
* You need to authorize the script to access your Google Sheet and Bandcamp API when you first run it
* Optional: Uncomment the lines in code if you want to fetch data for a specific date range first and add the data range
* Run the script
* Optional: comment out the specific date range code
* 'IF you sold any tracks, releases or vinyl through Bandcamp yesterday, you should see data on the sheet - check that.
6. Set up Triggers:
* To run this script daily, you can set up a trigger. In the Apps Script editor, go to Triggers
* Click on the "+ Add Trigger" button and configure it to run fetchDataFromBandcamp function. Event Source: Time Driven, Select type: Day Timer, Time of day: 12pm to 1pm (my
* * setup). Save and you are good to go!

With this setup, your Google Sheet will be updated daily with the sales data from the Bandcamp API automatically. You can customize the script further based on your specific needs, such as data formatting and error handling. All help is MORE than welcome!
