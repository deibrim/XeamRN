export const createMessagesTable = (db, channel) => {
  const chatroomId = channel.split("/").join("");
  db.transaction((tx) => {
    tx.executeSql(
      `create table if not exists ${chatroomId} (id text, content text, key text, read integer, reply_msg text, reply_uid text, reply_username text, timestamp integer, uid text, username text);`
    );
  });
};
export const updateMessagesTable = (db, arrData, channel) => {
  const chatroomId = channel.split("/").join("");
  db.transaction((tx) => {
    tx.executeSql(
      `insert into ${chatroomId} (id, content, key, read, reply_msg, reply_uid, reply_username, timestamp, uid, username) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [...arrData],
      (__, success) => console.log(success),
      (__, error) => console.log(error)
    );
  });
};

export const dropMessagesTable = (db, channel) => {
  const chatroomId = channel.split("/").join("");
  db.transaction((tx) => {
    tx.executeSql(`drop table ${chatroomId};`);
  });
};
