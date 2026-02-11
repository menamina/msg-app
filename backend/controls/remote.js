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

async function getUserProfile(req, res) {}

module.exports = {
  signUp,
  findByEmail,
  getUserProfile,
};
