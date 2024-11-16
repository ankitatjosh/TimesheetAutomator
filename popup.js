document.getElementById('fillTimesheet').addEventListener('click', async () => {
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = '';

  const projectName = document.getElementById('projectName').value.trim();
  const fromDate = document.getElementById('fromDate').value;
  const toDate = document.getElementById('toDate').value;
  const duration = document.getElementById('duration').value;
  const isApplyforAll = document.getElementById('forAll').value == "true"? true: false;
  
  // Parse descriptions - split by newline and filter out empty lines
  const descriptionsText = document.getElementById('descriptions').value;
  const descriptions = descriptionsText
    .split('\n')
    // .map(line => line.trim())
    // .filter(line => line && /^\d+]\s*/.test(line)) 
    // .map(line => line.replace(/^\d+]\s*/, ''));

  // Validation
  if (!projectName) {
    errorDiv.textContent = 'Please enter a project name';
    return;
  }
  if (!fromDate || !toDate) {
    errorDiv.textContent = 'Please select both dates';
    return;
  }
  if (descriptions.length === 0) {
    errorDiv.textContent = 'Please enter at least one description';
    return;
  }

  const data = {
    projectName,
    fromDate,
    toDate,
    duration,
    descriptions,
    isApplyforAll
  };

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, {
    action: 'fillTimesheet',
    data
  });
});

document.getElementById('donate-btn').addEventListener('click', async () => {
  const getTimesheetForm = document.getElementById('timesheetForm');
  const showDonate = document.getElementById('showDonate');
 // getTimesheetForm.style.display = "none";
 debugger
 var elem = document.getElementById("donate-btn");
    if (elem.innerHTML=="Donate Now") elem.innerHTML = "BACK";
    else elem.innerHTML = "Donate Now";

  if (getTimesheetForm.style.display === "block") {
    getTimesheetForm.style.display = "none";
    document.getElementById('fillTimesheet').style.display = 'none';
    showDonate.style.display = "block";
  } else {
    document.getElementById('fillTimesheet').style.display = 'inline';
    getTimesheetForm.style.display = "block";
    showDonate.style.display = "none";
  }
});