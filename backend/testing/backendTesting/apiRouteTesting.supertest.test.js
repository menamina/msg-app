jest.mock("../../controls/remote", () => ({
  signUp: (req, res) => res.status(201).json({ ok: true }),
  getUserProfile: (req, res) => res.json({ user: { id: 1 } }),
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

test("can sign up", async () => {});
test("can login", async () => {});
test("can logout", async () => {});
test("can find a session", async () => {});

test("can get hub", async () => {});
test("can get messages", async () => {});
test("can send messages", async () => {});
test("can delete messages", async () => {});

test("can send friend req", async () => {});
