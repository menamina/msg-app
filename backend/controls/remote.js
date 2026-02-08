const prisma = require("../prisma/client");
const { createPassword } = require("../middleware/password");

async function findByEmail(req, res) {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      return res.json({
        user,
      });
    } else {
      return res.json({ message: "no user found with that email " });
    }
  } catch (error) {
    console.log(`error @ findByEmail controller: ${error.message}`);
  }
}

async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;
    const passHash = createPassword(password);

    await prisma.user.create({
      data: {
        name: name,
        email: email,
        saltedHash: passHash,
      },
    });
    res.status(200);
  } catch (error) {
    console.log(`error @ signUp controller: ${error.message}`);
  }
}

module.exports = {
  signUp,
  findByEmail,
};
