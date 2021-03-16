# Overview
Hack the North organizer application backend coding challenge.

# How to run the code
Prerequisites: NodeJS and Postgres.
1. Clone the code and install all the packages (run "npm install").
2. Create a new Postgres database. You can also just use the default database: "postgres".
3. Create a .env file with the following keys:
   ```
   DATABASE="<database_name>"
   USERNAME="<username>"
   PASSWORD="<password>"
   HOST="<host>"
   ```
   An example file (.example_env) is provided.
4. Run "npm start".<br> 
   This will create tables in the database, make a http request to fetch the latest user data and insert into the tables, and start the server.
   The following message should be printed out:
   ```
   Connecting to postgres...
   Connection has been established successfully!
   Running migrations...
   All migrations have been executed!
   Running seeders...
   All seeders have been executed!
   listening on port 3000
   ```
   When "npm start" is executed the second time, no database operation will be performed as sequelize is aware that tables have alreay been created and data has already been inserted, so we can use "npm start" to restart the server anytime without worrying about duplicate database setup being performed.
   
# Tech stack 
* NodeJS/Express
* SequelizeJS (ORM)
* Postgres
* Other dependencies: request, umzug (to run sequelize cli commands programmatically), dotenv, cors

# Implementation details 
<strong> How is an incoming request handled? </strong> <br>
The request will be forwarded to the corresponding controller (app.js -> router -> controller). The controller is responsible for invoking services to process the request and returning a response. All the business logic is located in services/ so that the main logic of the app is decoupled from the http requests and responses. This makes the code more maintainable and testable.

<strong> Why did I choose to use Sequelize ORM instead of just writing SQL? </strong> <br>
The main reason is that Sequelize supports migrations and seeders. This makes setting up the database on a new machine very easy.
Sequelize guarantees that migrations (to construct database tables) and seeders (to insert default data) are only executed the first time the server starts.
This effectively prevents data from being inserted twice. And of course, Sequelize provides some awesome DAO methods which simplify DB operations (most of the time).

<strong> Why are skills stored in its own table? </strong> <br>
There is a many-to-many relationship between user and skill. According to the database normalization principles, 
it is a good practice to store skills in another table which is linked to the user table by a join table for storage optimization and maintainability, though having more tables would result in more table joins and slower processing sometimes. 

# Future improvements
1. Use joi to do more validation on requests and gives more detailed error messages for invalid requests. 
2. Write some test cases, as testability is important.
3. Some performance optimization ideas: 
   1. As most endpoints require joining the users table with the skills table, we can store the joined table as a view. This makes most of the queries faster as we can read from the view without performing the table join every time.
   2. As users do not gain, lose skills very often, we can consider adding the frequency column to the skills table and update it everytime we update the user's skills. This will make GET localhost:3000/skills/?min_frequency=5&max_frequency=10 faster as we don't need to run aggregation every time.

# API documentation
<strong> Get all users </strong> <br>
* GET http://localhost:3000/users <br>
* Description: return information for all users <br>
* Response: A list of user objects: <br> 
```
   {
      "users":
        [
          {
            "name":"Jenna Luna",
            "email":"jennaluna@veraq.com",
            "skills":[
                      {"name":"C","rating":7},
                      {"name":"Android","rating":9}
                      ...
                       ],
            "company":"Veraq",
            "phone":"+1 (949) 580-2608",
            "picture":"http://lorempixel.com/200/200/sports/0"
          },
          ...
        ]
  }
 ```
 
 <strong> Get a specific user </strong> <br>
 * GET http://localhost:3000/:userid <br>
 * Description: return all info for a specific user. Note that userid is a unique id (uuid4) to uniquely identify a user. 
 It is created when a user is inserted into the database. <br>
 * Response: if the user is found, return a user object: <br> 
 ```
 {
    "user":
        {
          "name":"Jenna Luna",
          "email":"jennaluna@veraq.com",
          "skills":[
                    {"name":"C","rating":7},
                    {"name":"Android","rating":9}
                    ...
                     ],
          "company":"Veraq",
          "phone":"+1 (949) 580-2608",
          "picture":"http://lorempixel.com/200/200/sports/0"
        }
  }
 ```
 if the userid is an invalid uuid:
 ```
 {
   "message":"Invalid id: a6b46a7e-7d4d-4770-b68b-474ee99b4b3"
 }
 ```
 
 if the user is not found:
 ```
 {
   "message":"Could not find a user with id: a6b46a7e-7d4d-4770-b68b-474ee99b4b34"
 }
 ```
<strong> Update a specific user </strong> <br>
* PUT http://localhost:3000/:userid <br>
* Description: update user info as specified in the payload and return the full user info after the update. Note that this endpoint can only update info of an existing user. You cannot use it to create a new user. 
Also note that you cannot add a skill that doesn't exist in the database (i.e. not one of "iOS", "Java", "Public Speaking", "Angular, "NodeJS", "C", "Android", "TS", "C++",
"Product Design", "Go", "HTML/CSS"). <br>
* Payload: user info that needs to be updated in json format. <br>
For example, this will update a user's phone number and skills. If "Go" exists for this user before, the rating of "Go" will be updated. 
Otherwise, "Go" will be added to the user's skills.
```
{
  "phone": "+1 (913) 504-2498"
  "skills": '[{"name":"Go","rating":10}]'
}
```
* Response: if the update is successful, return a user object:
```
 {
    "user":
        {
          "name":"Jenna Luna",
          "email":"jennaluna@veraq.com",
          "skills":[
                    {"name":"C","rating":7},
                    {"name":"Android","rating":9},
                    {"name":"Go","rating":10}
                    ...
                     ],
          "company":"Veraq",
          "phone":"+1 (913) 504-2498",
          "picture":"http://lorempixel.com/200/200/sports/0"
        }
  }
 ```
 if the skill is invalid (does not exist in the database):
 ```
 {
   "message" : "The skill: JavaScripy does not exist in our database."
  }
  ```
        
 <strong> Get skills </strong> <br>
 * GET localhost:3000/skills/?min_frequency=5&max_frequency=10
 * Description: return skills filtered by frequency if query parameters are supplied. Return all skills if no parameter is provided.
 * Response: if skills of the frequency range are found, return an array of skills:
 ```
 {
    {
      "skills":[
                {"name":"iOS","frequency":"207"},
                {"name":"Java","frequency":"197"},
                ...
                 ]
     }
 }
 ```
 if no skills of the frequency range is found:
 ```
 {
    "message":"No skill was found."
 }
 ```
 
