# Vacation Rentals App

> Backend of FullStack JS App

## The Setup

This is a demo of a client site that I recently completed.  
Its purpose is to allow users the ability to reserve homes that the company owns.  
It has an admin section which allows for the addition of users (with or without admin privileges), homes, and housekeepers.  
When logging in, a regular user is directed to the first home that she is authorized for.  
If the user is an admin, the profile dropdown has a link that allows the user to access the admin area.  
If a housekeeper logs in, he is able to see what reservations have been made and also check off if the home has been cleaned.

The frontend is Vue/Nuxt.  
This is the Express/Node API that handles all of the DB CRUD operations and has backend route protection utilizing JWTs. The DB is Mongo.  
Both the front end and Node backend are deployed on Heroku.  
For front end session management it uses the Node generated JWTs and middleware to protect routes.  
For persistence during page refreshes, it users localStorage on the client side.  
Note :: Initial server response is SUPER SLOW, but then it's super quick from there.
Credentials:   
- ADMIN	demoAdmin	passWord123
- USER	demoUser	password123
- KEEPER	sunriverKeeper	passWord123


## Visit Demo
[Reservation System](https://res-demo-front.herokuapp.com/)
