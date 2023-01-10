import { Router } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config.json";
import CharacterSheet from "../database/Models/CharacterSheet";
import User from "../database/Models/User";
const router = Router();

router.post("/api/v1/save-sheet", async (req, res) => {
  const auth = req.headers.authorization!.split(" ");
  const bearer = auth[0];
  const token = auth[1];
  if (bearer !== "Bearer") return res.status(401).send({ error: "Not bearer" });

  try {
    const userJwt = jwt.verify(token!, config["jwt-secret"]) as JwtPayload;
    const user = await User.findOne({ _id: userJwt.id });

    const sheetData = req.body;

    const sheet = new CharacterSheet({
      data: sheetData,
    });

    const _id = sheet._id;

    user?.characterSheets.push(_id);

    await user?.save();
    await sheet.save();

    return res.status(200).send({ message: "Success" });

  } catch (err) {
    return res.status(500).send({ message: err });
  }
});

router.patch("/api/v1/save-sheet/:id", async (req, res) => {
  const auth = req.headers.authorization!.split(" ");
  const bearer = auth[0];
  const token = auth[1];
  if (bearer !== "Bearer") return res.status(401).send({ error: "Not bearer" });

  try {
    const userJwt = jwt.verify(token!, config["jwt-secret"]) as JwtPayload;
    const id = req.params.id;

    const user = await User.findOne({ _id: userJwt.id });

    const sheetInUser = user?.characterSheets.find(_id => _id.toString() === id);
    if (sheetInUser !== undefined) {
      const update = req.body;
      const sheet = await CharacterSheet.findOne({ _id: id });
      await sheet?.updateOne({ data: update });
      return res.status(200).send({ message: "Success" });
    } else return res.status(401).send({ message: "Invalid sheet" });

  } catch (err) {
    return res.status(500).send({ message: err });
  }
});

router.get("/api/v1/get-sheets", async (req, res) => {
  const auth = req.headers.authorization!.split(" ");
  const bearer = auth[0];
  const token = auth[1];
  if (bearer !== "Bearer") return res.status(401).send({ error: "Not bearer" });

  try {
    const userJwt = jwt.verify(token!, config["jwt-secret"]) as JwtPayload;
    const user = await User.findOne({ _id: userJwt.id });
    const sheets = [];
    for (const sheetId of user?.characterSheets!) {
      const sheet = await CharacterSheet.findOne({ _id: sheetId });
      if (sheet !== null) sheets.push(sheet);
    }

    return res.status(200).send({ sheets });

  } catch (err) {
    return res.status(500).send({ message: err });
  }
});

router.get("/api/v1/get-sheet/:id", async (req, res) => {

  const sheetId = req.params.id;
  const auth = req.headers.authorization!.split(" ");
  const bearer = auth[0];
  const token = auth[1];
  if (bearer !== "Bearer") return res.status(401).send({ error: "Not bearer" });

  try {
    const userJwt = jwt.verify(token!, config["jwt-secret"]) as JwtPayload;
    const user = await User.findOne({ _id: userJwt.id });

    const sheetInUser = user?.characterSheets.find(id => id.toString() === sheetId);
    if (sheetInUser !== undefined) {
      const sheet = await CharacterSheet.findOne({ _id: sheetId });
      return res.status(200).send({ sheet });
    } else return res.status(401).send({ message: "Invalid sheet" });


  } catch (err) {
    return res.status(500).send({ message: err });
  }

});

router.delete("/api/v1/delete-sheet/:id", async (req, res) => {
  console.log("test");
  const auth = req.headers.authorization!.split(" ");
  const bearer = auth[0];
  const token = auth[1];
  if (bearer !== "Bearer") return res.status(401).send({ error: "Not bearer" });

  try {
    const userJwt = jwt.verify(token!, config["jwt-secret"]) as JwtPayload;
    const user = await User.findOne({ _id: userJwt.id });

    // const bodySheet_id = req.body;
    const bodySheet_id = req.params.id!;

    const sheet = await CharacterSheet.findOne({ _id: bodySheet_id });

    const index = user?.characterSheets.findIndex(sheet => sheet._id.toString() === bodySheet_id);
    if (index === -1) return res.status(500).send({ message: "Out of bounds" });

    user?.characterSheets.splice(index!, 1);
    await sheet?.delete();
    await user?.save();

    return res.status(200).send({ message: "Success" });

  } catch (err) {
    return res.status(404).send({ message: err });
  }
});

export default router;