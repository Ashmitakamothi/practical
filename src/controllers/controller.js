const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "demo_db",
});

const connectToDatabase = () => {
  return new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        console.error("Error connecting to MySQL database:", err);
        reject(err);
      } else {
        console.log("Connected to MySQL database");
        resolve();
      }
    });
  });
};
//signup
const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "name, email, and password are required" });
  }
  //password validation
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must be at least 8 characters long and contain at least 1 number and 1 special character",
    });
  }

  try {
    const results = await queryDatabase(
      "SELECT * FROM employee WHERE email = ?",
      [email]
    );
    if (results.length > 0) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    await queryDatabase(
      "INSERT INTO employee (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    console.log("User registered successfully");
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in signUp function:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//get users
const getUsers = async (req, res) => {
  try {
    const results = await queryDatabase("SELECT * FROM employee");
    console.log("Data retrieved successfully");
    res.status(200).json({ data: results });
  } catch (error) {
    console.error("Error in getUsers function:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const results = await queryDatabase(
      "SELECT * FROM employee WHERE email = ? AND password = ?",
      [email, password]
    );

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "User login successfully", token: token });
  } catch (error) {
    console.error("Error in login function:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//update user
const updateUser = async (req, res) => {
  const { id, name, email, password } = req.body;

  try {
    await queryDatabase(
      "UPDATE employee SET name = ?, email = ?, password = ? WHERE id = ?",
      [name, email, password, id]
    );

    console.log("User updated successfully");
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error in updateUser function:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//delete user
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await queryDatabase("DELETE FROM employee WHERE id = ?", [
      userId,
    ]);

    if (result.affectedRows > 0) {
      console.log("User deleted successfully");
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error in deleteUser function:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//change password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userEmail = req.user.email;

  try {
    const userRecord = await queryDatabase(
      "SELECT * FROM employee WHERE email = ? AND password = ?",
      [userEmail, currentPassword]
    );

    if (userRecord.length === 0) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    await queryDatabase("UPDATE employee SET password = ? WHERE email = ?", [
      newPassword,
      userEmail,
    ]);

    console.log("Password changed successfully");
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error in changePassword function:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const queryDatabase = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  signUp,
  getUsers,
  login,
  updateUser,
  deleteUser,
  changePassword,
  connectToDatabase,
};
