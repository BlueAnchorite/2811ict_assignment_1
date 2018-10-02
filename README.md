# Summary
This is a solution for Assignment 2 in 3813ICT - Web Programming, built upon the solution for Assignment 1 from Ryoma.


# Installation
## Node Server
Change directory to **server** and run **npm install**. Run server by running **node server.js** and the Node server will start listening on port 8080. Node server is set up to accept CORS from **0.0.0.0:8081**. 

## Angular App
Change directory to **chat-app** an drun **npm install**. You can run the Angular server by **ng serve**. As CORS is set up on the Node server, this will still allow you send data between the Angular chat app and the node server. **ng build** will create the distributable, compiled version of the Angular app. The Node server will already be preconfigured to run **dist/index.html**.

# Documentation
## Git
The project is broken into two main folders, chat-app contains the Angular project for the front-end which queries the server for data. The server project is contained in the server folder and serves data requests via the REST API.

The approach to version control was to make commits for each development task that was completed to the project, and to try and only commit one task per commit.  

## Data Structures
The project utilises objects and lists the most, as we can easily store javascript objects into MongoDB, and lists are a flexible container for storing these objects and iterating through them.

There are three main data objects within the project, these being lists of objects for the users, groups and channels. 

User objects store the username, password and permissions of a user.  
Group objects store the name of the group, who the usernames of the admins of the group are, along with all associated members.  
Channel objects store the channel name, the group the channel is associated with, and the members associated to the channel.  

## API
The REST API URI's are as follows:

- /api/login
  - Used to send an authentication request to the server for login purposes. Request contains the username and password. Returns false if username or password doesn't match. Returns an object match which contains the associated groups for the authenticated user.

- /api/groups
  - Similar to the login route, we send a request to authenticate and get all associated groups for the user. Request contains the username and password. Returns false if username or password doesn't match. Returns an object match which contains the associated groups for the authenticated user.

- /api/group/delete/:groupname
  - Used to delete a group from the server. Request contains the name of the group. Returns true once the server has found and deleted the entry and saved the new data.

- /api/group/create
  - Used to create a new group. Request contains the name for the new group. Returns false if the groupname is invalid, returns true once the server has created the new entry and saved the data.
  

## Angular
### Components
- Login
  - Used to display a login form to the user when entering the site and submit to the server for authentication. 
- Home
  - This component is used as the landing page once a user logs in. It contains the nav-bar and a column of groups the current user is associated with, while nesting the channels and chat components in other columns.  
- Channels
  - Used to display the list of channels in the selected group and to emit an event when the channel is changed.
- Chat 
  - Used to display the chat history from other connected clients and send messages to currently connected clients in the channel. 

### Services
- Group
  - Used to provide methods for sending requests related to groups from the front-end to the server. Imported into the home component.
- User
  - Used to provide methods for sending requests related to users from the front-end to the server. Imported into the login component.
- Socket
  - Used to provide methods for connecting sockets and sending information via these sockets from the front-end to the server. Imported into the chat component.

### Models
The angular front end contains two models for data. The first is the currently logged in user, the second is built for the currently logged in user from requests made to the server with the current user. The server than responds with all of the groups and the associated channels that the user has access to.
This model is then used until the next time the user logs back into the site where the model is built again.