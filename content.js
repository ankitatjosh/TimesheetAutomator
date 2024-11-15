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

function parseDescriptions(descriptions, isApplyForAll, loopCount) {
    const parsedDescriptions = [];
    let descriptionIndex = 1;

    if (isApplyForAll && descriptions.length === 1) {
        for (let i = 0; i < loopCount; i++) {
            parsedDescriptions.push(descriptions[0].replace("1]", "").trim());
        }
        return parsedDescriptions;
    } else {
        descriptions.forEach(desc => {
            const regex = new RegExp(`^${descriptionIndex}\\]`);

            // if (regex.test(desc.trim())) {
                parsedDescriptions.push(desc.replace(regex, '').trim());
                descriptionIndex += 1;
            // }
        });
        return parsedDescriptions;
    }    
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fillTimesheet') {
        const { projectName, fromDate, toDate, duration, descriptions,isApplyforAll } = request.data;
        console.log(request.data,"request.data");

        const projectId = findProjectId(projectName);
        if (!projectId) {
            alert(`Project "${projectName}" not found. Please check the project name.`);
            return;
        }

        const dates = generateDateRange(fromDate, toDate);
        const parsedDescriptions = parseDescriptions(descriptions, isApplyforAll, dates.length);

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
