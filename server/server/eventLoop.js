const fs = require("fs");
let count;

//the main function, intitializes the eventWatcher
 setInterval(function eventCheck() {
   console.log("Event Watcher:");
   count = eventWatcher();
   getCount();
 },
 5000); //rest for 30 seconds

 function updateUserDataBase() {
     fs.writeFileSync("../database/users/users.json", JSON.stringify(users, null, 2));
 }

 function eventWatcher() {
   let users = JSON.parse(fs.readFileSync("../database/users/users.json"));
   const stockDatabase = JSON.parse(fs.readFileSync("../database/stocks/data.json"));
   let notifications = [];

   for(user in users) {
     console.log(user)
     // console.log(users[user]);
     let eventInfo =
     {
       'user': `${users[user]['username']}`,
       'count': 0
     }


     for(let i = 0; i < users[user]['eventList'].length; i++) {

       let ticker = users[user]['eventList'][i]['symbol'];

       if(users[user]['eventList'][i]["notify_num"] > 0) {
         if(users[user]['eventList'][i] !== true &&
         users[user]['eventList'][i]["active"] === "Active" &&
         users[user]['eventList'][i]["quote"] >=
         parseFloat(stockDatabase[ticker]['quote']) * (1 + ((users[user]['eventList'][i]['notify_num']/100))))
         {
          console.log(`We should Notify: ${JSON.stringify(users[user]['username'])},`); //temp

          //changes the event to notified = true and gives a message to the user
           users[user]['eventList'][i]['message'] = `Alert: ${users[user]['eventList'][i]['name']},
            (${users[user]['eventList'][i]['symbol']}) price has increased by
            ${users[user]['eventList'][i]['notify_num']}% or greater.`;
           users[user]['eventList'][i]['notified'] = true;
         }
       }

       else if(users[user]['eventList'][i]["notify_num"] < 0) {

         if(users[user]['eventList'][i] !== true &&
         users[user]['eventList'][i]["active"] === "Active" &&
         users[user]['eventList'][i]["quote"] <=
         parseFloat(stockDatabase[ticker]['quote']) - (parseFloat(stockDatabase[ticker]['quote']) *
         (-1 * (users[user]['eventList'][i]['notify_num']/100))))
         {
           console.log(`We should Notify: ${JSON.stringify(users[user]['username'])},`); //temp

           //changes the event to notified = true and gives a message to the user
           users[user]['eventList'][i]['message'] = `Alert: ${users[user]['eventList'][i]['name']},
            (${users[user]['eventList'][i]['symbol']}) price has increased by
            ${users[user]['eventList'][i]['notify_num']}% or greater.`;
           users[user]['eventList'][i]['notified'] = true;
         }
       }


     }

     //sets the count of how many notifications the user shall recieve
     for(let i = 0; i < users[user]['eventList'].length; i++) {
       if(users[user]['eventList'][i]["notified"] === true) {
         notifications[i]['count']++;
       }
     }

     notifications.push(eventInfo);

   }
   return notifications;
}

function getCount() {
  // console.log(count)
  return count;
}
