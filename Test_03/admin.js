
// admin.js


function sectionActivation(section){
    const addDataSection = document.getElementById('addData');
    const modifyDataSection = document.getElementById('modifyData');
    const viewUserSection = document.getElementById('viewUser');

    const addDataLink = document.getElementById('addDataLink');
    const modifyDataLink = document.getElementById('modifyDataLink');
    const viewUserLink = document.getElementById('viewUserLink');
    
    if(section === 'addData'){
        addDataSection.style.display = 'block';
        modifyDataSection.style.display = 'none';
        viewUserSection.style.display = 'none';
        
        addDataLink.setAttribute('style','color : rgb(76,250,76); border-bottom : 4px solid rgb(76,250,76);');
        modifyDataLink.setAttribute('style','color:white;text-decoration:none;');
        viewUserLink.setAttribute('style','color:white;text-decoration:none;');
    }
    else if(section === 'modifyData'){
        addDataSection.style.display = 'none';
        modifyDataSection.style.display = 'block';
        viewUserSection.style.display = 'none';

        addDataLink.setAttribute('style','color:white;text-decoration:none;');
        modifyDataLink.setAttribute('style','color : rgb(76,250,76); border-bottom : 4px solid rgb(76,250,76);');
        viewUserLink.setAttribute('style','color:white;text-decoration:none;');
    }
    else if(section === 'viewUser'){
        addDataSection.style.display = 'none';
        modifyDataSection.style.display = 'none';
        viewUserSection.style.display = 'block';

        addDataLink.setAttribute('style','color:white;text-decoration:none;');
        modifyDataLink.setAttribute('style','color:white;text-decoration:none;');
        viewUserLink.setAttribute('style','color : rgb(76,250,76); border-bottom : 4px solid rgb(76,250,76);');

        userDataView();
    }
}

function addData() {
    // Retrieve data from the form
    const playerName = document.getElementById('playerName').value;
    const playerJersey = document.getElementById('playerJersey').value;
    const teamId = document.getElementById('teamId').value;
    const role = document.getElementById('role').value;
    const teamPosition = document.getElementById('teamPosition').value;
    const battingPosition = document.getElementById('battingPosition').value;
    const totalRuns = document.getElementById('totalRuns').value;
    const totalWickets = document.getElementById('totalWickets').value;
    const strikeRate = document.getElementById('strikeRate').value;
    const centuries = document.getElementById('centuries').value;
    const mostRunsInAMatch = document.getElementById('mostRunsInAMatch').value;
    const mostWicketsInAMatch = document.getElementById('mostWicketsInAMatch').value;

    if(playerName.length !=0 && playerJersey.length != 0){
        // Generate a unique player ID
        const playerId = generatePlayerId(playerName, teamId, playerJersey);
    
        // Check if the player with the same ID already exists
        const checkPlayerExistenceUrl = `/api/check-player-existence/${playerId}`;
    
        fetch(checkPlayerExistenceUrl)
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                    console.error('Player with the same ID already exists.');
                    // Handle the case where the player already exists (display a message, etc.)
                } else {
                    // Player doesn't exist, add data to the database
                    const addDataUrl = '/api/add-data';
    
                    fetch(addDataUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            playerId: playerId,
                            playerName: playerName,
                            playerJersey: playerJersey,
                            teamId: teamId,
                            role: role,
                            teamPosition: teamPosition,
                            battingPosition: battingPosition,
                            totalRuns: totalRuns,
                            totalWickets: totalWickets,
                            strikeRate: strikeRate,
                            centuries: centuries,
                            mostRunsInAMatch: mostRunsInAMatch,
                            mostWicketsInAMatch: mostWicketsInAMatch,
                        }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            console.log('Data added successfully:', data);
                            // Perform additional actions as needed
                        } else {
                            console.error('Error adding data:', data.error);
                            alert("Error adding data.");
                            // Handle errors, display messages, etc.
                        }
                    })
                    .catch(error => console.error('Error adding data:', error));
                }
            })
            .catch(error => console.error('Error checking player existence:', error));
    }
    else{
        alert("Player Name and Jersey NUmber Can't be Empty.");
    }
}



function modifyData(){
    const oldPlayerName = document.getElementById('oldPlayerName').value;
    const oldPlayerJersey = document.getElementById('oldPlayerJersey').value;
    const oldTeamId = document.getElementById('oldTeamId').value;

    if(oldPlayerName.length !=0 && oldPlayerJersey.length != 0){
        const oldPlayerId = generatePlayerId(oldPlayerName, oldTeamId, oldPlayerJersey);

        // Check if the player with the same ID already exists
        const checkPlayerExistenceUrl = `/api/check-player-existence/${oldPlayerId}`;
    
        fetch(checkPlayerExistenceUrl)
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                        // Retrieve data from the form
                        const playerName = document.getElementById('mod-playerName').value;
                        const playerJersey = document.getElementById('mod-playerJersey').value;
                        const teamId = document.getElementById('mod-teamId').value;
                        const role = document.getElementById('mod-role').value;
                        const teamPosition = document.getElementById('mod-teamPosition').value;
                        const battingPosition = document.getElementById('mod-battingPosition').value;
                        const totalRuns = document.getElementById('mod-totalRuns').value;
                        const totalWickets = document.getElementById('mod-totalWickets').value;
                        const strikeRate = document.getElementById('mod-strikeRate').value;
                        const centuries = document.getElementById('mod-centuries').value;
                        const mostRunsInAMatch = document.getElementById('mod-mostRunsInAMatch').value;
                        const mostWicketsInAMatch = document.getElementById('mod-mostWicketsInAMatch').value;

                        console.log(playerName,playerJersey);
                        if(playerName.length != 0 && playerJersey.length !=0){

                            const playerId =generatePlayerId(playerName,teamId,playerJersey);

                            const modifyDataUrl = `/api/modify-data/${oldPlayerId}`;

                            fetch(modifyDataUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    playerId: playerId,
                                    playerName: playerName,
                                    playerJersey: playerJersey,
                                    teamId: teamId,
                                    role: role,
                                    teamPosition: teamPosition,
                                    battingPosition: battingPosition,
                                    totalRuns: totalRuns,
                                    totalWickets: totalWickets,
                                    strikeRate: strikeRate,
                                    centuries: centuries,
                                    mostRunsInAMatch: mostRunsInAMatch,
                                    mostWicketsInAMatch: mostWicketsInAMatch,
                                }),
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    console.log('Data modified successfully:', data);
                                    alert('Data modified successfully:');
                                    // Perform additional actions as needed
                                } else {
                                    console.error('Error adding data:', data.error);
                                    alert('Error adding data:', data.error);
                                    // Handle errors, display messages, etc.
                                }
                            })
                            .catch(error => console.error('Error adding data:', error));

                        }else{
                            alert("New Player Name and Jersey Number Can't br Empty.");
                        }

                    // Handle the case where the player already exists (display a message, etc.)
                }
                else {
                    alert('Player Data Not Found.');
                }
            })
            .catch(error => console.error('Error checking player existence:', error));
    }else{
        alert("Old Player Name and Jersey Number Can't be Empty.");
    } 

}

function deleteData(){
    const PlayerName = document.getElementById('oldPlayerName').value;
    const PlayerJersey = document.getElementById('oldPlayerJersey').value;
    const TeamId = document.getElementById('oldTeamId').value;

    if(PlayerName.length !=0 && PlayerJersey.length != 0){
        const playerId = generatePlayerId(PlayerName, TeamId, PlayerJersey);

        // Check if the player with the same ID already exists
        const checkPlayerExistenceUrl = `/api/check-player-existence/${playerId}`;
    
        fetch(checkPlayerExistenceUrl)
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                        
                    const deletePlayerDataUrl = `/api/delete-Player-Data/${playerId}`;

                    fetch(deletePlayerDataUrl)
                    .then(response => response.json())
                    .then(data => {
                        if(data.success){
                            console.log("Player's Data deletion Success.");
                            alert("Player's Data deletion Success.");
                        }else{
                            console.log('Error deleting Data.');
                            alert("Error Deleting Player's Data.");
                        }
                    })
                    .catch(error => console.error("Error deleting player' data:", error));
                }
                else {
                    alert('Player Data Not Found.');
                }
            })
            .catch(error => console.error('Error checking player existence:', error));
    
    }else{
        alert("To Delete Data : Player Name and Jersey Number Can't be Empty.");
    }
}

function generatePlayerId(playerName, teamId, playerJersey) {
    // Implement your logic to generate a unique player ID based on the player's name, team name, and jersey number
    // For simplicity, this example concatenates initials and numbers
    return  teamId + playerName.substring(0, 2).toUpperCase() + playerJersey;
}
