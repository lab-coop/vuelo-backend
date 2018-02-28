const config = require('config');
const { MongoClient } = require('mongodb');

const dbUrl = config.get('dbUrl');

module.exports = async () => {
  const db = await MongoClient.connect(dbUrl);

  return {
    Config: db.collection('config'),
    Users: db.collection('users'),
    Projects: db.collection('projects'),
    TimeEntries: db.collection('time_entries')
  };
};
