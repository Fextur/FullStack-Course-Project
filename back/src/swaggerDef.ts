/**
 * @swagger
 * components:
 *   schemas:
 *     returnedUser:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - username
 *       properties:
 *         id:
 *           type: string
 *           description: The unique ID of the user
 *         email:
 *           type: string
 *           description: The user's email address
 *         username:
 *           type: string
 *           description: The user's display name
 *         image:
 *           type: string
 *           nullable: true
 *           description: URL of the user's profile image (optional)
 *       example:
 *         id: "1"
 *         email: "bob@gmail.com"
 *         username: "bob cohen"
 *         image: "http://localhost:3000/bob.png"
 * 
 *     returnedComment:
 *       type: object
 *       required:
 *         - id
 *         - content
 *         - user
 *       properties:
 *         id:
 *           type: string
 *           description: The unique ID of the comment
 *         content:
 *           type: string
 *           description: The content of the comment
 *         user:
 *           $ref: '#/components/schemas/returnedUser'
 *       example:
 *         id: "comment123"
 *         content: "This is a great post!"
 *         user:
 *           id: "user123"
 *           email: "bob@gmail.com"
 *           username: "bob123"
 *           image: "http://localhost:3000/avatar.png"
 * 
 *     returnedChatMessage:
 *       type: object
 *       required:
 *         - id
 *         - message
 *         - receiverId
 *         - senderId
 *         - dateTime
 *       properties:
 *         id:
 *           type: string
 *           description: The unique ID of the chat message
 *         receiverId:
 *           type: string
 *           description: The ID of the message receiver
 *         senderId:
 *           type: string
 *           description: The ID of the message sender
 *         dateTime:
 *           type: string
 *           description: The date and time of the sending
 *       example:
 *         id: "1"
 *         receiverId: "1"
 *         senderId: "2"
 *         dateTime: "2025-03-18T17:28:18.917Z"
 * 
 *     returnedChatUser:
 *      type: object
 *      required:
 *          - id
 *          - userId
 *          - username
 *          - email
 *          - lastMessage
 *          - unreadCount
 *          - dateTime
 *      properties:
 *          id:
 *              type: string
 *              description: The unique ID of the chat user
 *          userId:
 *              type: string
 *              description: The unique ID of the user
 *          email:
 *              type: string
 *              description: The user's email address
 *          username:
 *              type: string
 *              description: The user's display name
 *          image:
 *              type: string
 *              nullable: true
 *              description: URL of the user's profile image
 *          lastMessage:
 *              type: string
 *              description: The last message sent by the user
 *          unreadCount:
 *              type: number
 *              description: Amount of unread messages from the user
 *          dateTime:
 *              type: string
 *              description: The date and time of the last message
 *      example:
 *          id: "14"
 *          userId: "1"
 *          username: "bob"
 *          email: "bob@gmail.com"
 *          image: "http://localhost/media/bob.png"
 *          lastMessage: "Hi"
 *          unreadCount: 2
 *          dateTime: "2025-03-18T17:28:18.917Z"
 * 
 *     returnedPost:
 *       type: object
 *       required:
 *         - id
 *         - image
 *         - content
 *         - likes
 *         - user
 *       properties:
 *         id:
 *           type: string
 *           description: The unique ID of the post
 *         image:
 *           type: string
 *           description: URL of the image attached to the post
 *         content:
 *           type: string
 *           description: The text content of the post
 *         likes:
 *           type: integer
 *           description: Number of likes the post has received
 *         user:
 *           $ref: '#/components/schemas/returnedUser'
 *         isUserLiked:
 *           type: boolean
 *           nullable: true
 *           description: Whether the current user has liked the post (optional)
 *         commentsCount:
 *           type: integer
 *           nullable: true
 *           description: Number of comments on the post (optional)
 *       example:
 *         id: "1"
 *         image: "http://localhost:3000/post-image.jpg"
 *         content: "Had a great day at the park!"
 *         likes: 10
 *         user:
 *           id: "1"
 *           email: "bob@gmail.com"
 *           username: "bob cohen"
 *           image: "http://localhost:3000/bob.png"
 *         isUserLiked: true
 *         commentsCount: 5
 */
