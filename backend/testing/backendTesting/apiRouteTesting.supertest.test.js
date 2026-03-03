jest.mock("../../controls/remote", () => ({
  signUp: (req, res) => res.status(201).json({ ok: true }),
  getUserProfile: (req, res) =>
    res.json({
      user: {
        id: 1,
        name: "Mena",
        email: "123@gmail.com",
        profile: { pfp: true },
      },
    }),
  getMsgs: (req, res) => res.json({ msgs: [] }),
  sendMsg: (req, res) => res.status(201).json({ sent: true }),
  deleteMsg: (req, res) => res.status(200).json({ deleted: true }),
  requestFriend: (req, res) => res.status(200).json({ sent: true }),
}));

jest.mock("../../middleware/isAuth", () =>
  jest.fn((req, res, next) => {
    req.user = { id: 1, name: "Mena" };
    next();
  }),
);

jest.mock("../../passport/passport", () => ({
  authenticate: () => (req, res, next) => {
    req.login = (user, cb) => cb();
    next(null, { id: 1, name: "Mena", email: "test@test.com" });
  },
}));

const request = require("supertest");
const app = require("./app");

test("can sign up", async () => {
  const res = await request(app).post("/signup").send({
    name: "Mena",
    username: "menawena",
    email: "testing@testing.com",
    password: "12345678",
  });
  expect(res.statusCode).toBe(201);
  expect(res.body).toEqual({ ok: true });
});

test("can login", async () => {
  const res = await request(app)
    .post("/login")
    .send({ email: "fake@gmail.com", password: "hellogoodbye" });

  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({
    user: {
      id: 1,
      name: "Mena",
      email: "test@test.com",
    },
  });
});

test("can logout", async () => {});

test("can find a session", async () => {
  const res = await request(app).get("/isThereASession");

  expect(res.body).toEqual({
    user: {
      id: 1,
      name: "Mena",
    },
  });
});

test("can get hub", async () => {
  const res = await request(app).get("/hub");
  expect(res.body).toEqual({
    user: {
      id: 1,
      name: "Mena",
      email: "123@gmail.com",
      profile: { pfp: true },
    },
  });
});

test("can get messages", async () => {
  const res = await request(app).post("/getMsgs").send({ friendID: 2 });

  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({
    msgs: [],
  });
});

test("can send messages", async () => {
  const res = await request(app)
    .post("/sendMsg")
    .send({ sendTo: 2, message: "hello" });

  expect(res.statusCode).toBe(201);
  expect(res.body).toEqual({
    sent: true,
  });
});

test("can delete messages", async () => {
  const res = await request(app).patch("/dltMsg").send({ msgToDelete: 1 });

  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({
    deleted: true,
  });
});

test("can send friend req", async () => {
  const res = await request(app)
    .post("/sendFriendReq")
    .send({ friendToAdd: "someone" });

  expect(res.statusCode).toBe(200);
  expect(res.body).toEqual({
    sent: true,
  });
});

test("can accept friend req", async () => {
  const res = await request(app)
    .patch("/acceptFriendReq")
    .send({ friendToAccept: 2 });

  expect(res.statusCode).toBe(200);
});

test("can deny friend req", async () => {
  const res = await request(app)
    .delete("/denyFriendReq")
    .send({ friendToDeny: 2 });

  expect(res.statusCode).toBe(200);
});

test("can delete friend", async () => {
  const res = await request(app).post("/dltFriend").send({ deleteThisID: 2 });

  expect(res.statusCode).toBe(200);
});
