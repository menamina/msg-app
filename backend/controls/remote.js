const prisma = require("../prisma/client");
const createPassword = require("../middleware/password");

async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;

    const emailInUse = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!emailInUse) {
      const passHash = await createPassword.createPassword(password);

      await prisma.user.create({
        data: {
          name,
          email,
          saltedHash: passHash,
        },
      });

      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ message: "Email is taken" });
    }
  } catch (error) {
    console.log(`error @ signUp controller: ${error.message}`);
    return res.status(500).json({ message: "failed to create user" });
  }
}

async function findByEmail(req, res) {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      return res.json({ user });
    }
    return res.status(404).json({ message: "no user found with that email" });
  } catch (error) {
    console.log(`error @ findByEmail controller: ${error.message}`);
    return res.status(500).json({ message: "failed to find user" });
  }
}

async function getUserProfile(req, res) {
  try {
    if (req.user) {
      return res.status(401).json({ message: "no user" });
    } else {
      const userProfSettings = await prisma.user.findUnique({
        where: {
          email: req.user.email,
        },
        include: {
          profile: true,
          sent: true,
          received: true,
          friends: true,
        },
      });

      if (!userProfSettings) {
        return res.send(401).status({ message: "no user found" });
      } else {
        res.json({ userInfo: userProfSettings });
      }
    }
  } catch (error) {
    console.log("error");
  }
}

async function getMsgs(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "no user" });
    } else {
      const user = await prisma.user.findUnique({
        where: {
          email: req.user.email,
        },
        include: {
          received: true,
        },
      });

      if (!user) {
        return res.status(401).json({ message: "no user" });
      } else {
        res.json({ receivedMsgs: user.received });
      }
    }
  } catch (error) {
    something;
  }
}

async function sendMsg(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "no user" });
    } else {
      const user = await prisma.user.findUnique({
        where: {
          email: req.user.email,
        },
      });

      if (!user) {
        return res.status(401).json({ message: "no user" });
      } else {
        const { sendTo, message } = req.body;
        const sendToNum = Number(sendTo);
        const msgSent = await prisma.message.create({
          data: {
            from: req.user.id,
            to: sendToNum,
            message: message,
          },
        });
        if (!msgSent) {
          return res.status(401).json({ message: "message cannot be sent" });
        } else {
          res.status(200).json({ msg: true });
        }
      }
    }
  } catch (error) {
    something;
  }
}

async function deleteMsg(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "no user" });
    } else {
      const user = await prisma.user.findUnique({
        where: {
          email: req.user.email,
        },
      });

      if (!user) {
        return res.status(401).json({ message: "no user" });
      }
    }
  } catch (error) {
    something;
  }
}

async function addFriend(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "no user" });
    } else {
      const user = await prisma.user.findUnique({
        where: {
          email: req.user.email,
        },
      });

      if (!user) {
        return res.status(401).json({ message: "no user" });
      }
    }
  } catch (error) {
    something;
  }
}

async function deleteFriend(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "no user" });
    } else {
      const user = await prisma.user.findUnique({
        where: {
          email: req.user.email,
        },
      });

      if (!user) {
        return res.status(401).json({ message: "no user" });
      }
    }
  } catch (error) {
    something;
  }
}

async function updateProfile(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "no user" });
    } else {
      const user = await prisma.user.findUnique({
        where: {
          email: req.user.email,
        },
      });

      if (!user) {
        return res.status(401).json({ message: "no user" });
      }
    }
  } catch (error) {
    something;
  }
}

module.exports = {
  signUp,
  findByEmail,
  getUserProfile,
  sendMsg,
  getMsgs,
  deleteMsg,
  addFriend,
  deleteFriend,
  updateProfile,
};
