const mongoose = require('mongoose')

const ipInventorySchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    purpose: {
      type: String,
      required: true,
      trim: true
    },
    group: {
      type: String,
      default: 'Без группы',
      trim: true
    },
    status: {
      type: String,
      enum: ['Активный', 'Резерв', 'Отключен'],
      default: 'Активный'
    },
    hostname: {
      type: String,
      default: '',
      trim: true
    },
    location: {
      type: String,
      default: '',
      trim: true
    },
    owner: {
      type: String,
      default: '',
      trim: true
    },
    vlan: {
      type: String,
      default: '',
      trim: true
    },
    subnet: {
      type: String,
      default: '',
      trim: true
    },
    notes: {
      type: String,
      default: '',
      trim: true
    },
    lastSeen: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

const IPRecord = mongoose.model('IPRecord', ipInventorySchema)

module.exports = IPRecord
