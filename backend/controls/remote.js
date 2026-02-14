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
    const userProfSettings = await prisma.user.findUnique({
      where: {
        email: req.user.email,
      },
      include: {
        profile: true,
        friends: true,
      },
    });

    if (!userProfSettings) {
      return res.status(401).status({ message: "no user found" });
    } else {
      res.json({ userInfo: userProfSettings });
    }
  } catch (error) {
    console.log("error");
  }
}

async function getSideBar(req, res) {
  try {
    const userId = Number(req.user.id);

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ from: userId }, { to: userId }],
        dltdBySender: false,
        dltdByReceiver: false,
      },
      orderBy: {
        date: "desc",
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const conversations = [];

    messages.forEach((msg) => {
      const otherUser = msg.from === userId ? msg.from : msg.to;

      const exists = conversations.find((other) => other.id === otherUser.id);

      if (!exists) {
        conversations.push({
          id: otherUser.id,
          name: otherUser.name,
        });
      }
    });

    return res.json({ conversations });
  } catch (error) {
    console.log("Error in getConversations:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
}

async function getMsgs(req, res) {
  try {
    const userID = Number(req.user.id);
    const { friendID } = req.body;
    const friendIDNum = Number(friendID);
    const msgs = await prisma.message.findMany({
      where: {
        OR: [
          { from: friendIDNum, to: userID },
          { from: userID, to: friendIDNum },
        ],
        dltdBySender: false,
        dltdByReceiver: false,
      },

      orderBy: {
        date: "asc",
      },
    });
    res.json({ one2one: msgs });
  } catch (error) {
    something;
  }
}

async function sendMsg(req, res) {
  try {
    const { sendTo, message } = req.body;
    const id = Number(req.user.id);
    const sendToNum = Number(sendTo);
    await prisma.message.create({
      data: {
        from: id,
        to: sendToNum,
        message: message,
      },
    });

    res.status(200).json({ msg: true });
  } catch (error) {
    something;
  }
}

async function deleteMsg(req, res) {
  try {
    const { msgToDelete } = req.body;
    const msgToDeleteNum = Number(msgToDelete);
    const id = Number(req.user.id);
    const msg = await prisma.message.findUnique({
      where: {
        id: msgToDeleteNum,
      },
    });
    if (msg) {
      msg.from !== id
        ? await prisma.message.update({
            where: {
              id: msgToDelete,
            },
            data: {
              dltdByReceiver: true,
            },
          })
        : await prisma.message.update({
            where: {
              id: msgToDelete,
            },
            data: {
              dltdBySender: true,
            },
          });
    } else {
      return res.status(401).json({ message: "cannot find msg to delete" });
    }
  } catch (error) {
    something;
  }
}

async function addFriend(req, res) {
  try {
    const { friendToAdd } = req.body;
    const foundUserWEmail = await prisma.user.findUnique({
      where: {
        email: friendToAdd,
      },
    });
    if (!foundUserWEmail) {
      return res
        .status(401)
        .json({ message: "No one was found with that email :(" });
    } else {
      const id = Number(req.user.id);
      await prisma.friends.create({
        data: {
          ownerId: id,
          contactId: foundUserWEmail.id,
        },
      });
      return res.status(200).json({ message: true });
    }
  } catch (error) {
    something;
  }
}

async function deleteFriend(req, res) {
  try {
    const { friendToDelete } = req.body;
    const foundUserWEmail = await prisma.user.findUnique({
      where: {
        email: friendToDelete,
      },
    });

    if (!foundUserWEmail) {
      return res.status(401).json({ message: "Sorry no friend to delete" });
    } else {
      const id = Number(req.user.id);
      await prisma.friends.delete({
        where: {
          ownerId: id,
          contactId: foundUserWEmail.id,
        },
      });
      res.status(200).json({ message: true });
    }
  } catch (error) {
    something;
  }
}

async function updateProfile(req, res) {
  try {
    const id = req.user.id;
    const idNum = Number(id);
    const { pfp, name, email, password } = req.body;
    const changePFP = await prisma.profile.update({
      where: {
        user: idNum,
      },
      data: {
        pfp: pfp,
      },
    });
    const hashedPass = await createPassword.createPassword(password);
    const updateUser = await prisma.user.update({
      where: {
        id: idNum,
      },
      data: {
        name: name,
        email: email,
        saltedHash: hashedPass,
      },
    });
    if (changePFP && updateUser) {
      return res.status(200).json({ message: true });
    } else {
      return res.status(401).json({ message: "couldnt update user" });
    }
  } catch (error) {
    something;
  }
}

module.exports = {
  signUp,
  findByEmail,
  getUserProfile,
  getSideBar,
  sendMsg,
  getMsgs,
  deleteMsg,
  addFriend,
  deleteFriend,
  updateProfile,
};
