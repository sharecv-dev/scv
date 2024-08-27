function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function checkQuota() {
  var emailQuotaRemain = MailApp.getRemainingDailyQuota();
  Logger.log("Số lượng email có thể gửi: " + emailQuotaRemain);
}

function thatCSV() {
  const query = 'title contains "Data Khách hàng " and mimeType contains "csv"'
  const files = DriveApp.searchFiles(query);
  const id = [];
  while (files.hasNext()) {
    const filesID = files.next().getId();
    id.push(filesID);
  }
  console.log(id)
  return id
}

function convertCSV() {
  const filesID = thatCSV();
  const data = [];
  for (i = 0; i < filesID.length; i++ ) {
    const file = DriveApp.getFileById(filesID[i]);
    const dataBlob = file.getBlob();
    const csvString = dataBlob.getDataAsString();
    const csvData = Utilities.parseCsv(csvString);
    data.push(csvData)
  }
  //console.log(data);
  const sheetData = data.flat();
  //console.log(sheetData)
  return sheetData;
}

function importCSVfromFile() {
  const data = convertCSV();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data Khách hàng');
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1, data.length, data[0].length).setValues(data); 
}

function getCustomers() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data Khách hàng');
  const data = sheet.getDataRange().getValues();
  const dataWithoutHeaders = data.slice(1);

  return dataWithoutHeaders.map(row => ({
    email: row[0]
  }));
}

function getApplicants() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data Ứng viên');
  const data = sheet.getDataRange().getValues();
  const dataWithoutHeaders = data.slice(1);
  
  return dataWithoutHeaders.map(row => ({
    email: row[0]
  }));
}

function getCollaborators() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data Cộng tác viên');
  const data = sheet.getDataRange().getValues();
  const dataWithoutHeaders = data.slice(1);

  return dataWithoutHeaders.map(row => ({
    email: row[0]
  }));
}

function addCustomer(email) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data Khách hàng");
  sheet.appendRow([email]);
}

function addApplicant(email) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data Ứng viên");
  sheet.appendRow([email]);
}

function addCollaborator(email) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data Cộng tác viên");
  sheet.appendRow([email]);
}

function updateCustomer(index, email) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data Khách hàng');
  const row = index + 1;
  sheet.getRange(row, 1, 1, 3).setValues([[email]]);
}

function updateApplicant(index, email) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data Ứng viên');
  const row = index + 1;
  sheet.getRange(row, 1, 1, 3).setValues([[email]]);
}

function updateCollaborator(index, email) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data Cộng tác viên');
  const row = index + 1; 
  sheet.getRange(row, 1, 1, 3).setValues([[email]]);
}

function deleteCustomer(index) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data Khách hàng');
  sheet.deleteRow(index + 2);
}

function deleteApplicant(index) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data Ứng viên');
  sheet.deleteRow(index + 2);
}

function deleteCollaborator(index) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data Cộng tác viên');
  sheet.deleteRow(index + 2);
}

function deleteAllData(type) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(type);
  if (sheet) {
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {  // Đảm bảo không xóa hàng tiêu đề
      sheet.deleteRows(2, lastRow - 1);
    }
  } else {
    Logger.log('Data ' + type + ' không tồn tại.');
  }
}

function sendEmails(subject, body, htmlBody, recipients) {
  recipients.forEach(email => {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body,
      htmlBody: `<html><body>${htmlBody}</body></html>`,
      contentType: 'text/html'
    });
  });
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var subject = data.subject;
  var body = data.body;
  var recipients = data.recipients;

  sendEmails(subject, body, body, recipients);
  
  return HtmlService.createHtmlOutput("Email đã được gửi thành công!");
}