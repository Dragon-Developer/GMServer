## GameMaker WebServer made with Node.js  
This is a multiplayer online game server that connects to a client made with GameMaker.  

## Commands  
Every client message contains a type attribute which is the command the server should execute.  
**create_room:**  Create a game room  
**join_room:**  Join a game room  
**ping:**  Get the game latency  
**player_state:**  Send player state (position, animation) to other players  
**search_room:**  Get a list of rooms  
You can add more commands by just adding a file inside ./commands/ folder.

## How to run
npm install  
npm start  

## Credits  
Developer: Dragon-Developer  
