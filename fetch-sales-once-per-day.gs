// Function to fetch and process data with retry
function fetchAndProcessDataWithRetry() {
  var MAX_RETRIES = 3; // Maximum number of retry attempts
  var RETRY_DELAY_SECONDS = 10; // Delay in seconds before retrying
  var retryCount = 0;
  var success = false;

  while (!success && retryCount < MAX_RETRIES) {
    try {
      fetchDataFromBandcamp(); // Call your main function here
      success = true;
    } catch (e) {
      Logger.log('Error: ' + e.message);
      Logger.log('Retrying in ' + RETRY_DELAY_SECONDS + ' seconds...');
      Utilities.sleep(RETRY_DELAY_SECONDS * 1000); // Wait for the specified delay before retrying
      retryCount++;
    }
  }

  if (!success) {
    Logger.log('Max retries reached. Script failed.');
  }
}

// Function to fetch and process data
function fetchDataFromBandcamp() {
  // Bandcamp OAuth endpoint URL
  var oauthUrl = 'https://bandcamp.com/oauth_token';

  // Your client ID and client secret from Bandcamp
  var clientId = 'YOUR_CLIENT_ID';
  var clientSecret = 'YOUR_CLIENT_SECRET';

  // Request an initial access token
  var payload = {
    'grant_type': 'client_credentials',
    'client_id': clientId,
    'client_secret': clientSecret
  };

  var options = {
    'method': 'post',
    'payload': payload
  };

  var response = UrlFetchApp.fetch(oauthUrl, options);
  var responseData = JSON.parse(response.getContentText());

  if (responseData.access_token) {
    var accessToken = responseData.access_token;
    Logger.log('Access Token: ' + accessToken);

    // Call the function to get band IDs
    var bandIds = getBandIds(accessToken);

    // Check if band IDs were successfully obtained
    if (bandIds && bandIds.length > 0) {
      // Loop through each band ID
      for (var i = 0; i < bandIds.length; i++) {
        var labelId = bandIds[i];

        // Calculate the date range for yesterday
        var today = new Date();
        var yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        var formattedStartDate = Utilities.formatDate(yesterday, Session.getScriptTimeZone(), 'yyyy-MM-dd') + ' 00:00:00';
        var formattedEndDate = Utilities.formatDate(yesterday, Session.getScriptTimeZone(), 'yyyy-MM-dd') + ' 23:59:59';

        // Uncomment the lines below to fetch data for a specific date range
        // var startDate = new Date('YYYY-MM-DD'); // Replace YYYY-MM-DD with your start date
        // var endDate = new Date('YYYY-MM-DD'); // Replace YYYY-MM-DD with your end date
        // var formattedStartDate = Utilities.formatDate(startDate, Session.getScriptTimeZone(), 'yyyy-MM-dd') + ' 00:00:00';
        // var formattedEndDate = Utilities.formatDate(endDate, Session.getScriptTimeZone(), 'yyyy-MM-dd') + ' 23:59:59';

        // Set the Bandcamp Sales Report API endpoint URL
        var apiUrl = 'https://bandcamp.com/api/sales/2/sales_report';

        // Set the parameters for the API request
        var requestData = {
          'format': 'json',
          'start_time': formattedStartDate,
          'end_time': formattedEndDate,
          'band_id': labelId // Use the extracted label ID
        };

        // Set up headers with the access token
        var headers = {
          'Authorization': 'Bearer ' + accessToken
        };

        var options = {
          'method': 'post',
          'headers': headers,
          'contentType': 'application/json',
          'payload': JSON.stringify(requestData)
        };

        // Make a POST request to the Bandcamp Sales Report API
        var response = UrlFetchApp.fetch(apiUrl, options);
        var salesData = JSON.parse(response.getContentText());

        // Get your Google Sheet
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

        // Process and write the headers to the sheet
        var headers = [
          'Date', 'Paid To', 'Item Type', 'Item Name', 'Artist', 'Currency', 'Item Price',
          'Quantity', 'Discount Code', 'Sub Total', 'Seller Tax', 'Marketplace Tax',
          'Shipping', 'Ship From Country Name', 'Transaction Fee', 'Fee Type',
          'Item Total', 'Amount You Received', 'Bandcamp Transaction ID',
          'Paypal Transaction ID', 'Net Amount', 'Package', 'Option', 'Item URL',
          'Catalog Number', 'UPC', 'ISRC', 'Buyer Name', 'Buyer Email', 'Buyer Phone',
          'Buyer Note', 'Ship To Name', 'Ship To Street', 'Ship To Street 2', 'Ship To City',
          'Ship To State', 'Ship To ZIP', 'Ship To Country', 'Ship To Country Code',
          'Ship Date', 'Ship Notes', 'Country', 'Country Code', 'Region/State',
          'City', 'Referer', 'Referer URL', 'SKU'
        ];

        // Write the headers to the sheet
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

        // Process and append the sales data to the sheet
        if (salesData && Object.keys(salesData).length > 0) {
          var salesArray = [];

          // Extract and format the data as needed
          for (var saleId in salesData) {
            var sale = salesData[saleId];
            var rowData = [
              sale.date,
              sale.paid_to,
              sale.item_type,
              sale.item_name,
              sale.artist,
              sale.currency,
              sale.item_price,
              sale.quantity,
              sale.discount_code,
              sale.sub_total,
              sale.seller_tax,
              sale.marketplace_tax,
              sale.shipping,
              sale.ship_from_country_name,
              sale.transaction_fee,
              sale.fee_type,
              sale.item_total,
              sale.amount_you_received,
              sale.bandcamp_transaction_id,
              sale.paypal_transaction_id,
              sale.net_amount,
              sale.package,
              sale.option,
              sale.item_url,
              sale.catalog_number,
              sale.upc,
              sale.isrc,
              sale.buyer_name,
              sale.buyer_email,
              sale.buyer_phone,
              sale.buyer_note,
              sale.ship_to_name,
              sale.ship_to_street,
              sale.ship_to_street_2,
              sale.ship_to_city,
              sale.ship_to_state,
              sale.ship_to_zip,
              sale.ship_to_country,
              sale.ship_to_country_code,
              sale.ship_date,
              sale.ship_notes,
              sale.country,
              sale.country_code,
              sale.region_or_state,
              sale.city,
              sale.referer,
              sale.referer_url,
              sale.sku
            ];
            salesArray.push(rowData);

            // Log the sales data (uncomment this line when needed)
            // Logger.log('Sales Data: ' + JSON.stringify(sale));
          }

          // Append the sales data to the sheet, starting from the next available row
          var lastRow = sheet.getLastRow();
          if (lastRow > 0) {
            sheet.getRange(lastRow + 1, 1, salesArray.length, headers.length).setValues(salesArray);
          } else {
            // If there are no existing rows, start from the first row
            sheet.getRange(1, 1, salesArray.length, headers.length).setValues(salesArray);
          }
        } else {
          Logger.log('No sales data found for the specified date range for Band ID: ' + labelId);
        }
      }
    } else {
      Logger.log('No band IDs available.');
    }
  } else {
    Logger.log('Failed to obtain access token');
  }
}

// Function to get band IDs
function getBandIds(accessToken) {
  // Set the Bandcamp Account API endpoint URL for my_bands
  var accountApiUrl = 'https://bandcamp.com/api/account/1/my_bands';

  // Set up headers with the access token
  var headers = {
    'Authorization': 'Bearer ' + accessToken
  };

  var options = {
    'method': 'post', // Change this to POST
    'headers': headers
  };

  // Make a POST request to the my_bands endpoint
  var accountApiResponse = UrlFetchApp.fetch(accountApiUrl, options);

  // Log the entire response
  Logger.log('Account API Response: ' + accountApiResponse);

  var accountData = JSON.parse(accountApiResponse.getContentText());

  // Check if bands data is available
  if (accountData && accountData.bands) {
    // Initialize an array to store band IDs
    var bandIds = [];

    // Iterate through the list of bands and get their band IDs
    for (var i = 0; i < accountData.bands.length; i++) {
      var band = accountData.bands[i];
      if (band.band_id) {
        bandIds.push(band.band_id);
      }

      // Check if there are member bands
      if (band.member_bands && band.member_bands.length > 0) {
        for (var j = 0; j < band.member_bands.length; j++) {
          var memberBand = band.member_bands[j];
          if (memberBand.band_id) {
            bandIds.push(memberBand.band_id);
          }
        }
      }
    }

    // Log the band IDs
    Logger.log('Band IDs: ' + bandIds);

    return bandIds;
  } else {
    Logger.log('No bands data available');
    return [];
  }
}
// To the beat of the drum bang, to the beat of the drum bang bang
