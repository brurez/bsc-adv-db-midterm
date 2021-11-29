const {Router} = require("express");
const db = require("./db")

const router = Router();

router.get('/musics', async (req, res) => {
  const result = await db.query('SELECT * FROM music')
})

module.exports = router;
