export type User = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
};

export type UserInfoFromServer = {
  message: string;
  user: User;
  access_token: string;
  refresh_token: string;
};
 