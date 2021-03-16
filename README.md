# Overview
Hack the North organizer application backend coding challenge

# Tech stack 
* NodeJS/Express
* SequelizeJS (ORM)
* Postgres
* Other dependencies: request, umzug (to run sequelize cli commands programmatically), dotenv, cors

**Why did I choose to use Sequelize ORM instead of just writing SQL?** <br>
The main reason is that Sequelize supports migrations and seeders which makes setting up the database on a new machine very easy.
Sequelize guarantees that migrations (to construct database tables) and seeders (to insert default data) are only executed the first time the server starts.
This effectively prevents data from being inserted twice. And of course, Sequelize provides some awesome DAO methods simplifies DB operations (most of the time).

# API documentation
* <strong> Get all users </strong> <br>
GET http://localhost:3000/users <br>
Description: return information for all users <br>
Response: A list of user objects: <br> 
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
 
 * <strong> Get a specific user </strong> <br>
 GET http://localhost:3000/:userid <br>
 Description: return all info for a specific user. Note that userid is a unique id (uuid4) to uniquely identify a user. 
 It is created when a user is inserted into the database. <br>
 Response: if the user is found, return a user object: <br> 
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
* <strong> Update a specific user </strong> <br>
PUT http://localhost:3000/:userid <br>
Description: update user info as specified in the payload and return the full user info after the update. Note that this endpoint can only update info of an existing user. You cannot use it to create a new user. 
Also note that you cannot add a skill that doesn't exist in the database (i.e. not one of "iOS", "Java", "Public Speaking", "Angular, "NodeJS", "C", "Android", "TS", "C++",
"Product Design", "Go", "HTML/CSS"). <br>
Payload: user info that needs to be updated in json format. <br>
For example, this will update a user's phone number and skills. If "Go" exists for this user before, the rating of "Go" will be updated. 
Otherwise, "Go" will be added to the user's skills.
```
{
  "phone": "+1 (913) 504-2498"
  "skills": '[{"name":"Go","rating":10}]'
}
```
Response: if the update is successful, return a user object:
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
        
 * <strong> Get skills </strong> <br>
 GET localhost:3000/skills/?min_frequency=5&max_frequency=10
 Description: return skills filtered by frequency if query parameters are supplied. Return all skills if no parameter is provided.
 Response: if skills of the frequency range are found, return an array of skills:
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
 
