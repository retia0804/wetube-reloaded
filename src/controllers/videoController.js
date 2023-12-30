export const trending = (req, res) => res.send("Home Page Videos");
export const edit = (req, res) => {
  console.log(req.params.id);
  res.send("Edit");
};
export const search = (req, res) => res.send("Search");
export const see = (req, res) => {
  console.log(req.params.id);
  return res.send("See");
};

export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => {
  console.log(req.params.id);
  res.send("Delete Video");
};
