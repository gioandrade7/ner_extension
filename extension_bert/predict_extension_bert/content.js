// Declare a dictionary to store extracted text with unique identifiers
var textDict = {};

// Keep track of a unique identifier for each text element
var extIdCount = 1;

function getText(body) {
  // Select all paragraph (p) elements
  let p = body.querySelectorAll("p");

  // Select all heading elements (h1-h6)
  let h1 = body.querySelectorAll("h1");
  let h2 = body.querySelectorAll("h2");
  let h3 = body.querySelectorAll("h3");
  let h4 = body.querySelectorAll("h4");
  let h5 = body.querySelectorAll("h5");
  let h6 = body.querySelectorAll("h6");

  // Process h1 elements
  if (h1) {
    h1.forEach((element) => {
      // Assign a unique identifier to the element
      element.setAttribute("data-ext-id", extIdCount);
      // Extract text content and store it in the dictionary with the identifier as key
      textDict[extIdCount] = element.innerText;
      // Increment the identifier for the next element
      extIdCount++;
    });
  }
  // Similar logic for processing h2, h3, h4, h5, and h6 elements
  if (h2) {
    h2.forEach((element) => {
      element.setAttribute("data-ext-id", extIdCount);
      textDict[extIdCount] = element.innerText;
      extIdCount++;
    });
  }
  if (h3) {
    h3.forEach((element) => {
      element.setAttribute("data-ext-id", extIdCount);
      textDict[extIdCount] = element.innerText;
      extIdCount++;
    });
  }
  if (h4) {
    h4.forEach((element) => {
      element.setAttribute("data-ext-id", extIdCount);
      textDict[extIdCount] = element.innerText;
      extIdCount++;
    });
  }
  if (h5) {
    h5.forEach((element) => {
      element.setAttribute("data-ext-id", extIdCount);
      textDict[extIdCount] = element.innerText;
      extIdCount++;
    });
  }
  if (h6) {
    h6.forEach((element) => {
      element.setAttribute("data-ext-id", extIdCount);
      textDict[extIdCount] = element.innerText;
      extIdCount++;
    });
  }
  // Process paragraph (p) elements
  if (p) {
    p.forEach((element) => {
      // Assign a unique identifier to the element
      element.setAttribute("data-ext-id", extIdCount);
      // Extract text content, trim whitespace, and store in the dictionary
      textDict[extIdCount] = element.textContent.trim();
      // Increment the identifier for the next element
      extIdCount++;
    });
  }
}

// Chrome extension listener for messages from the background script
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  // Get the document body element
  let body = document.body;
  // Check for message type "contentTrigger"
  if (request.type === "contentTrigger") {
    // Call the getText function to extract text from the body
    getText(body);

    // Send a message to the background script with extracted text and tab ID
    const response = await chrome.runtime.sendMessage({
      type: "predict",
      message: textDict,
      tabId: request.tabId,
    });
  }
  // Check for message type "replaceBody"
  else if (request.type === "replaceBody") {
    // Get the replacement objects from the message
    const new_objects = request.content;

    // Loop through each replacement object
    for (let i = 0; i < new_objects.length; i++) {
      // Find the element with the matching identifier
      let element = body.querySelector(`[data-ext-id="${new_objects[i].id}"]`);
      if (element != null) {
        // Replace the element's content with the new text
        element.innerHTML = new_objects[i].text;
      }
    }
    // Send a message back to the background script indicating completion
    const response = await chrome.runtime.sendMessage({
      type: "highlight",
      message: "highlight",
      tabId: request.tabId,
    });
  }
});
