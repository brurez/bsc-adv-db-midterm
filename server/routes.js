const { Router } = require("express");
const createDbConnection = require("./db");
const { readPrivilegesOnMusic } = require("./db/credentials.js");

const router = Router();

const db = createDbConnection(readPrivilegesOnMusic);

router.get("/musics", async (req, res) => {
  const { offset } = req.query;
  const [musics] = await db.raw(
    `
        SELECT * FROM music
        LEFT JOIN composer ON composer.composer_id = music.composer_id
        LIMIT 10 OFFSET ?
  `,
    [Number(offset)]
  );
  res.json(musics);
});

router.get("/top-composers", async (req, res) => {
  const [result] = await db.raw(`
        SELECT composer.lastname as label, COUNT(music.music_id) as value FROM music
        LEFT JOIN composer ON composer.composer_id = music.composer_id
        GROUP BY composer.lastname
        ORDER BY COUNT(music.music_id) DESC
        LIMIT 10
  `);
  res.json(result);
});

router.get("/top-countries", async (req, res) => {
  const [result] = await db.raw(`
    SELECT country.name as label, COUNT(m.title) as value FROM country
    JOIN composer c ON c.country_name = country.name
    JOIN music m ON c.composer_id = m.composer_id
    GROUP BY c.composer_id
    ORDER BY COUNT(m.title) DESC
    LIMIT 10;
  `);
  res.json(result);
});

module.exports = router;
