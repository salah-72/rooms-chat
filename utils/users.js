const users = [];

export const joinUser = (id, username, room) => {
  const user = { id, username, room };
  users.push(user);
  return user;
};

export const getUser = (id) => {
  const user = users.find((e) => e.id === id);
  return user;
};

export const getRoomUsers = (room) => {
  return users.filter((e) => e.room === room);
};

export const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};
