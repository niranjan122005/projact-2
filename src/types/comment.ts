export interface Comment {
  id: string
  ticketId: string
  userId: string
  userName: string
  comment: string
  createdDate: string
  createdTime: string
}

export type CommentInput = Omit<Comment, 'id' | 'createdDate' | 'createdTime'>
