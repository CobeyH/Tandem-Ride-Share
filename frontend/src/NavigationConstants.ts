const LOGIN = "/login";
const PRODUCT_PAGE = "/";
const GROUP_NEW = `/group/new`;
const groupWithId = (id: string) => `/group/${id}`;
const groupWithIdJoin = (id: string) => `${groupWithId(id)}/join`;
const REGISTER = "/register";

export const NavConstants = {
  LOGIN,
  PRODUCT_PAGE,
  GROUP_NEW,
  groupWithId,
  groupWithIdJoin,
  REGISTER,
};
