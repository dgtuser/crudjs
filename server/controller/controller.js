const IPRecord = require('../model/model')

const parseCsvLine = (line) => {
  const fields = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]

    if (char === '"') {
      const next = line[i + 1]
      if (inQuotes && next === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      fields.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  fields.push(current.trim())
  return fields
}

const normalizeDate = (value) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const mapPayload = (body) => ({
  ip: body.ip,
  name: body.name,
  purpose: body.purpose,
  group: body.group || 'Без группы',
  status: body.status || 'Активный',
  hostname: body.hostname || '',
  location: body.location || '',
  owner: body.owner || '',
  vlan: body.vlan || '',
  subnet: body.subnet || '',
  notes: body.notes || '',
  lastSeen: normalizeDate(body.lastSeen)
})

exports.create = async (req, res) => {
  try {
    if (!req.body?.ip || !req.body?.name || !req.body?.purpose) {
      return res.status(400).send('IP, имя и назначение обязательны')
    }

    await IPRecord.create(mapPayload(req.body))
    return res.redirect('/')
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

exports.update = async (req, res) => {
  try {
    const { id } = req.params
    await IPRecord.findByIdAndUpdate(id, mapPayload(req.body), { runValidators: true })
    return res.redirect('/')
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    await IPRecord.findByIdAndDelete(id)
    return res.redirect('/')
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

exports.importCsv = async (req, res) => {
  try {
    if (!req.body?.csvContent) {
      return res.status(400).send('CSV содержимое не найдено')
    }

    const csvText = req.body.csvContent.replace(/\r/g, '')
    const rows = csvText.split('\n').filter(Boolean)

    if (!rows.length) {
      return res.status(400).send('CSV файл пустой')
    }

    const header = parseCsvLine(rows[0]).map((col) => col.trim())
    const records = []

    for (let i = 1; i < rows.length; i += 1) {
      const values = parseCsvLine(rows[i])
      if (!values.length || !values[0]) continue

      const rowObj = {}
      header.forEach((key, idx) => {
        rowObj[key] = values[idx] || ''
      })

      if (!rowObj.ip || !rowObj.name || !rowObj.purpose) continue
      records.push(mapPayload(rowObj))
    }

    if (!records.length) {
      return res.status(400).send('Не найдено валидных строк для импорта')
    }

    await IPRecord.insertMany(records, { ordered: false })
    return res.redirect('/')
  } catch (err) {
    return res.status(500).send(`Ошибка импорта: ${err.message}`)
  }
}
