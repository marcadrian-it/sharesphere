import DataLoader from "dataloader";
import { User } from "../entities/User";
import { In } from "typeorm";

export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findBy({ id: In(userIds as number[]) });
    const userIdToUser: Record<number, User> = {};
    users.forEach((u) => {
      userIdToUser[u.id] = u;
    });

    const sortedUsers = userIds.map((userId) => userIdToUser[userId]);
    // console.log("userIds: ", userIds);
    // console.log("map", userIdToUser);
    // console.log("sortedUsers: ", sortedUsers);

    return sortedUsers;
  });
