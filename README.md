# Chirper - basically Twitter
## Authors
  ILAGAN, Vincent B.
## Node modules used:
  * bcrypt  </br>
  * connect-mongo </br>
  * dotenv </br>
  * express-handlebars </br>
  * express-session </br>
  * express-validation </br>
  * express </br>
  * mongodb </br>
  * mongoose </br>
 
 ## Prerequisites
This website is currently deployed to Heroku found here: [Chirper](https://chirper-ph.herokuapp.com/ "Chirper"), but one thing to note is that ```url``` for the database in this repository is pointing towards the database hosted online for the Heroku app. So thing to keep in mind is to have the local files point to your local MongoDB.

1. Download this project content to your machine or create a Clone by running ```https://github.com/DLSU-CCAPDEV/2021T2-G26.git``` with any GitHub-supported platform <br>
2. Type ```npm install``` to install the necessary packages
3. Navigate to ```db.js``` in the ```models``` folder and replace the ```url``` value to ```mongodb://localhost:27017/chirperDB``` <br> 
4. The sample users, posts, and comments are found in a file named data.js that can be found in the Data folder. The website is technically useless without these data, obviously, so the first step shall be to inject the data by navigating to the Data folder and running the command ```node data.js```, making sure the data has been injected in MongoDB Compass, and terminating the command line (IDK how to make the script terminate itself). <br>

The data is now injected and the website is ready to run locally. 

## Running the website locally

Type ```node index.js``` from the root directory and type http://localhost:3000/ on your browser when you see that it has connected to your database. You will find yourself in the landing page. From there on, you can either login to the existing users or make an account by Signing up. 

## Website Features

Account Regristration </br>
Login </br>
Logout </br>
View account details </br>
Edit account details </br>
Delete account </br>
View a user profile </br>
Post </br>
View a post </br>
Edit a post </br>
Delete a post </br>
Comment </br>
View a comment </br>
Edit a comment </br>
Delete a comment </br>
Follow/Unfollow </br>
Like </br>
Search </br>

## Other libraries
* Bootstrap 5
* JQUERY
* 'Nonito' from Google Fonts
* Font Awesome
