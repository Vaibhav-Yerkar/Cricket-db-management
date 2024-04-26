### Cricket-db-management

## Initial setup

1. first install nodeJS and run this command 
    - npm install

2. In server.js file for MySQL connection replace the [ user, password, database] as per your sql database.

3. For MySQL datatabase setup :
    1. create 6 tables namely exactly like this
        - admin_table
        - user_table
        - players
        - record
        - stats
        - team
    2. admin_table :
        1. Three Fields : 
            - admin_id (varchar(10)), 
            - admin_mail (varchar(60)), 
            - password (varchar(20)).
        2. This table will be predefined, i.e, entries cant be made through this program and this shall be used while admin login credentials for user validation.
    3. user_table :
        1. Three Fields : 
            - user_name (varchar(25)), 
            - user_id (varchar(60)), 
            - password (varchar(20)).
        2. This table will store new user entry on user login, NOTE : The code for user login credentials is not implemented, i.e, the program only store data into table every time a user login with new credential but does not cross verify for user validation.
    4. players :
        1. Four Fields :  
            - player_id (varchar(20), Primary_key), 
            - player_name (varchar(40)), 
            - jersey_number (int), 
            - team_id (varchar(20)).
        2. This table stores player's general data, player_id is a primary key and will be auto_generated by program while making record entries through the program.
        3. The structure of player_id is [team_id + first two letters of players_name + jersey no.]
    5. record :
        1. Seven Fields : 
            - player_id (varchar(20), Primary_key), 
            - run_record (int), 
            - wicket_record (int), 
            - strike_rate (float), 
            - centuries_count (int), 
            - most_run_in_a_match (int), 
            - most_wicket_in_a_match (int).
        2. This table store player's career's record
    6. stats :
        1. Four Fields :
            - player_id (varchar(20), Primary_key),
            - role enum('batsman','bowler','all-rounder'),
            - team_position enum('playing-11','Extra'),
            - batting_order enum('top-order','middle-order','tail-ender').
        2. This table store player's within team position and kind of stats.
    7. team :
        1. Two Fields :
            - team_id (varchar(10), Primary key),
            - team_name (varchar(15)).
        2. This table is predefined and is used to fetch team_id based on the the team_name of the players.
        3. Records in the team table :
            - +------------------------+
            - | team_id | team_name    |
            - +------------------------+
            - | AFG     | Afghanistan  |
            - | AUS     | Australia    |
            - | BAN     | Bangladesh   |
            - | ENG     | England      |
            - | IND     | India        |
            - | NED     | Netherlands  |
            - | NZ      | New Zeland   |
            - | PAK     | Pakistan     |
            - | SA      | South Africa |
            - | SL      | Sri Lanka    |
            - +------------------------+

## Working : 

1. To run the program run the server.js file which will initialise the express Js server.

2. Then go to the browser and enter localhost:5500 to load the page.

- On loading the first page to load is index.html that is a login page, that consist of two forms, one for user login (loads user.html) and another for admin login (loads admin.html).
    - user.html : It visually represent the sql data;
        - operations : 
            1. a search bar to search for players based on their name.
            2. team flags ; onclick loads the data of all players belonging to that team.
    - admin.html : It can be used to modify database;
        - operations :
            1. Add data about a new player. [cross verify for existance of duplicate record based on generated player_id]
            2. Delete data or modify data . [ takes input, player name, team and jersey no. to generate player_id and then admin can delete the record for that player or modify the record of that player]
            3. View User : To be implemented;

- [ When Fetching or Inserting the data into the tables the program use sql's "JOIN" method to perform operation on multiple tables together. The player_id is used as a common field for the union.]

