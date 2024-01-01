import bcrpt from "bcrypt";
import User from "../models/User";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  console.log(req.body);
  const { name, email, username, password, password2, location } = req.body;
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "Password confirmations is not match",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "This username/email is already taken.",
    });
  }

  await User.create({
    name,
    email,
    username,
    password,
    location,
  });
  return res.redirect("/login");
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "An account with this username does not exists.",
    });
  }
  const ok = await bcrpt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "Wrong password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT_ID,
    allow_singup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();

  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT_ID,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();

  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const apiUrl = "https://api.github.com";
    const { access_token } = tokenRequest;
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();

    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();

    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      res.redirect("/login");
    }

    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        email: emailObj.email,
        username: userData.login,
        location: userData.location,
        socialOnly: true,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    res.redirect("/login");
  }
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;

  const emailAndUsernameExists = await User.exists({
    _id: { $ne: _id },
    $or: [{ email }, { username }],
  });
  if (emailAndUsernameExists) {
    return res.status(400).render("edit-profile", {
      pageTitle: "Edit Profile",
      errorMessage: "Exists Username/Email. Change Them.",
    });
  }

  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updateUser;

  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const pageTitle = "Change Password";
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;

  const ok = await bcrpt.compare(oldPassword, password);

  if (!ok) {
    return res.status(400).render("change-password", {
      pageTitle,
      errorMessage: "The current password is incorrect.",
    });
  }

  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("change-password", {
      pageTitle,
      errorMessage: "The password does not match",
    });
  }
  const user = await User.findById(_id);
  user.password = newPassword;
  await user.save();
  req.session.user = user;

  return res.redirect("/users/logout");
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  console.log(user);
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User not Found" });
  }
  return res.render("users/profile", { pageTitle: user.name, user });
};
