var admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp();
}

const validate = async (token) => {
  const decodedToken = await admin.auth().verifyIdToken(token, true);
  const data = await admin
    .firestore()
    .collection("admins")
    .doc(decodedToken.uid)
    .get()
    .then((doc) => doc.data());

  return {decodedToken, data: !!data };
};

export default async (req, res) => {
  try {
    const token = req.headers.authorization.split('Bearer ')[1];;
    if (!token) {
      return res.status(403).send({
        error: 403,
        message: "You are offline.",
      });
    }

    /*admin
      .auth()
      .verifyIdToken(token)
      .then(function (decodedToken) {
        return res.status(200).send({ decodedToken });
      })
      .catch(function (error) {
        res.status(403).send({ error });
      });*/

    const result = await validate(token);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(403).send({
      error,
      message: 'Invalid login credentials',
    });
  }
};
