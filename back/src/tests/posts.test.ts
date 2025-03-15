import request from "supertest";
import mongoose from "mongoose";
import postModel from "../models/postModel";
import userModel from "../models/userModel";
import { mongoURI } from "../constants/config";
import { server } from "../index";

interface IUser {
  email: string;
  password: string;
  username: string;
  _id?: string;
  refreshToken?: string[];
}

type User = IUser & { token?: string };

const testUser: User = {
  email: "test@user.com",
  username: "username",
  password: "testpassword",
};

let postId = "";

beforeAll(async () => {
  await mongoose.connect(mongoURI);

  await postModel.deleteMany();
  await userModel.deleteMany();

  await request(server).post("/api/users/").send(testUser);
  const res = await request(server).post("/api/users/login").send(testUser);

  testUser.token = res.body.accessToken;
  testUser._id = res.body.user.id;
  expect(testUser.token).toBeDefined();
});

afterAll(async () => {
  await postModel.deleteMany();
  await userModel.deleteMany();

  await mongoose.connection.close();
  server.close();
});

describe("Posts Tests", () => {
  test("Posts test get all", async () => {
    const response = await request(server)
      .get("/api/posts")
      .set("Authorization", `Bearer ${testUser.token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test Create Post", async () => {
    const response = await request(server)
      .post("/api/posts")
      .set("Authorization", `Bearer ${testUser.token}`)
      .send({
        content: "Test Content",
        image: "Test image", // change to file later
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.content).toBe("Test Content");
    expect(response.body.image).toBe("Test image"); // change to file later
    postId = response.body.id;
  });

  test("Test get post by owner", async () => {
    const response = await request(server)
      .get(`/api/posts/${testUser._id}`)
      .set("Authorization", `Bearer ${testUser.token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].content).toBe("Test Content");
    expect(response.body[0].image).toBe("Test image");
  });

  test("Test Create Post 2", async () => {
    const response = await request(server)
      .post("/api/posts")
      .set("Authorization", `Bearer ${testUser.token}`)
      .send({
        content: "Test Content 2",
        image: "Test image 2", // change to file later
      });
    expect(response.statusCode).toBe(201);
  });

  test("Posts test get all 2", async () => {
    const response = await request(server)
      .get("/api/posts")
      .set("Authorization", `Bearer ${testUser.token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("Test Delete Post", async () => {
    const response = await request(server)
      .delete(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${testUser.token}`);
    expect(response.statusCode).toBe(200);
  });

  test("Test Create Post fail", async () => {
    const response = await request(server)
      .post("/api/posts")
      .set("Authorization", `Bearer ${testUser.token}`)
      .send({
        content: "Test Content 2",
      });
    expect(response.statusCode).toBe(500);
  });

  test("Test Update Post", async () => {
    const createResponse = await request(server)
      .post("/api/posts")
      .set("Authorization", `Bearer ${testUser.token}`)
      .send({
        content: "Initial Content",
        image: "Initial Image",
      });
    expect(createResponse.statusCode).toBe(201);
    const postIdToUpdate = createResponse.body.id;

    const updateResponse = await request(server)
      .put(`/api/posts/${postIdToUpdate}`)
      .set("Authorization", `Bearer ${testUser.token}`)
      .send({
        content: "Updated Content",
        image: "Updated Image",
      });

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.body.content).toBe("Updated Content");
    expect(updateResponse.body.image).toBe("Updated Image");
  });

  test("Test Like Post", async () => {
    const createResponse = await request(server)
      .post("/api/posts")
      .set("Authorization", `Bearer ${testUser.token}`)
      .send({
        content: "Content to Like",
        image: "Image for Like",
      });
    expect(createResponse.statusCode).toBe(201);
    const postIdToLike = createResponse.body.id;

    const likeResponse = await request(server)
      .post(`/api/posts/like/${postIdToLike}`)
      .set("Authorization", `Bearer ${testUser.token}`);

    expect(likeResponse.statusCode).toBe(200);
    expect(likeResponse.body.isUserLiked).toBe(true);

    const unlikeResponse = await request(server)
      .post(`/api/posts/like/${postIdToLike}`)
      .set("Authorization", `Bearer ${testUser.token}`);

    expect(unlikeResponse.statusCode).toBe(200);
    expect(unlikeResponse.body.isUserLiked).toBe(false);
  });
});
