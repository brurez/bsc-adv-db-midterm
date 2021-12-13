const createDbConnection = require("./index.js");
const { fullPrivilegesOnMusic } = require("./credentials.js");

const data = require("./data.json");

const db = createDbConnection(fullPrivilegesOnMusic);

createCountries(data).then(() => {
  createGenres(data).then(() => {
    createInstruments(data).then(() => {
      createComposers(data).then(() => {
        createMusics(data).then(() => console.log('done!'))
      })
    })
  })
})

async function createMusics(data) {
  for (const item of data) {
    try {
      const [composers] = await db.raw(
        "SELECT `composer_id` FROM composer WHERE `lastname` = ? ",
        [item.composer]
      );
      const rangeSplit = item.range && item.range.split("-");
      const range = rangeSplit
        ? [Number(rangeSplit[0]), Number(rangeSplit[1])]
        : [null, null];
      const dateExact = item.date ? Number(item.date) : null;
      const [{ insertId }] = await db.raw(
        "INSERT INTO music (`title`, `composer_id`, `date_range_start`, `date_range_end`, `date_exact`,`modulation`, `key`, `catalogue_number`) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
        [
          item.title,
          composers[0].composer_id,
          range[0],
          range[1],
          dateExact,
          item.modulation,
          item.key,
          item.category_number,
        ]
      );
      if (item.genre)
        await db.raw(
          "INSERT INTO music_genre_join (`genre_name`, `music_id`, `is_subgenre`) VALUES (?, ? , ?)",
          [item.genre, insertId, 0]
        );
      if (item.subgenre)
        await db.raw(
          "INSERT INTO music_genre_join (`genre_name`, `music_id`, `is_subgenre`) VALUES (?, ? , ?)",
          [item.subgenre, insertId, 1]
        );

      await db.raw(
        "INSERT INTO music_instrument_join (`instrument_name`, `music_id`, `order`) VALUES (?, ? , ?)",
        [item.inst1, insertId, 1]
      );
      if (item.inst2)
        await db.raw(
          "INSERT INTO music_instrument_join (`instrument_name`, `music_id`, `order`) VALUES (?, ? , ?)",
          [item.inst2, insertId, 2]
        );
      if (item.inst3)
        await db.raw(
          "INSERT INTO music_instrument_join (`instrument_name`, `music_id`, `order`) VALUES (?, ? , ?)",
          [item.inst3, insertId, 3]
        );
    } catch (e) {
      console.log(e);
    }
  }
}

async function createComposers(data) {
  for (const item of data) {
    try {
      const [result] = await db.raw(
        "SELECT * FROM composer WHERE `lastname` = ?",
        [item.composer]
      );
      if (result.length === 0) {
        const country = item.nationality || "Unknown";
        await db.raw(
          "INSERT INTO composer (`lastname`, `country_name`) VALUES(?, ?)",
          [item.composer, country]
        );
      }
    } catch (e) {
      console.log(e);
    }
  }
}

async function createInstruments(data) {
  for (const item of data) {
    for (const instrument of [item.inst1, item.inst2, item.inst3]) {
      try {
        await db.raw("INSERT INTO instrument (`name`) VALUES(?)", [instrument]);
      } catch (e) {
        // Let it throw an error when already exist
        console.log(e);
      }
    }
  }
}

async function createGenres(data) {
  for (const item of data) {
    try {
      if (item.genre)
        await db.raw("INSERT INTO genre (`name`) VALUES(?)", [item.genre]);
    } catch (e) {
      // Let it throw an error when already exist
      console.log(e);
    }
    try {
      if (item.subgenre)
        await db.raw("INSERT INTO genre (`name`) VALUES(?)", [item.subgenre]);
    } catch (e) {
      // Let it throw an error when already exist
      console.log(e);
    }
  }
}

async function createCountries(data) {
  for (const item of data) {
    if (!item.nationality) continue;
    try {
      const country = item.nationality || "Unknown";
      await db.raw("INSERT INTO country (`name`) VALUES(?)", [country]);
    } catch (e) {
      // Let it throw an error when already exist
      console.log(e);
    }
  }
}
