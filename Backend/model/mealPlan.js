import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekStart: { type: Date, required: true },
  days: [
    {
      date: Date,
      meals: [
        {
          type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
          recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }
        }
      ]
    }
  ],
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

export const MealPlan = mongoose.model('MealPlan', mealPlanSchema); 