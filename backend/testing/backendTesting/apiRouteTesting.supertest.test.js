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
  const res = await request(app).post("/signUp").send({
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
  const res = await request(app).get("/isThereAsession");

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

test("can get messages", async () => {});
test("can send messages", async () => {});
test("can delete messages", async () => {});

test("can send friend req", async () => {});
test("can accept friend req");
test("can deny friend req");
test("can delete friend");
