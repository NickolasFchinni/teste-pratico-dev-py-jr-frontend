type AuthResponse = {
  token: string;
  user_id: number;
  username: string;
};

export type LoginData = {
  username: string;
  password: string;
};