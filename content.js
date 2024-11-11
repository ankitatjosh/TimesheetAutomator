// function generateDateRange(startDate, endDate) {
//     const dates = [];
//     let currentDate = new Date(startDate);
//     const end = new Date(endDate);
    
//     while (currentDate <= end) {
//       if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // Skip weekends
//         dates.push(new Date(currentDate));
//       }
//       currentDate.setDate(currentDate.getDate() + 1);
//     }
    
//     return dates;
//   }
  
//   function findProjectId(projectName) {
//     // Get all project options from the first select
//     const projectSelect = document.querySelector('.active_project_ids');
//     if (!projectSelect) return null;
  
//     const options = Array.from(projectSelect.options);
    
//     // Find the option that contains the project name (case insensitive)
//     const projectOption = options.find(option => 
//       option.text.toLowerCase().includes(projectName.toLowerCase())
//     );
  
//     return projectOption ? projectOption.value : null;
//   }
  
//   function getRandomDescription(descriptions) {
//     return descriptions[Math.floor(Math.random() * descriptions.length)];
//   }
  
//   chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === 'fillTimesheet') {
//       const { projectName, fromDate, toDate, duration, descriptions } = request.data;
      
//       // Find project ID based on name
//       const projectId = findProjectId(projectName);
//       if (!projectId) {
//         alert(`Project "${projectName}" not found. Please check the project name.`);
//         return;
//       }
  
//       const dates = generateDateRange(fromDate, toDate);
      
//       // Click "Add new timesheet" button for each date (except first row which already exists)
//       const addButton = document.querySelector('.add-new-timesheet');
//       for (let i = 1; i < dates.length; i++) {
//         addButton.click();
//       }
      
//       // Wait for DOM to update
//       setTimeout(() => {
//         // Get all rows
//         const rows = document.querySelectorAll('#timesheets tr.fields');
        
//         dates.forEach((date, index) => {
//           const row = rows[index];
//           if (!row) return;
          
//           // Select project
//           const projectSelect = row.querySelector('.active_project_ids');
//           if (projectSelect) {
//             projectSelect.value = projectId;
//             projectSelect.dispatchEvent(new Event('change'));
//           }
          
//           // Set date
//           const dateInput = row.querySelector('input[type="date"]');
//           if (dateInput) {
//             dateInput.value = date.toISOString().split('T')[0];
//             dateInput.dispatchEvent(new Event('change'));
//           }
          
//           // Set duration
//           const durationSelect = row.querySelector('.duration_select');
//           if (durationSelect) {
//             durationSelect.value = duration;
//             durationSelect.dispatchEvent(new Event('change'));
//           }
          
//           // Set description
//           const descriptionTextarea = row.querySelector('textarea');
//           if (descriptionTextarea) {
//             descriptionTextarea.value = getRandomDescription(descriptions);
//             descriptionTextarea.dispatchEvent(new Event('change'));
//           }
//         });
//       }, 500);
//     }
//   });

function generateDateRange(startDate, endDate) { 
    const dates = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // Skip weekends
            dates.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

function findProjectId(projectName) {
    const projectSelect = document.querySelector('.active_project_ids');
    if (!projectSelect) return null;

    const options = Array.from(projectSelect.options);
    const projectOption = options.find(option => 
        option.text.toLowerCase().includes(projectName.toLowerCase())
    );

    return projectOption ? projectOption.value : null;
}

function parseDescriptions(descriptions) {
    const parsedDescriptions = [];
    let descriptionIndex = 1;
    debugger

    descriptions.forEach(desc => {
        const regex = new RegExp(`^${descriptionIndex}\\]`);
        if (regex.test(desc.trim())) {
            parsedDescriptions.push(desc.replace(regex, '').trim());
            descriptionIndex += 1;
        }
    });

    return parsedDescriptions;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fillTimesheet') {
        const { projectName, fromDate, toDate, duration, descriptions } = request.data;

        const projectId = findProjectId(projectName);
        if (!projectId) {
            alert(`Project "${projectName}" not found. Please check the project name.`);
            return;
        }

        const dates = generateDateRange(fromDate, toDate);
        const parsedDescriptions = parseDescriptions(descriptions);

        const addButton = document.querySelector('.add-new-timesheet');
        for (let i = 1; i < dates.length; i++) {
            addButton.click();
        }

        setTimeout(() => {
            const rows = document.querySelectorAll('#timesheets tr.fields');
            
            dates.forEach((date, index) => {
                const row = rows[index];
                if (!row) return;

                const projectSelect = row.querySelector('.active_project_ids');
                if (projectSelect) {
                    projectSelect.value = projectId;
                    projectSelect.dispatchEvent(new Event('change'));
                }

                const dateInput = row.querySelector('input[type="date"]');
                if (dateInput) {
                    dateInput.value = date.toISOString().split('T')[0];
                    dateInput.dispatchEvent(new Event('change'));
                }

                const durationSelect = row.querySelector('.duration_select');
                if (durationSelect) {
                    durationSelect.value = duration;
                    durationSelect.dispatchEvent(new Event('change'));
                }

                const descriptionTextarea = row.querySelector('textarea');
                if (descriptionTextarea && parsedDescriptions[index]) {
                    descriptionTextarea.value = parsedDescriptions[index];
                    descriptionTextarea.dispatchEvent(new Event('change'));
                }
            });
        }, 500);
    }
});
