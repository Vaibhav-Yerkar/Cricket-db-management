// user.js

function switchContainer(triggerObject) {
    const resultContainer = document.getElementById('resultContainerBody');
    const teamContainer = document.getElementById('teamContainer');

    if (triggerObject === 'player') {
        resultContainer.style.display = 'none';
        teamContainer.style.display = 'grid';
    } else if (triggerObject === 'team') {
        resultContainer.style.display = 'grid';
        teamContainer.style.display = 'none';
    }
}

async function search() {
    const filterInput = document.getElementById('filterInput').value;
    if (filterInput.length !== 0) {
        switchContainer('team');

        try {
            const fetchByPlayer = `/api/searchByPlayer?filterInput=${filterInput}`;
            const response = await fetch(fetchByPlayer);
            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}

function displayResults(data) {
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = ''; // Clear previous results

    if (data.length === 0) {
        resultContainer.innerHTML = '<p style="margin-left: 15px;font-size:25px;">No results found.</p>';
    } else {
        const resultDiv = document.createElement('div');
        resultDiv.setAttribute('id', 'resultBody');

        data.forEach(item => {
            const playerDiv = document.createElement('div');
            playerDiv.setAttribute('class', 'playerInfo');
                const nameTag = document.createElement('h1');
                nameTag.setAttribute('class','playerName')
                nameTag.textContent = `${item.player_name}`;

                const playerTeamImg = document.createElement('img');
                playerTeamImg.setAttribute('src',`assets/Flags/${item.team_id}.png`)

                const InfoDiv = document.createElement('div');
                InfoDiv.setAttribute('class','playerRecord');
                    const heading = document.createElement('h3');
                    heading.setAttribute('class','recordHeading');
                    heading.textContent = 'Player Information : '
                    InfoDiv.appendChild(heading);
                    
                    const general = document.createElement('p');
                    general.setAttribute('class','playerGeneralRecordValue');
                    general.innerHTML = `<strong>Player Name : ${item.player_name}</strong><br><strong>Jersey Number : ${item.jersey_number}</strong><br>
                    <strong>Team : </strong> ${item.team_name}`;
                    InfoDiv.appendChild(general);
                    
                    const heading2 = document.createElement('h3');
                    heading2.setAttribute('class','recordHeading');
                    heading2.textContent = 'Stats and Record : ';
                    InfoDiv.appendChild(heading2);

                    const record = document.createElement('p');
                    record.setAttribute('class','playerRecordValue');
                    record.innerHTML = `<strong>Role : </strong>${item.role}<br>
                    <strong>Team Position : </strong>${item.team_position}<br>
                    <strong>Batting Position  : </strong>${item.batting_order}<br><br>
                    <strong>Career Total Run  : </strong>${item.run_record}<br>
                    <strong>Career Total Wicket : </strong>${item.wicket_record}<br>
                    <strong>Strike Rate : </strong>${item.strike_rate}<br>
                    <strong>No. of Centuries : </strong>${item.centuries_count}<br>
                    <strong>Most Run in a Match : </strong>${item.most_run_in_a_match}<br>
                    <strong>Most Wicket in a Match : </strong>${item.most_wicket_in_a_match}<br><br>`;
                    InfoDiv.appendChild(record);

                playerDiv.appendChild(nameTag);
                playerDiv.appendChild(playerTeamImg);
                playerDiv.appendChild(document.createElement('hr'));
                playerDiv.appendChild(InfoDiv);

            resultDiv.appendChild(playerDiv);
            console.log(item);
        });

        resultContainer.appendChild(resultDiv);
    }
}

async function teamTrigger(button) {
    const divId = button.id;
    const teamId = document.getElementById("teamId");
    teamId.setAttribute('value', `${divId}`);
    switchContainer('team');

    try {
        const fetchByTeam = `/api/searchByTeam?teamId=${divId}`;
        const response = await fetch(fetchByTeam);
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}