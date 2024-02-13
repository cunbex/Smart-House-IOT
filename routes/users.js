const express = require("express");
const router = express.Router();
const hashPass = require("../module/passwordHash");
const { v4: uuidv4 } = require("uuid");

// prisma init
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET users
router.get("/", async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany();
    res.json(allUsers);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
});

// Post user
router.post("/create", async (req, res) => {
  try {
    if (!req.body.email || !req.body.name || !req.body.password) {
      return res
        .status(400)
        .json({ msg: "Please include name, email, and password" });
    }
    const hashedPassword = await hashPass(req.body.password);
    const userId = uuidv4();
    await prisma.user.create({
      data: {
        id: userId,
        email: req.body.email,
        name: req.body.name,
        password: hashedPassword,
      },
    });

    res.json({ msg: "User created successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
});

// reset password
router.post("/reset-password", async (req, res) => {
  const hashedPassword = await hashPass(req.body.password);
  try {
    await prisma.user.update({
      where: {
        id: req.body.id,
      },
      data: {
        password: hashedPassword,
      },
    });
    res.json({ msg: "Password changed successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
});

// reset email
router.post("/reset-email", async (req, res) => {
  try {
    await prisma.user.update({
      where: {
        id: req.body.id,
      },
      data: {
        email: req.body.email,
      },
    });
    res.json({ msg: "Email changed successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
});

// delete user
router.post("/delete", async (req, res) => {
  try {
    await prisma.user.delete({
      where: {
        id: req.body.id,
      },
    });
    res.json({ msg: "User deleted successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
});
module.exports = router;
