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

async function findByUsername(req, res) {
  try {
    const { username } = req.body;
    const user = await prisma.user.findUnique({
      where: { username },
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

async function sendIMGS(req, res) {
  try {
    const img = req.params.image;
    const imgPath = path.resolve("uploads", img);
    return res.sendFile(imgPath);
  } catch (error) {
    console.log(error);
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
      include: {
        fromUser: {
          select: { id: true, name: true },
        },
        toUser: {
          select: { id: true, name: true },
        },
      },
    });
    res.json({ one2one: msgs, friendID: friendID });
  } catch (error) {
    something;
  }
}

async function getConvo(req, res) {
  const { withUserID } = req.body;
  const authUserID = Number(req.user.id);
  const otherUserID = withUserID;
  const msgsWUser = await prisma.message.findMany({
    where: {
      OR: [
        { from: otherUserID, to: authUserID },
        { from: authUserID, to: otherUserID },
      ],
      dltdBySender: false,
      dltdByReceiver: false,
    },
    orderBy: {
      date: "asc",
    },
  });
}

async function sendMsg(req, res) {
  try {
    const { sendTo, message } = req.body;
    const { fileOrImg } = req.file;
    const id = Number(req.user.id);
    const sendToNum = Number(sendTo);
    await prisma.message.create({
      data: {
        from: id,
        to: sendToNum,
        message: message,
        file: fileOrImg ? fileOrImg.filename : null,
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

async function getFriendReqs(req, res){
  try {
    const returnedReqs = await prisma.friendReq.findMany({
      where: {
        sentTo: req.user.id,
        accepted: false,
      },
      include: {
        whoSent: {
          select: {
            id: true,
            name: true,
            username: true,
            profile: {
              pfp: true
            }
          }
        }
      }

    })
      if (returnedReqs.length === 0){
        return res.status(403).json({message: "You have no friend requests :("})
      } return res.json({requests: returnedReqs})

  } catch(error){
    console.log(error)
  }
}

async function requestFriend(req, res) {
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
      await prisma.friendreq.create({
        data: {
          sentBy: id,
          sentTo: foundUserWEmail.id,
        },
      });
      return res.status(200).json({ message: true });
    }
  } catch (error) {
    something;
  }
}

async function acceptFriend(req, res) {
  try {
    const { friendToAccept } = req.body;
    const acceptFriend = Number(friendToAccept);
    const acceptedFriend = await prisma.friendreq.findUnique({

    })
  }
}

async function denyFriend(req, res) {
  try {
    const
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
    const { name, email, currentPass, newPassword } = req.body;
    const { pfp } = req.file;

    const user = await prisma.user.findUnique({
      where: {
        id: idNum,
      },
    });

    if (currentPass && newPassword) {
      const match = await createPassword.checkPassword(
        currentPass,
        user.saltedHash,
      );

      if (!match) {
        return res.status(403).json({
          error: "The current password you entered is incorrect",
        });
      }

      const approvedPass = await createPassword.createPassword(newPassword);

      const updateUser = await prisma.user.update({
        where: { id: idNum },
        data: {
          name: name,
          email: email,
          saltedHash: approvedPass,

          profile: {
            update: {
              pfp: pfp.filename,
            },
          },
        },
      });

      return res
        .status(200)
        .json({ user: updateUser, profile: updateUser.profile });
    }

    const updateUser = await prisma.user.update({
      where: { id: idNum },
      data: {
        name: name,
        email: email,

        profile: {
          update: {
            pfp: pfp,
          },
        },
      },
    });

    return res
      .status(200)
      .json({ user: updateUser, profile: updateUser.profile });
  } catch (error) {
    something;
  }
}

async function sideBarChatSearch(req, res) {
  try {
    const { query } = req.query;
    const results = await prisma.user.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        profile: {
          select: { pfp: true },
        },
      },
    });
    res.json({
      sideBarChatSearchRes: results,
    });
  } catch (error) {
    console.log(error);
  }
}

async function friendSearch(req, res) {
  try {
    const { query } = req.query;
    const results = await prisma.user.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profile: {
          pfp: true,
        },
      },
    });

    res.json({ friendSearchRes: results });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  signUp,
  findByEmail,
  getUserProfile,
  sendIMGS,
  getSideBar,
  getConvo,
  sendMsg,
  getMsgs,
  deleteMsg,
  updateProfile,
  sideBarChatSearch,
  getFriendReqs,
  requestFriend,
  acceptFriend,
  denyFriend,
  deleteFriend,
  deleteFriend,
  friendSearch,
};
