const { Router } = require("express");
const createDbConnection = require("./db");
const { readPrivilegesOnMusic } = require("./db/credentials.js");

const router = Router();

const db = createDbConnection(readPrivilegesOnMusic);

router.get("/musics", async (req, res) => {
  const { offset, orderBy } = req.query;
  const [musics] = await db.raw(
    `
        SELECT * FROM music
        LEFT JOIN composer ON composer.composer_id = music.composer_id
        ORDER BY ?
        LIMIT 10 OFFSET ?
  `,
    [orderBy, Number(offset)]
  );
  res.json(musics);
});

router.get("/top-composers", async (req, res) => {
  const [result] = await db.raw(`
        SELECT composer.lastname, COUNT(music.music_id) as compositions FROM music
        LEFT JOIN composer ON composer.composer_id = music.composer_id
        GROUP BY composer.lastname
        ORDER BY COUNT(music.music_id) DESC
        LIMIT 10
  `);
  res.json(result);
});

module.exports = router;
