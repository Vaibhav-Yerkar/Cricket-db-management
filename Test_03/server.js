// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const port = 5500;

app.use(express.static(__dirname));
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'vaibhav@123',
    database: 'DBMS'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Add your API endpoints and database logic here

// User registration endpoint
app.post('/api/register-user', (req, res) => {
    // const username=req.body.username
    const { username, usermail, password } = req.body;
 
    // Check if the user already exists
    const checkUserSql = 'SELECT * FROM user_table WHERE user_name = ? OR user_id = ?';

    db.query(checkUserSql, [username, usermail], (checkUserErr, checkUserResult) => {
        if (checkUserErr) {
            console.error('Error checking user existence:', checkUserErr);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        } else {
            if (checkUserResult.length > 0) {
                // User already exists
                res.json({ success: false, message: 'User already exists' });
            } else {
                // User doesn't exist, insert into the user_table
                const insertUserSql = 'INSERT INTO user_table (user_name, user_id, password) VALUES (?, ?, ?)';
                db.query(insertUserSql, [username, usermail, password], (insertUserErr, insertUserResult) => {
                    if (insertUserErr) {
                        console.error('Error registering user:', insertUserErr);
                        res.status(500).json({ success: false, error: 'Internal Server Error' });
                    } else {
                        // User registered successfully
                        res.json({ success: true, message: 'User registered successfully' });
                    }
                });
            }
        }
    });
});

// Admin login endpoint
app.post('/api/login-admin', (req, res) => {
    const { adminId, adminMail, password } = req.body;

    // Check admin credentials against the Admin_table in the database
    const sql = 'SELECT * FROM admin_table WHERE admin_id = ? AND admin_mail = ? AND password = ?';

    db.query(sql, [adminId, adminMail, password], (err, result) => {
        if (err) {
            console.error('Error checking admin credentials:', err);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        } else {
            if (result.length > 0) {
                // Admin credentials are valid
                res.json({ success: true });
            } else {
                // Admin credentials are invalid
                res.json({ success: false });
            }
        }
    });
});

// Check if a player with the given ID exists
app.get('/api/check-player-existence/:playerId', (req, res) => {
    const playerId = req.params.playerId;

    // Check if the player with the given ID exists in the database
    const sql = 'SELECT * FROM players WHERE player_id = ?';

    db.query(sql, [playerId], (err, result) => {
        if (err) {
            console.error('Error checking player existence:', err);
            res.status(500).json({ exists: false, error: 'Internal Server Error' });
        } else {
            const playerExists = result.length > 0;
            res.json({ exists: playerExists });
        }
    });
});

// Add data to the database
app.post('/api/add-data', (req, res) => {
    const { playerId, playerName, playerJersey, teamId, role, teamPosition, battingPosition, totalRuns, totalWickets, strikeRate, centuries, mostRunsInAMatch, mostWicketsInAMatch } = req.body;

    // Check if the player with the given ID already exists
    const checkPlayerExistenceSql = 'SELECT * FROM players WHERE player_id = ?';

    db.query(checkPlayerExistenceSql, [playerId], (checkPlayerExistenceErr, checkPlayerExistenceResult) => {
        if (checkPlayerExistenceErr) {
            console.error('Error checking player existence:', checkPlayerExistenceErr);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        } else {
            if (checkPlayerExistenceResult.length > 0) {
                // Player with the same ID already exists
                res.json({ success: false, message: 'Player with the same ID already exists' });
            } else {
                // Player doesn't exist, insert data into the database
                const addDataPlayers = `INSERT INTO players (player_id, player_name, jersey_number, team_id) VALUES (?, ?, ?, ?);`;
                const addDataStats = `INSERT INTO stats (player_id, role, team_position, batting_order) VALUES (?, ?, ?, ?);`;
                const addDataRecord = `INSERT INTO record (player_id, run_record, wicket_record, strike_rate,centuries_count,most_run_in_a_match,most_wicket_in_a_match) VALUES(?, ?, ?, ?, ?, ?, ?);`;

                const values = [[playerId, playerName, playerJersey, teamId],
                    [playerId, role, teamPosition, battingPosition],
                    [playerId, totalRuns, totalWickets, strikeRate, centuries, mostRunsInAMatch, mostWicketsInAMatch]]

                db.query(addDataPlayers, values[0], (addDataErr, addDataResult) => {
                    if (addDataErr) {
                        console.error('Error adding data:', addDataErr);
                        res.status(500).json({ success: false, error: 'Internal Server Error' });
                    } else {
                        db.query(addDataStats, values[1], (addDataErr, addDataResult) => {
                            if (addDataErr) {
                                console.error('Error adding data:', addDataErr);
                                res.status(500).json({ success: false, error: 'Internal Server Error' });
                            } else {
                                db.query(addDataRecord, values[2], (addDataErr, addDataResult) => {
                                    if (addDataErr) {
                                        console.error('Error adding data:', addDataErr);
                                        res.status(500).json({ success: false, error: 'Internal Server Error' });
                                    } else {
                                        // Data added successfully
                                        res.json({ success: true, message: 'Data added successfully' });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
});

// modify data from the database
app.post('/api/modify-data/:oldPlayerId',(req,res) =>{
    const oldPlayerId = req.params.oldPlayerId;

    const { playerId, playerName, playerJersey, teamId, role, teamPosition, battingPosition, totalRuns, totalWickets, strikeRate, centuries, mostRunsInAMatch, mostWicketsInAMatch } = req.body;

    const updateDatabaseSql = `UPDATE players JOIN stats ON players.player_id = stats.player_id JOIN record ON players.player_id = record.player_id set players.player_id = ?, players.player_name = ?, players.jersey_number = ?, players.team_id = ?, stats.player_id = ?, stats.role = ?, stats.team_position = ?, stats.batting_order = ?, record.player_id = ?, record.run_record = ?, record.wicket_record = ?, record.strike_rate = ?, record.centuries_count = ?, record.most_run_in_a_match = ?, record.most_wicket_in_a_match = ? where players.player_id = ?`;

    const values = [playerId, playerName, playerJersey, teamId,playerId, role, teamPosition, battingPosition,playerId, totalRuns, totalWickets, strikeRate, centuries, mostRunsInAMatch, mostWicketsInAMatch,oldPlayerId]

    db.query(updateDatabaseSql, values, (updateDataErr, updateDataResult) => {
        if (updateDataErr) {
            console.error('Error updating data:', updateDataErr);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }else {
                // Data added successfully
                res.json({ success: true, message: 'Data updated successfully' });
        }
    });
});

// Search based on input player name
app.get('/api/searchByPlayer', (req, res) => {
    const filterInput = req.query.filterInput;

    // Perform the search based on the filter type
    const searchPlayerSql = 'SELECT players.player_id,players.player_name,players.jersey_number,team.team_name,players.team_id,record.run_record,record.wicket_record,record.strike_rate,record.centuries_count,record.most_run_in_a_match,record.most_wicket_in_a_match,stats.role,stats.team_position,stats.batting_order FROM players JOIN team ON players.team_id = team.team_id JOIN stats ON players.player_id = stats.player_id JOIN record ON players.player_id = record.player_id WHERE player_name LIKE ?';
    const searchPlayerInput = `${filterInput}%`;

    db.query(searchPlayerSql, [searchPlayerInput], (searchPlayerErr, searchPlayerResult) => {
        if (searchPlayerErr) {
            console.error('Error searching for players:', searchPlayerErr);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        } else {
            res.json(searchPlayerResult);
        }
    });
});

// Search based on team name 
app.get('/api/searchByTeam', (req, res) => {
    const team_id = req.query.teamId;

    const searchTeamSql = 'SELECT players.player_id,players.player_name,players.jersey_number,players.team_id,team.team_name,record.run_record,record.wicket_record,record.strike_rate,record.centuries_count,record.most_run_in_a_match,record.most_wicket_in_a_match,stats.role,stats.team_position,stats.batting_order FROM players JOIN team ON players.team_id = team.team_id JOIN stats ON players.player_id = stats.player_id JOIN record ON players.player_id = record.player_id WHERE team.team_id = ?';
    
    const searchTeamInput = `${team_id}`;

    db.query(searchTeamSql, [searchTeamInput], (searchTeamErr, searchTeamResult) => {
        if (searchTeamErr) {
            console.error('Error searching for team:', searchTeamErr);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        } else {
            res.json(searchTeamResult);
        }
    });
});

// Delete Player's Data
app.get(`/api/delete-Player-Data/:playerId`,(req,res) =>{
    const playerId = req.params.playerId;

    const deleteQuery01 = 'DELETE FROM players WHERE player_id = ?';
    const deleteQuery02 = 'DELETE FROM stats WHERE player_id = ?';
    const deleteQuery03 = 'DELETE FROM record WHERE player_id = ?';

    db.query(deleteQuery03,[playerId],(deleteDataError, deleteDataResult) => {
        if (deleteDataError){
            console.error('Error deleting data:', deleteDataError);
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
        else{
            db.query(deleteQuery02,[playerId],(deleteDataError, deleteDataResult) =>{
                if (deleteDataError){
                    console.error('Error deleting data:', deleteDataError);
                    res.status(500).json({ success: false, error: 'Internal Server Error' });
                }
                else{
                    db.query(deleteQuery01,[playerId],(deleteDataError, deleteDataResult) =>{
                        if (deleteDataError){
                            console.error('Error deleting data:', deleteDataError);
                            res.status(500).json({ success: false, error: 'Internal Server Error' });
                        }
                        else{
                            // Data deleted successfully
                            res.json({ success: true, message: 'Data deleted successfully' });
                        }
                    });
                }
            });
        }
    });
});

app.get('/api/user-Data',(req,res)=>{
    const userDataQuery = `SELECT * FROM user_table`;
    db.query(userDataQuery,[],(userDataError,userDataResult)=>{
        if(userDataError){
            console.error('Error retrieving User Data.');
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
        else{
            res.json(userDataResult);
        }
    });
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
