const IPRecord = require('../model/model')

exports.homeRoutes = async (req, res) => {
  try {
    const { q = '', group = '', status = '' } = req.query
    const filter = {}

    if (group) filter.group = group
    if (status) filter.status = status

    if (q) {
      const regex = new RegExp(q, 'i')
      filter.$or = [
        { ip: regex },
        { name: regex },
        { purpose: regex },
        { hostname: regex },
        { owner: regex },
        { location: regex },
        { notes: regex }
      ]
    }

    const [records, groups] = await Promise.all([
      IPRecord.find(filter).sort({ group: 1, ip: 1 }).lean(),
      IPRecord.distinct('group')
    ])

    const groupedRecords = records.reduce((acc, record) => {
      const key = record.group || 'Без группы'
      if (!acc[key]) acc[key] = []
      acc[key].push(record)
      return acc
    }, {})

    const stats = {
      total: records.length,
      active: records.filter((item) => item.status === 'Активный').length,
      reserve: records.filter((item) => item.status === 'Резерв').length,
      disabled: records.filter((item) => item.status === 'Отключен').length
    }

    res.render('index', {
      groupedRecords,
      groups: groups.filter(Boolean).sort(),
      query: { q, group, status },
      stats
    })
  } catch (err) {
    res.status(500).send(err.message)
  }
}

exports.addRoutes = (req, res) => {
  res.render('add__user', { record: null })
}

exports.updateRoutes = async (req, res) => {
  try {
    const { id } = req.params
    const record = await IPRecord.findById(id).lean()

    if (!record) {
      return res.status(404).send('Запись не найдена')
    }

    return res.render('update', { record })
  } catch (err) {
    return res.status(500).send(err.message)
  }
}
