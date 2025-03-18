import request from "supertest";
import mongoose from "mongoose";
import { server } from "../index";
import userModel from "../models/userModel";
import { mongoURI } from "../constants/config";

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
  username: "testuser",
  password: "testpassword",
};

let userId = "";
let authToken = "";
let refreshToken: string | undefined = "";

beforeAll(async () => {
  await mongoose.connect(mongoURI);

  if (!server.listening) {
    server.listen(3000);
  }

  await userModel.deleteMany();

  const createUserResponse = await request(server)
    .post("/api/users")
    .send(testUser);

  userId = createUserResponse.body.user.id;

  const loginResponse = await request(server).post("/api/users/login").send({
    username: testUser.username,
    password: testUser.password,
  });
  authToken = loginResponse.body.accessToken;

  expect(authToken).toBeDefined();
});

afterAll(async () => {
  await userModel.deleteMany();

  await mongoose.connection.close();
  server.close();
});

describe("User Routes Tests", () => {
  test("Create User", async () => {
    const response = await request(server).post("/api/users").send({
      email: "newuser@test.com",
      username: "newuser",
      password: "newpassword",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.user.email).toBe("newuser@test.com");
    expect(response.body.user.username).toBe("newuser");

    refreshToken = (response.headers["set-cookie"] as unknown as string[])
      .find((cookie: string) => cookie.startsWith("refreshToken"))
      ?.split(";")[0]
      ?.split("=")[1];

    expect(refreshToken).toBeDefined();
  });

  test("Get User by ID", async () => {
    const response = await request(server)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(userId);
    expect(response.body.email).toBe(testUser.email);
    expect(response.body.username).toBe(testUser.username);
  });

  test("Update User", async () => {
    const response = await request(server)
      .put(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ email: "updateduser@test.com" });

    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe("updateduser@test.com");
  });

  test("Login User", async () => {
    const response = await request(server).post("/api/users/login").send({
      username: testUser.username,
      password: testUser.password,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.accessToken).toBeDefined();
  });

  test("Logout User", async () => {
    const response = await request(server)
      .post("/api/users/logout")
      .set("Cookie", `refreshToken=${refreshToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Logged out successfully");

    const user = await userModel.findById(userId);
    expect(user?.tokens).not.toContain(refreshToken);
  });

  test("Refresh Token", async () => {
    const response = await request(server)
      .post("/api/users/refreshToken")
      .set("Cookie", `refreshToken=${refreshToken}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid req");
  });
});
