import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
    {
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
    },
    {
      timestamps: true,
    }
  );

const macroSchema = new mongoose.Schema(
  {
    calories: { type: Number, required: true }, // Calories per serving
    protein: { type: Number, required: true }, // Protein in grams
    fat: { type: Number, required: true }, // Fat in grams
    carbohydrates: { type: Number, required: true }, // Carbohydrates in grams
    fiber: { type: Number }, // Fiber in grams
    sugar: { type: Number }, // Sugar in grams
  },
  {
    timestamps: true,
  }
);

// Removed duplicate declaration of Macro

const foodSchema = new mongoose.Schema(
  {
    fdcId: { type: Number, required: true, unique: true }, // Unique USDA Food Data ID
    description: { type: String, required: true }, // Food name/description
    brandOwner: { type: String }, // Brand name
    marketCountry: { type: String }, // Country where the product is sold
    gtinUpc: { type: String, unique: true, sparse: true }, // Barcode / UPC code
    ingredients: { type: String }, // Ingredients list
    servingSize: { type: Number, required: true }, // Default serving size
    servingSizeUnit: { type: String, required: true }, // Unit of serving (e.g., g, ml)
    householdServingFullText: { type: String }, // Text for common serving size
    brandedFoodCategory: { type: String }, // Category of the food item
    publicationDate: { type: Date }, // Date when data was published
    image: { type: String }, // URL for food image
    // Reference to the Macro model
    macros: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Macro',
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Food = mongoose.model('Food', foodSchema);
const Macro = mongoose.model('Macro', macroSchema);

export default Food;
export { Macro };
  