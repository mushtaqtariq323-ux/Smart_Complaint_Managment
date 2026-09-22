/**
 * Food library powering the AI diet generator.
 * Macros are per standard portion. veg:true = suitable for vegetarians (eggs included).
 * allergens: dairy | nuts | gluten | eggs | soy | fish | shellfish
 */
export const FOODS = [
  // ── Breakfast ──────────────────────────────────────────────────────
  { id: 'b-oats', name: 'Veggie Oatmeal Bowl', meal: 'breakfast', veg: true, allergens: ['dairy', 'gluten'], portion: '1 bowl (300 g)', kcal: 320, p: 12, c: 52, f: 8 },
  { id: 'b-omelette', name: 'Masala Omelette + Toast', meal: 'breakfast', veg: true, allergens: ['eggs', 'gluten'], portion: '2 eggs + 1 toast', kcal: 300, p: 18, c: 22, f: 16 },
  { id: 'b-poha', name: 'Poha with Peanuts', meal: 'breakfast', veg: true, allergens: ['nuts'], portion: '1 plate (200 g)', kcal: 290, p: 6, c: 48, f: 9 },
  { id: 'b-parfait', name: 'Greek Yogurt Berry Parfait', meal: 'breakfast', veg: true, allergens: ['dairy'], portion: '1 bowl (250 g)', kcal: 280, p: 20, c: 34, f: 8 },
  { id: 'b-paratha', name: 'Whole-Wheat Paratha + Curd', meal: 'breakfast', veg: true, allergens: ['gluten', 'dairy'], portion: '1 paratha + 1 bowl curd', kcal: 380, p: 11, c: 52, f: 14 },
  { id: 'b-smoothie', name: 'Banana Peanut Butter Smoothie', meal: 'breakfast', veg: true, allergens: ['dairy', 'nuts'], portion: '1 tall glass', kcal: 350, p: 14, c: 45, f: 12 },
  { id: 'b-chilla', name: 'Moong Dal Chilla', meal: 'breakfast', veg: true, allergens: [], portion: '2 chillas', kcal: 260, p: 16, c: 34, f: 6 },
  { id: 'b-avotoast', name: 'Scrambled Eggs & Avocado Toast', meal: 'breakfast', veg: true, allergens: ['eggs', 'gluten'], portion: '2 eggs + 1 slice', kcal: 320, p: 18, c: 24, f: 18 },
  { id: 'b-upma', name: 'Vegetable Upma', meal: 'breakfast', veg: true, allergens: ['gluten'], portion: '1 plate (220 g)', kcal: 300, p: 7, c: 50, f: 9 },
  { id: 'b-idli', name: 'Idli (3) + Sambar', meal: 'breakfast', veg: true, allergens: [], portion: '3 idli + 1 bowl sambar', kcal: 290, p: 10, c: 55, f: 4 },
  // ── Lunch ──────────────────────────────────────────────────────────
  { id: 'l-chickensalad', name: 'Grilled Chicken Salad', meal: 'lunch', veg: false, allergens: [], portion: '1 large bowl', kcal: 380, p: 38, c: 18, f: 16 },
  { id: 'l-dalrice', name: 'Dal, Brown Rice & Veg Curry', meal: 'lunch', veg: true, allergens: [], portion: '1 thali plate', kcal: 520, p: 18, c: 82, f: 12 },
  { id: 'l-paneerroti', name: 'Paneer Bhurji + Roti', meal: 'lunch', veg: true, allergens: ['dairy', 'gluten'], portion: '2 roti + 100 g paneer', kcal: 480, p: 22, c: 56, f: 18 },
  { id: 'l-quinoa', name: 'Quinoa Chickpea Bowl', meal: 'lunch', veg: true, allergens: [], portion: '1 bowl', kcal: 430, p: 16, c: 64, f: 12 },
  { id: 'l-biryani', name: 'Chicken Biryani (light oil)', meal: 'lunch', veg: false, allergens: [], portion: '1 plate', kcal: 550, p: 28, c: 72, f: 14 },
  { id: 'l-fishcurry', name: 'Fish Curry + Rice', meal: 'lunch', veg: false, allergens: ['fish'], portion: '1 plate', kcal: 480, p: 30, c: 60, f: 12 },
  { id: 'l-rajma', name: 'Rajma + Rice + Salad', meal: 'lunch', veg: true, allergens: [], portion: '1 plate', kcal: 510, p: 18, c: 86, f: 8 },
  { id: 'l-eggfriedrice', name: 'Egg Fried Rice (brown)', meal: 'lunch', veg: true, allergens: ['eggs'], portion: '1 plate', kcal: 470, p: 20, c: 62, f: 14 },
  { id: 'l-chickenwrap', name: 'Chicken Whole-Wheat Wrap', meal: 'lunch', veg: false, allergens: ['gluten'], portion: '1 wrap', kcal: 420, p: 30, c: 42, f: 14 },
  { id: 'l-soypulao', name: 'Soy Chunk Pulao', meal: 'lunch', veg: true, allergens: ['soy'], portion: '1 plate', kcal: 450, p: 24, c: 68, f: 10 },
  { id: 'l-chole', name: 'Chole + 2 Roti', meal: 'lunch', veg: true, allergens: ['gluten'], portion: '1 bowl + 2 roti', kcal: 500, p: 19, c: 78, f: 12 },
  { id: 'l-tunawrap', name: 'Tuna Salad Wrap', meal: 'lunch', veg: false, allergens: ['fish', 'gluten'], portion: '1 wrap', kcal: 390, p: 32, c: 34, f: 14 },
  // ── Dinner ─────────────────────────────────────────────────────────
  { id: 'd-salmon', name: 'Grilled Salmon + Veggies', meal: 'dinner', veg: false, allergens: ['fish'], portion: '1 plate', kcal: 420, p: 32, c: 20, f: 22 },
  { id: 'd-paneertikka', name: 'Paneer Tikka + Salad', meal: 'dinner', veg: true, allergens: ['dairy'], portion: '1 plate (150 g paneer)', kcal: 360, p: 24, c: 18, f: 20 },
  { id: 'd-stirfry', name: 'Chicken Stir-Fry + Brown Rice', meal: 'dinner', veg: false, allergens: ['soy'], portion: '1 plate', kcal: 480, p: 34, c: 56, f: 12 },
  { id: 'd-daltadka', name: 'Dal Tadka + Jeera Rice', meal: 'dinner', veg: true, allergens: [], portion: '1 plate', kcal: 460, p: 16, c: 74, f: 10 },
  { id: 'd-soupsandwich', name: 'Veg Soup + Grilled Sandwich', meal: 'dinner', veg: true, allergens: ['gluten', 'dairy'], portion: '1 serving', kcal: 380, p: 14, c: 48, f: 14 },
  { id: 'd-eggcurry', name: 'Egg Curry + 2 Roti', meal: 'dinner', veg: true, allergens: ['eggs', 'gluten'], portion: '2 eggs + 2 roti', kcal: 440, p: 20, c: 48, f: 18 },
  { id: 'd-tofubowl', name: 'Tofu Veggie Rice Bowl', meal: 'dinner', veg: true, allergens: ['soy'], portion: '1 bowl', kcal: 390, p: 20, c: 44, f: 16 },
  { id: 'd-prawnpasta', name: 'Prawn Garlic Pasta (whole-wheat)', meal: 'dinner', veg: false, allergens: ['shellfish', 'gluten'], portion: '1 plate', kcal: 470, p: 28, c: 60, f: 12 },
  { id: 'd-stuffedpepper', name: 'Stuffed Bell Peppers + Quinoa', meal: 'dinner', veg: true, allergens: [], portion: '2 peppers', kcal: 350, p: 14, c: 46, f: 12 },
  { id: 'd-chickensoup', name: 'Chicken & Veg Clear Soup', meal: 'dinner', veg: false, allergens: [], portion: '1 large bowl', kcal: 300, p: 26, c: 24, f: 10 },
  { id: 'd-khichdi', name: 'Moong Dal Khichdi + Curd', meal: 'dinner', veg: true, allergens: ['dairy'], portion: '1 bowl + curd', kcal: 400, p: 17, c: 62, f: 9 },
  { id: 'd-chickentikka', name: 'Chicken Tikka (grilled) + Salad', meal: 'dinner', veg: false, allergens: ['dairy'], portion: '200 g chicken', kcal: 380, p: 40, c: 12, f: 18 },
  // ── Snacks ─────────────────────────────────────────────────────────
  { id: 's-chana', name: 'Roasted Chana', meal: 'snacks', veg: true, allergens: [], portion: '1 cup', kcal: 160, p: 9, c: 26, f: 2 },
  { id: 's-fruitnut', name: 'Fruit & Nut Mix', meal: 'snacks', veg: true, allergens: ['nuts'], portion: '1 small bowl', kcal: 200, p: 5, c: 20, f: 12 },
  { id: 's-sprouts', name: 'Sprouts Chaat', meal: 'snacks', veg: true, allergens: [], portion: '1 cup', kcal: 180, p: 10, c: 30, f: 2 },
  { id: 's-shake', name: 'Banana Protein Shake', meal: 'snacks', veg: true, allergens: ['dairy'], portion: '1 glass', kcal: 240, p: 20, c: 30, f: 4 },
  { id: 's-ricecake', name: 'Peanut Butter Rice Cakes', meal: 'snacks', veg: true, allergens: ['nuts'], portion: '2 cakes', kcal: 190, p: 6, c: 26, f: 8 },
  { id: 's-eggs', name: 'Boiled Eggs', meal: 'snacks', veg: true, allergens: ['eggs'], portion: '2 eggs', kcal: 140, p: 12, c: 2, f: 10 },
  { id: 's-curdflax', name: 'Curd with Flaxseed', meal: 'snacks', veg: true, allergens: ['dairy'], portion: '1 bowl', kcal: 150, p: 9, c: 14, f: 6 },
  { id: 's-dates', name: 'Dates + Almonds', meal: 'snacks', veg: true, allergens: ['nuts'], portion: '3 dates + 8 almonds', kcal: 210, p: 5, c: 28, f: 9 },
  { id: 's-hummus', name: 'Hummus + Carrot Sticks', meal: 'snacks', veg: true, allergens: [], portion: '1 serving', kcal: 180, p: 6, c: 22, f: 8 },
  { id: 's-buttermilk', name: 'Masala Buttermilk (Chaas)', meal: 'snacks', veg: true, allergens: ['dairy'], portion: '1 glass', kcal: 70, p: 4, c: 7, f: 2 },
]

/** Simple allergen synonym lookup so free-text allergies filter correctly */
export const ALLERGEN_SYNONYMS = {
  milk: 'dairy', dairy: 'dairy', curd: 'dairy', yogurt: 'dairy', yoghurt: 'dairy', cheese: 'dairy', paneer: 'dairy', butter: 'dairy', ghee: 'dairy', cream: 'dairy', lactose: 'dairy',
  nut: 'nuts', nuts: 'nuts', peanut: 'nuts', peanuts: 'nuts', almond: 'nuts', almonds: 'nuts', cashew: 'nuts', cashews: 'nuts', walnut: 'nuts', walnuts: 'nuts',
  gluten: 'gluten', wheat: 'gluten', bread: 'gluten', roti: 'gluten', oats: 'gluten', pasta: 'gluten', maida: 'gluten',
  egg: 'eggs', eggs: 'eggs',
  soy: 'soy', soya: 'soy', tofu: 'soy',
  fish: 'fish', tuna: 'fish', salmon: 'fish',
  shellfish: 'shellfish', shrimp: 'shellfish', prawn: 'shellfish', prawns: 'shellfish', crab: 'shellfish', lobster: 'shellfish',
}
