export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = (req, res) => {
  console.log(req.body);
  return res.end();
};

// ==========================================================

export const edit = (req, res) => res.send("Edit");
export const remove = (req, res) => res.send("Delete");
export const login = (req, res) => res.send("Login");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See");
