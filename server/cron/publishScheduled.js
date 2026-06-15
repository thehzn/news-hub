const cron=require('node-cron');
const News=require('../models/newsModel');

cron.schedule("* * * * *", async () => {
    

  console.log("⏰ Cron running at:", new Date().toLocaleTimeString());


   const result =await News.updateMany(
    { status: "scheduled", scheduledFor: { $lte: new Date() } },
    { $set: { status: "published" } }
  );
  console.log(`✅ Published ${result.modifiedCount} post(s)`);
});