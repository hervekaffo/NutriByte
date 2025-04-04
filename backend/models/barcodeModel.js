import mongoose from 'mongoose';

const barcodeSchema = new mongoose.Schema({
    barcode: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    macros: {
      protein: { type: Number, required: true },
      carbs: { type: Number, required: true },
      fats: { type: Number, required: true }
    },
    brand: { type: String },
    source: { type: String, enum: ['USDA', 'OpenFoodFacts'], required: true }
  });
  
  module.exports = mongoose.model('Barcode', barcodeSchema);
  