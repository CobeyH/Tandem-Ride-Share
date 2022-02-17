const LOGIN = "/login";
const HOME = "/";
const GROUP_NEW = `/group/new`;
const groupWithId = (id: string) => `/group/${id}`;
const groupWithIdJoin = (id: string) => `${groupWithId(id)}/join`;
const REGISTER = "/register";

export const NavConstants = {
  LOGIN,
  HOME,
  GROUP_NEW,
  groupWithId,
  groupWithIdJoin,
  REGISTER,
};
