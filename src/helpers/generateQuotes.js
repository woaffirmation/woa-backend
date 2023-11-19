const sequelize = require('../config/db.config')

const generateQuotes = async () => {
  let quotes = []
  const [availableQuotes] = await sequelize.query('SELECT id_quotes FROM quotes WHERE status = ?', {
    replacements: [false]
  })

  quotes.push(...availableQuotes)
  const quotesId = quotes.map((quote) => quote.id_quotes)
  return quotesId[Math.floor((Math.random() * quotesId.length))];
}

module.exports = { generateQuotes }