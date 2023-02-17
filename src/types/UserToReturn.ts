export interface UserToReturn {
  email: string,
  username: string,
  password?: string,
  comments: string[],
  _id: string,
  createdAt: Date,
  updatedAt: Date,
}
