export interface UserData {
  _id: string;
  email: string;
  password: string;
  fullName: string;
  role: string;
}

export interface ShopInput {
  title: string;
  owner: string;
  image: string;
}
