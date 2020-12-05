const fs = require("fs");
let count = [];

module.exports = {
  getCount,
  updateUserDataBase
};

//the main function, intitializes the eventWatcher
 setInterval(function eventCheck() {
   count = eventWatcher();
   getCount();
 },
 10000); //rest for 1 minute

 function updateUserDataBase(users) {
     fs.writeFileSync("../database/users/users.json", JSON.stringify(users, null, 2));
 }

 function eventWatcher() {
   let users = JSON.parse(fs.readFileSync("../database/users/users.json"));
   const stockDatabase = JSON.parse(fs.readFileSync("../database/stocks/data.json"));
   let notifications = [];

   for(let user in users) {
     let eventInfo =
     {
       'user': `${users[user]['username']}`,
       'count': 0
     }
     for(let i = 0; i < users[user]['eventList'].length; i++) {
       if(users[user]['eventList'][i]["notify_num"] > 0) {
         if(users[user]['eventList'][i]['notified'] !== true &&
         users[user]['eventList'][i]["active"] === "Active" &&
         stockDatabase[users[user]['eventList'][i].symbol].percentage >=
         (users[user]['eventList'][i]['notify_num']))

         {
          console.log(`We should Notify: ${JSON.stringify(users[user]['username'])}, (POSITIVE)`); //temp

          //changes the event to notified = true and gives a message to the user
           users[user]['eventList'][i]['message'] = `Alert: ${users[user]['eventList'][i]['name']}, (${users[user]['eventList'][i]['symbol']}) price has increased by ${users[user]['eventList'][i]['notify_num']}% or greater.`;
           users[user]['eventList'][i]['notified'] = true;
           updateUserDataBase(users);
         }
       }

       else if(users[user]['eventList'][i]["notify_num"] < 0) {

         if(users[user]['eventList'][i] !== true &&
         users[user]['eventList'][i]["active"] === "Active" &&
         stockDatabase[users[user]['eventList'][i].symbol].percentage <=
         users[user]['eventList'][i]['notify_num'])
         {
           console.log(`We should Notify: ${JSON.stringify(users[user]['username'])}, (NEGATIVE)`); //temp

           //changes the event to notified = true and gives a message to the user
           users[user]['eventList'][i]['message'] = `Alert: ${users[user]['eventList'][i]['name']}, (${users[user]['eventList'][i]['symbol']}) price has decreased by ${users[user]['eventList'][i]['notify_num']}% or greater.`;
           users[user]['eventList'][i]['notified'] = true;
           updateUserDataBase(users);
         }
       }
     }

     notifications.push(eventInfo);

     //sets the count of how many notifications the user shall recieve
     for(let i = 0; i < users[user]['eventList'].length; i++) {
       if(users[user]['eventList'][i]["notified"] === true) {
        for (let j = 0; j < notifications.length; j++) {
          if (notifications[j].user === user){
            notifications[j]['count'] += 1;
            updateUserDataBase(users);

          }
        }
       }
     }

   }
   return notifications;
}

function getCount() {
  return count;
}
