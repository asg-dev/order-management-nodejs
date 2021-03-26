# order management app in nodejs

This is CRUD app built using nodejs + express + handlebars + mongodb. 

There are three personas.

* Admin 
  * Add, edit, and delete menu as well as items in a menu
  * See list of pending orders, and mark them as delivered
  * Manage users - add/remove billing clerks

* Billing Clerk
  * See list of pending orders, and mark them as delivered
  * Create orders for walk-in cusotmers

* Customer
  * See menu and add items to cart
  * See shopping cart summary and then place order
  * See order status, as well as a history of all their past orders


# Setup

## Requirements

* Node v12.0 or higher (Latest LTS: https://nodejs.org/en/)
* Mongo DB community edition (https://www.mongodb.com/try/download/community)

## Setup MongoDB

Download MongoDB and unzip the contents. Create a new folder next to it called mongobd-data (or any other name). This folder will contain all the data stored in the db

## Common Setup

Clone the repository and install the dependancies 


    git clone https://github.com/vaishnav-thirumoorthy/order-management-nodejs.git

    cd order-management-nodejs

    npm install


Open package.json. Under scripts, there is one defined which would run the db

    "db": "<path>/bin/mongod --dbpath=\"<data_folder_path>/mongodb-data\""

The first `<path>` is the path to the unzipped mongodb community edition folder. `<data_folder_path>` is the path to the folder that was created. If that foler was name anything other than `mongodb-data` rename it in `package.json` as well. Replace path with their respective path values

Open `db > mongoose.js`. The db connection URI will be set as `mongodb://127.0.0.1:27017/<db_name>`. Replace db name with any other name. This will be the name of the database that will be created in mongodb.

When the app is run for the first time, an administrator will be created automatically. Check `Utils > initialize.js` for the admin credentials.

Once db path and db name are set, open terminal and navigate to the project's root folder

    cd order-management-nodejs

Start mongodb first

    npm run db

Open another terminal and start the app

    npm run start
   
If the app should be opened in development mode (with hot relaod), use

    npm run dev
    
This will run the app with nodemon. If nodemon is not installed, install it globally using 

    npm install -g nodemon 
    
Once the app is started, mongodb connection will be established and log `MongoDB Connected` will be prited to the console.

The app will be accessible in `http://localhost:3000/`
