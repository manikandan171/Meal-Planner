import { MealPlan } from '../model/mealPlan.js';

export const getMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ user: req.user.id });
    res.json(mealPlans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createMealPlan = async (req, res) => {
  try {
    const mealPlan = new MealPlan({ ...req.body, user: req.user.id });
    await mealPlan.save();
    res.status(201).json(mealPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!mealPlan) return res.status(404).json({ message: 'Meal plan not found' });
    res.json(mealPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!mealPlan) return res.status(404).json({ message: 'Meal plan not found' });
    res.json({ message: 'Meal plan deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSharedMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ sharedWith: req.user.id });
    res.json(mealPlans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const shareMealPlan = async (req, res) => {
  try {
    const { mealPlanId, userId } = req.body;
    const mealPlan = await MealPlan.findByIdAndUpdate(
      mealPlanId,
      { $addToSet: { sharedWith: userId } },
      { new: true }
    );
    res.json(mealPlan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 