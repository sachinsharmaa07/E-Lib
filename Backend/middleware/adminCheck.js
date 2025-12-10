// Check if user is admin
export const adminCheck = (req, res, next) => {
  const adminEmails = ["nitish@gmail.com", "hritik@gmail.com", "sachin@gmail.com"];
  const email = req.headers.email || req.body.email;
  const password = req.headers.password || req.body.password;

  if (adminEmails.includes(email) && password === "123") {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};
