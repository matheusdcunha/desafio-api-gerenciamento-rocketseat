import request from "supertest";
import type { $Enums } from "@prisma/client";
import { prisma } from "@/database/prisma";
import { hash } from "bcrypt";
import { app } from "../app";

describe("UserController", () => {

  let user_id: string;
  let user_token: string;

  let super_user: { id: number; name: string; email: string; password: string; role: $Enums.UserRoles; createAt: Date; updatedAt: Date | null; };
  let super_user_token: string = ""


  beforeAll(async () => {

    const encryptPass = await hash("senha0101", 8)

    super_user = await prisma.user.create({
      data: {
        name: "Super Test",
        email: "super_test@email.com",
        password: encryptPass,
        role: "admin"
      }
    })
  })

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        id: Number(user_id)
      }
    })

    await prisma.user.delete({
      where: {
        id: super_user.id
      }
    })

  })

  it("should create a new user successfully", async () => {
    const response = await request(app).post("/users").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "teste0101"
    })

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id")
    expect(response.body.name).toBe("Test User")
    expect(response.body.role).toBe("member")

    user_id = response.body.id

  })

  it("should throw a error if user with same email already exists", async () => {
    const response = await request(app).post("/users").send({
      name: "Duplicate User",
      email: "testuser@example.com",
      password: "teste0101"
    })

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User with same email already exists");
  })

  it("should throw a validation error if email is invalid", async () => {
    const response = await request(app).post("/users").send({
      name: "Test User",
      email: "invalid",
      password: "teste0101"
    })

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("validation error");

  })

  it("should auth successfully", async () => {
    const responseAdmin = await request(app).post("/auth").send({
      email: "super_test@email.com",
      password: "senha0101"
    })

    const responseMember = await request(app).post("/auth").send({
      email: "testuser@example.com",
      password: "senha0101"
    })

    expect(responseAdmin.status).toBe(201)
    expect(responseAdmin.body).toHaveProperty("token")

    super_user_token =  responseAdmin.body.token
    user_token = responseMember.body.token

  })

  it("should update a exist user successfully", async () => {
    const response = 
    await request(app)
    .put(`/users/${user_id}`)
    .set("Authorization", `Bearer ${super_user_token}`).send({
      email: "test02@email.com"
    })

    expect(response.status).toBe(200)

  })

  it("should update a exist user failed because role invalid", async ()=>{

    const responseAuth = 
    await request(app)
    .put(`/users/${user_id}`)
    .set("Authorization", `Bearer ${user_token}`).send({
      email: "test02@email.com"
    })


    expect(responseAuth.status).toBe(401)

  })

  it("should update failed because not exist user", async ()=>{ 
    const response = 
    await request(app)
    .put(`/users/4`)
    .set("Authorization", `Bearer ${super_user_token}`).send({
      email: "test02@email.com"
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("message")
  })

  it("should delete exist user successfully",async()=>{

    const responseUserCreate = await request(app).post("/users").send({
      name: "Delete Test User",
      email: "delete_testuser@example.com",
      password: "teste0101"
    })

    const responseDelete = 
    await request(app)
    .delete(`/users/${responseUserCreate.body.id}`)
    .set("Authorization", `Bearer ${super_user_token}`)

    expect(responseDelete.status).toBe(200)
  } )

  it("should delete exist user failed because role invalid", async()=>{

    const responseUserCreate = await request(app).post("/users").send({
      name: "Delete Test User",
      email: "delete_testuser@example.com",
      password: "teste0101"
    })

    const responseUser = await request(app).post("/auth").send({
      email: "testuser@example.com",
      password: "senha0101"
    })

    const responseAuth = 
    await request(app)
    .put(`/users/${responseUserCreate.body.id}`)
    .set("Authorization", `Bearer ${responseUser.body.token}`).send({
      email: "test02@email.com"
    })

    await prisma.user.delete({
      where: {
        id: responseUserCreate.body.id
      }
    })
    
    expect(responseAuth.status).toBe(401)

  })

  it("should delete failed because not exist user",async()=>{

    const responseDelete = 
    await request(app)
    .delete(`/users/4`)
    .set("Authorization", `Bearer ${super_user_token}`)

    expect(responseDelete.status).toBe(400)
    expect(responseDelete.body).toHaveProperty("message")
  } )


})