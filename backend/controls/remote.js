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
        sent: {
          where: {
            dltdBySender: false,
          },
        },
        received: {
          where: {
            dltdByReceiver: false,
          },
        },
        friends: true,
      },
    });

    if (!userProfSettings) {
      return res.send(401).status({ message: "no user found" });
    } else {
      res.json({ userInfo: userProfSettings });
    }
  } catch (error) {
    console.log("error");
  }
}

async function getMsgs(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.user.email,
      },
      include: {
        received: {
          where: {
            dltdByReceiver: false,
          },
        },
        sent: {
          where: {
            dltdBySender: false,
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({ message: "no user" });
    } else {
      res.json({ msgsSent: user.sent, msgs: user.received });
    }
  } catch (error) {
    something;
  }
}

async function sendMsg(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.user.email,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "no user" });
    } else {
      const { sendTo, message } = req.body;
      const id = req.user.id,
      const idNum = Number(id)
      const sendToNum = Number(sendTo);
      const msgSent = await prisma.message.create({
        data: {
          from: idNum,
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
  } catch (error) {
    something;
  }
}

async function deleteMsg(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.user.email,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "no user" });
    } else {
      const { msgToDelete } = req.body;
      const msgToDeleteNum = Number(msgToDelete);
      const reqIDNum = Number(req.user.id);
      const msg = await prisma.message.findUnique({
        where: {
          id: msgToDeleteNum,
        },
      });
      if (msg) {
        msg.from === reqIDNum
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
    }
  } catch (error) {
    something;
  }
}

async function addFriend(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.user.email,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "no user" });
    } else {
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
        await prisma.friends.create({
          data: {
            contactID: foundUserWEmail.id,
            email: friendToAdd,
          },
        });
        return res.status(200).json({ message: true });
      }
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
      await prisma.friends.delete({
        where: {
          contactID: foundUserWEmail.id,
          email: friendToDelete,
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
    const hashedPass = createPassword.createPassword(password)
    const updateUser = await prisma.user.update({
      where: {
        id: idNum
      },
      data: {
      name: name,
      email: email,
      saltedHash: hashedPass
      }
    })
    if (changePFP && updateUser){
      return res.status(200).json({message: true})
    } else {
      return res.status(401).json({message: 'couldnt update user'})
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
