/**
 * AI Coach engine — 100% client-side, no external AI provider, no API keys.
 * Understands English, Urdu (script + Roman) and Sindhi (Roman) and always
 * replies in the same language/style the user typed. Answers are grounded in
 * the authenticated user's saved fitness profile, plans and progress.
 */

/* ---------------------------- language detection ---------------------------- */

const URDU_ROMAN_WORDS = new Set(['aaj', 'aap', 'ap', 'hai', 'hain', 'kya', 'kia', 'kaise', 'kaisay', 'kyun', 'mera', 'meri', 'mujhe', 'mujhay', 'kitna', 'kitni', 'batao', 'bata', 'karo', 'karna', 'karein', 'chahiye', 'chaiye', 'nahi', 'nh', 'haan', 'acha', 'achha', 'khana', 'khaana', 'khao', 'paani', 'pani', 'wazan', 'sehat', 'warzish', 'kasrat', 'subah', 'raat', 'roz', 'kal', 'bohat', 'bahut', 'hua', 'liye', 'liya', 'kiya', 'thak', 'gayi', 'gyi', 'gaya', 'madad', 'shukriya', 'bhai', 'behtar', 'tarika', 'rozana', 'munasib', 'kitne', 'kitni', 'rakhna', 'jaldi', 'din'])
const SINDHI_ROMAN_WORDS = new Set(['aahay', 'aahai', 'ahe', 'tawhan', 'tawhando', 'tawhanjo', 'munhinjo', 'munhijo', 'mokhe', 'mokhanje', 'bhali', 'vadhay', 'wadhay', 'thindo', 'thinda', 'pinue', 'piaae', 'sagho', 'saghi', 'chhTaghaar', 'chha', 'maanh', 'moon', 'ghareeb', 'sehatmand', 'mashqoon', 'rajuwa', 'kaju', 'khapi', 'aaoon'])

export function detectLanguage(text) {
  const t = String(text || '')
  if (/[\u0600-\u06FF]/.test(t)) return 'ur-script'
  const tokens = t.toLowerCase().replace(/[^a-z\s']/g, ' ').split(/\s+/).filter(Boolean)
  let ur = 0, sd = 0
  tokens.forEach((w) => {
    if (URDU_ROMAN_WORDS.has(w)) ur += 1
    if (SINDHI_ROMAN_WORDS.has(w)) sd += 2
  })
  if (sd >= 2 && sd >= ur) return 'sd-roman'
  if (ur >= 2) return 'ur-roman'
  return 'en'
}

/* ---------------------------- intent detection ------------------------------ */

const tokenize = (text) => String(text || '').toLowerCase().replace(/[^a-z\u0600-\u06FF\s']/g, ' ').split(/\s+/).filter(Boolean)
const hasAny = (tokens, words) => words.some((w) => tokens.includes(w))

export function detectIntent(text) {
  const tokens = tokenize(text)
  const joined = tokens.join(' ')
  const workoutWords = ['workout', 'exercise', 'exercises', 'warzish', 'kasrat', 'training', 'mashq', 'warmup', 'ورکاؤٹ', 'ورزش', 'مشق']
  const timeWords = ['today', "today's", 'aaj', 'abhi', 'current', 'آج']
  const foodWords = ['eat', 'khana', 'khaana', 'khao', 'khano', 'khayu', 'khanu', 'diet', 'food', 'meal', 'meals', 'nutrition', 'bhojan', 'roti', 'lunch', 'dinner', 'breakfast', 'nashta', 'snack', 'khurak', 'khaana', 'کھانا', 'کھانے', 'غذا', 'ناشتہ']
  const planWords = ['plan', 'routine', 'schedule', 'split', 'پلان']

  if (hasAny(tokens, ['thanks', 'thank', 'shukriya', 'meharbani', 'mehrbani', 'tashakor', 'شکریہ', 'مہربانی'])) return 'thanks'
  if (/^(hi+|hey|hello|salam|assalam|asalam|aoa|namaste|adab)\b/.test(joined) || hasAny(tokens, ['salam', 'assalamoalaikum', 'assalamualaikum', 'سلام', 'السلام', 'hello', 'hii'])) return 'greeting'
  if (hasAny(tokens, ['beginner', 'naya', 'nayi', 'shuru', 'start', 'starter', 'نئی', 'شروع']) && hasAny(tokens, [...workoutWords, 'ghar', 'home', 'گھر'])) return 'workout_beginner'
  if (hasAny(tokens, timeWords) && hasAny(tokens, workoutWords)) return 'workout_today'
  if (hasAny(tokens, [...workoutWords, ...planWords]) && !hasAny(tokens, foodWords)) return 'plan'
  if (hasAny(tokens, foodWords)) return 'diet'
  if (hasAny(tokens, ['calorie', 'calories', 'cal', 'tdee', 'energy', 'کیلوری', 'کیلوریز'])) return 'calories'
  if (hasAny(tokens, ['protein', 'پروٹین'])) return 'protein'
  if (hasAny(tokens, ['bmi', 'بی ایم آئی'])) return 'bmi'
  if (hasAny(tokens, ['water', 'paani', 'pani', 'hydrated', 'hydration', 'پانی'])) return 'water'
  if (hasAny(tokens, ['consistency', 'consistent', 'regular', 'regularly', 'motivation', 'motivate', 'stick', 'skip', 'missed', 'miss', 'discipline', 'himmat', 'hosla', 'lagatar', 'yaad', 'تسلسل', 'حوصلہ'])) return 'consistency'
  if (hasAny(tokens, ['streak', 'اسٹریک'])) return 'streak'
  if (hasAny(tokens, ['sleep', 'neend', 'insomnia', 'نیند'])) return 'sleep'
  if (hasAny(tokens, ['weight', 'wazan', 'vazan', 'lose', 'loss', 'gain', 'kam', 'badhana', 'وزن'])) return 'weight'
  if (hasAny(tokens, ['help', 'madad', 'options', 'مدد', 'what', 'kya'])) return 'help'
  return 'fallback'
}

/* ---------------------------- response templates ---------------------------- */

const fill = (tpl, ctx) => tpl.replace(/\{(\w+)\}/g, (_, k) => (ctx[k] != null ? String(ctx[k]) : '—'))

const T = {
  greeting: {
    en: `Hey {name}! 👋 I'm your AI Fitness Coach.\nI can plan your workouts, suggest meals, explain your BMI and calories, and keep you motivated. What would you like to do today?`,
    urRoman: `Assalam-o-Alaikum, {name}! 👋 Main aap ka AI Fitness Coach hoon.\nMain aap ki workout plan, khane ka mashwara, BMI aur calories samjha sakta hoon, aur aap ko motivate bhi kar sakta hoon. Bataiye, aaj kya karna hai?`,
    'ur-script': `السلام علیکم {name}! 👋 میں آپ کا اے آئی فٹنس کوچ ہوں۔\nمیں آپ کی ورکاؤٹ پلان، کھانے کا مشورہ، بی ایم آئی اور کیلوریز سمجھا سکتا ہوں، اور آپ کو حوصلہ بھی دے سکتا ہوں۔ بتائیے، آج کیا کرنا ہے؟`,
    'sd-roman': `Assalam O Alaikum, {name}! 👋 Moon tawhan jo AI Fitness Coach aahyan.\nMoon tawhan khe workout plan, khane jo mashwaro, BMI te calories cha samjhaee sagho. Tawhan kare madad kare sagho?`,
  },
  workout_today: {
    en: (c) => (c.isRestDay
      ? `Today is your **recovery day**, {name}! 😌\n${c.restSuggestion}\nConsistency needs rest too — you'll crush tomorrow's session.`
      : `Here's today's plan, {name}! 💪\n**{workout}** — {duration} min · {count} exercises · {difficulty}\nStarting exercise: {firstExercise}\nOpen the Workout page and tap **Start Workout** — you've got this!`),
    urRoman: (c) => (c.isRestDay
      ? `Aaj aap ka **rest day** hai, {name}! 😌\n${c.restSuggestion}\nAaram bhi consistency ka hissa hai — kal ki workout khoob jams ke karna!`
      : `Aaj ka plan hazir hai, {name}! 💪\n**{workout}** — {duration} minute · {count} exercises · {difficulty}\nPehli exercise: {firstExercise}\nWorkout page par jaa kar **Start Workout** dabaiye — aap kar loge!`),
    'ur-script': (c) => (c.isRestDay
      ? `آج آپ کا **آرام کا دن** ہے، {name}! 😌\n${c.restSuggestion}\nآرام بھی تسلسل کا حصہ ہے — کل کی ورکاؤٹ شاندار کرنا!`
      : `آج کا پلان حاضر ہے، {name}! 💪\n**{workout}** — {duration} منٹ · {count} مشقیں · {difficulty}\nپہلی مشق: {firstExercise}\nورکاؤٹ پیج پر جا کر **Start Workout** دبائیے — آپ یہ کر سکتے ہیں!`),
    'sd-roman': (c) => (c.isRestDay
      ? `Tawhan jo aaj **aaram jo din** aahay, {name}! 😌\n${c.restSuggestion}\nAaram bi consistency jo hisso aahay — subhe workout khoob kaju!`
      : `Aaj jo plan hazir aahay, {name}! 💪\n**{workout}** — {duration} minute · {count} mashqoon · {difficulty}\nPohinji mashq: {firstExercise}\nWorkout page khe wanjho te **Start Workout** dabayo — tawhan khe sagh saan!`),
  },
  workout_beginner: {
    en: `Great choice, {name}! For a beginner I'd keep it simple:\n1. **Warm-up** — 5 min marching + arm circles\n2. **Bodyweight Squats** — 3 × 12\n3. **Knee Push-ups** — 3 × 10\n4. **Glute Bridges** — 3 × 12\n5. **Front Plank** — 3 × 30 sec\n6. **Stretch** — 5 min\nRest 60 sec between exercises. Your full personalized plan is on the Workout page!`,
    urRoman: `Zabardast choice, {name}! Beginner ke liye simple rakhein:\n1. **Warm-up** — 5 min marching + arm circles\n2. **Bodyweight Squats** — 3 × 12\n3. **Knee Push-ups** — 3 × 10\n4. **Glute Bridges** — 3 × 12\n5. **Front Plank** — 3 × 30 sec\n6. **Stretch** — 5 min\nHar exercise ke darmiyan 60 sec rest. Aap ka mukammal plan Workout page par mojood hai!`,
    'ur-script': `زبردست انتخاب، {name}! ابتدائی level کے لیے آسان رکھیں:\n1. **Warm-up** — 5 منٹ\n2. **Bodyweight Squats** — 3 × 12\n3. **Knee Push-ups** — 3 × 10\n4. **Glute Bridges** — 3 × 12\n5. **Front Plank** — 3 × 30 سیکنڈ\n6. **Stretch** — 5 منٹ\nہر مشق کے درمیان 60 سیکنڈ آرام۔ آپ کا مکمل پلان Workout پیج پر موجود ہے!`,
    'sd-roman': `Sutho choice, {name}! beginner khe liye asaan rakho:\n1. **Warm-up** — 5 minute\n2. **Bodyweight Squats** — 3 × 12\n3. **Knee Push-ups** — 3 × 10\n4. **Glute Bridges** — 3 × 12\n5. **Front Plank** — 3 × 30 second\n6. **Stretch** — 5 minute\nDar dar vaghair 60 second aaram. Tawhan jo mukammal plan Workout page te aahay!`,
  },
  plan: {
    en: (c) => `Your weekly plan is built for **{goal}** ({preference}, {experience} level).\nYou train **{weeklyTarget}× per week**, and sessions run about {avgDuration} min.\nCheck the Workout page for the full split, and use **Replace Exercise** anytime something doesn't suit you. 🔁`,
    urRoman: (c) => `Aap ka hafte wala plan **{goal}** ke liye banaya gaya hai ({preference}, {experience} level).\nHafte mein **{weeklyTarget} din** workout hai, aur session taqreeban {avgDuration} minute ka hota hai.\nPura split Workout page par dekhein, aur kahin exercise suit na kare to **Replace Exercise** use karein. 🔁`,
    'ur-script': (c) => `آپ کا ہفتہ وار پلان **{goal}** کے لیے بنایا گیا ہے ({preference}، {experience} لیول)۔\nہفتے میں **{weeklyTarget} دن** ورکاؤٹ ہے، اور سیشن تقریباً {avgDuration} منٹ کا ہوتا ہے۔\nپورا اسپلٹ Workout پیج پر دیکھیں، اور کھنچتی مشق بدلنے کے لیے **Replace Exercise** استعمال کریں۔ 🔁`,
    'sd-roman': (c) => `Tawhan jo hafto plan **{goal}** khe liye banyo aahay ({preference}، {experience} level).\nHafte mein **{weeklyTarget} din** workout aahay, te session taqreeban {avgDuration} minute jero aahay.\nPoora split Workout page te mandho, te exercise badlarni khe liye **Replace Exercise** istemaal kaju. 🔁`,
  },
  diet: {
    en: (c) => `For **{goal}**, aim for about **{calories} kcal/day** — {protein}g protein, {carbs}g carbs and {fats}g fats. 🍽️\nA simple day: never skip breakfast, keep lunch your biggest meal, eat a light dinner 2–3 hours before bed, and snack on fruit, yogurt or roasted chana.\nYour full meal plan (matched to your {preferenceAll} preference${c.hasAllergies ? ' and allergies' : ''}) is on the Diet page!`,
    urRoman: (c) => `**{goal}** ke liye roz taqreeban **{calories} kcal** lein — {protein}g protein, {carbs}g carbs aur {fats}g fats. 🍽️\nAsaan usool: nashta kabhi na chhorein, lunch sab se bara khana ho, raat ka khana halka aur sone se 2–3 ghante pehle, aur snack mein fruit, yogurt ya bhuna chana rakhein.\nAap ka poora meal plan (aap ki ${c.preferenceAll.toLowerCase()} preference${c.hasAllergies ? ' aur allergy' : ''} ke mutabiq) Diet page par hai!`,
    'ur-script': (c) => `**{goal}** کے لیے روزانہ تقریباً **{calories} کیلوریز** لیں — {protein} جی پروٹین، {carbs} جی کاربز اور {fats} جی فٹس۔ 🍽️\nآسان اصول: ناشتہ کبھی نہ چھوڑیں، lunch سب سے بڑا کھانا ہو، رات کا کھانا ہلکا اور سونے سے 2–3 گھنٹے پہلے، اور اسنیک میں پھل، دہی یا بھنا چنا رکھیں۔\nآپ کا پورا meal plan ڈائیٹ پیج پر موجود ہے!`,
    'sd-roman': (c) => `**{goal}** khe liye roz taqreeban **{calories} kcal** khayo — {protein}g protein، {carbs}g carbs te {fats}g fats. 🍽️\nAasan usool: nashto kaden na chhodo، lunch sab khe wadho khana huvay، raat jo khano halko te sumbha piyan 2–3 kanta pehelu، te snack mein phal، yogurt ya bharela chana.\nTawhan jo poora meal plan Diet page te aahay!`,
  },
  calories: {
    en: (c) => `Your estimated daily requirement is **{calories} kcal** (based on your age, height, weight and {activity} lifestyle). ⚡\nToday you've logged {consumed} kcal — ${c.todayPct}% of your target. Remember, these are general wellness estimates, not medical numbers.`,
    urRoman: `Aap ki rozana zaroorat taqreeban **{calories} kcal** hai (umar, height, weight aur {activity} lifestyle ke hisaab se). ⚡\nAaj aap ne {consumed} kcal log kiye hain — target ka {todayPct}%. Yaad rahe, ye umoomi wellness andaza hai, medical number nahi.`,
    'ur-script': `آپ کی روزانہ ضرورت تقریباً **{calories} کیلوریز** ہے (عمر، قد، وزن اور {activity} طرزِ زندگی کے حساب سے)۔ ⚡\nآج آپ نے {consumed} کیلوریز لاگ کی ہیں — ہدف کا {todayPct}%۔ یاد رہے، یہ عمومی تخمینہ ہے، میڈیکل نمبر نہیں۔`,
    'sd-roman': `Tawhan ji rozana zaroorat taqreeban **{calories} kcal** aahay (umar، height، weight te {activity} lifestyle khe hisaab khan). ⚡\nAaj tawhan {consumed} kcal log kaya aahin — target jo {todayPct}%. Khayal rajuwa، hora aam andazo aahay، medical number nahi.`,
  },
  protein: {
    en: (c) => `Protein is your best friend for **{goal}**! 💪 Aim for **{protein}g per day** — roughly {perMeal}g per meal.\nGood sources: eggs, chicken, fish, dal, paneer, yogurt, soy chunks and whey if you use it. Spread it across the day for best results.`,
    urRoman: `**{goal}** ke liye protein sab se zaroori hai! 💪 Roz **{protein}g** ka target rakhein — taqreeban {perMeal}g har meal mein.\nAche sources: ande, chicken, fish, dal, paneer, dahi, soy chunks, aur whey bhi. Din bhar mein phaila kar lein — behtar nateeja milega.`,
    'ur-script': `**{goal}** کے لیے پروٹین سب سے ضروری ہے! 💪 روز **{protein} گرام** کا ہدف رکھیں — تقریباً {perMeal} گرام ہر کھانے میں۔\nاچھے ذرائع: انڈے، چکن، فش، دال، پنیر، دہی، سوی چنکس اور وے بھی۔ دن بھر میں پھیلا کر لیں۔`,
    'sd-roman': `**{goal}** khe liye protein sab khe zaroori aahay! 💪 Roz **{protein}g** jo target rakho — taqreeban {perMeal}g dar meal mein.\nSutha source: aana، chicken، fish، dal، paneer، dahi، soy chunks te whey. Din bhar mein pheray khayo.`,
  },
  weight: {
    en: (c) => `You're currently at **{weight} kg**${c.goalWeight ? ` with a goal of **{goalWeight} kg**` : ''}. ⚖️\nA safe pace is 0.25–0.5 kg per week. Small daily wins — hitting your calorie target and finishing workouts — matter far more than crash diets. Your BMI is {bmi} ({bmiCategory}).`,
    urRoman: (c) => `Aap ka wazan filhal **{weight} kg** hai${c.goalWeight ? ' aur goal **{goalWeight} kg** hai' : ''}. ⚖️\nMahfooz raftaar hafte mein 0.25–0.5 kg hai. Roz ke chote kaam — calories target pura karna aur workout khatam karna — crash diet se kahin behtar hain. Aap ka BMI {bmi} ({bmiCategory}) hai.`,
    'ur-script': (c) => `آپ کا وزن فی الحال **{weight} کلوگرام** ہے${c.goalWeight ? ' اور ہدف **{goalWeight} کلوگرام** ہے' : ''}۔ ⚖️\nمحفوظ رفتار ہفتے میں 0.25–0.5 کلوگرام ہے۔ روز کے چھوٹے کام — کیلوری ٹارگٹ پورا کرنا اور ورکاؤٹ ختم کرنا — کریش ڈائٹ سے کہیں بہتر ہیں۔ آپ کا BMI {bmi} ({bmiCategory}) ہے۔`,
    'sd-roman': (c) => `Tawhan jo wazan hal **{weight} kg** aahay${c.goalWeight ? ' te target **{goalWeight} kg** aahay' : ''}. ⚖️\nMahfooz raftar hafte mein 0.25–0.5 kg aahay. Roz jo nhanjo kaam — calorie target poora karan te workout mukammal karan — crash diet khan bi sutha aahin. Tawhan jo BMI {bmi} ({bmiCategory}) aahay.`,
  },
  bmi: {
    en: (c) => `Your BMI is **{bmi}** — that falls in the **{bmiCategory}** range. 📊\nBMI is a simple height-to-weight screen, not a diagnosis. For a fuller picture, check the Body Analysis page — it also shows your healthy weight range and daily calorie needs.`,
    urRoman: `Aap ka BMI **{bmi}** hai — ye **{bmiCategory}** range mein aata hai. 📊\nBMI sirf height-weight ka aasan hisaab hai, koi tashkhees nahi. Mukammal tasveer ke liye Body Analysis page dekhein — wahan healthy weight range aur rozana calorie zaroorat bhi hai.`,
    'ur-script': `آپ کا BMI **{bmi}** ہے — یہ **{bmiCategory}** رینج میں آتا ہے۔ 📊\nBMI صرف قد-وزن کا آسان حساب ہے، کوئی تشخیص نہیں۔ مکمل تصویر کے لیے Body Analysis پیج دیکھیں — وہاں صحت مند وزن کی رینج اور روزانہ کیلوری کی ضرورت بھی ہے۔`,
    'sd-roman': `Tawhan jo BMI **{bmi}** aahay — hora **{bmiCategory}** range mein aachay tho. 📊\nBMI sirf height-weight jo aasan hisaab aahay، koi tashkhees nahi. Poorma tasveer khe liye Body Analysis page mandho.`,
  },
  water: {
    en: (c) => `Hydration check! 💧 With your activity level, aim for roughly **{water} liters a day** — more on workout days.\nEasy trick: a glass of water before every meal, and keep a bottle on your desk. Often "hungry" is actually "thirsty"!`,
    urRoman: `Paani yaad hai? 💧 Aap ki activity ke hisaab se roz taqreeban **{water} liter** pani piyein — workout wale din aur bhi.\nAasan tareeqa: har khane se pehle ek glass pani, aur bottle saamne rakhein. Aksar "bhook" dar-asal "pyas" hoti hai!`,
    'ur-script': `پانی یاد ہے؟ 💧 آپ کی activity کے حساب سے روز تقریباً **{water} لیٹر** پانی پئیں — ورکاؤٹ والے دن اور بھی۔\nآسان طریقہ: ہر کھانے سے پہلے ایک گلاس پانی، اور بوتل سامنے رکھیں۔ اکثر "بھوک" دراصل "پیاس" ہوتی ہے!`,
    'sd-roman': `Pani yad aahay? 💧 Tawhan ji activity khe hisaab khan roz taqreeban **{water} liter** pani piyo — workout wale din dhan bi.\nAasan tareeqo: dar khane khan pehlin ji glass pani، te bottle sammhe rakho.`,
  },
  consistency: {
    en: (c) => `Consistency beats intensity, {name}! 🔥 You're on a **{streak}-day streak** and hit {weeklyDone} of {weeklyTarget} workouts this week.\nTricks that work: schedule workouts like meetings, keep sessions short on busy days (15 min counts!), prep your gym bag the night before, and never miss twice in a row. Progress page pe apni consistency dekh sakte ho — small graphs, big motivation!`,
    urRoman: `Consistency intensity se badi hoti hai, {name}! 🔥 Aap **{streak} din ka streak** par hain aur is hafte {weeklyTarget} mein se {weeklyDone} workouts ho chuki hain.\nKaam aane wale tareeqe: workout ko meeting ki tarah schedule karein, busy din mein 15 minute bhi chalega, gym bag raat ko tayar rakhein, aur lagataar do din miss na karein. Progress page par apna graph dekhein — chota graph, bara motivation!`,
    'ur-script': `تسلسل شدت سے بڑا ہوتا ہے، {name}! 🔥 آپ **{streak} دن کے اسٹریک** پر ہیں اور اس ہفتے {weeklyTarget} میں سے {weeklyDone} ورکاؤٹس ہو چکی ہیں۔\nکارآمد طریقے: ورکاؤٹ کو میٹنگ کی طرح شیڈول کریں، مصروف دن میں 15 منٹ بھی کافی ہے، gym بیگ رات کو تیار رکھیں، اور لگاتار دو دن نہ چھوڑیں۔\nProgress پیج پر اپنا گراف دیکھیں — چھوٹا گراف، بڑی حوصلہ افزائی!`,
    'sd-roman': `Consistency intensity khan wadhi aahay, {name}! 🔥 Tawhan **{streak} din jo streak** te aahyo te hin hafte mein {weeklyTarget} man khan {weeklyDone} workouts tho gaya aahin.\nKam aayun tareeqa: workout khe meeting vanz schedule kaju، ghairi din mein 15 minute bi challu، gym bag raat khe tayyar rakju، te pohachay 2 din miss na kaju. Progress page te graph mandho!`,
  },
  streak: {
    en: (c) => `Your workout streak is **{streak} days** in a row! ${c.streak >= 7 ? 'That\'s a full week of showing up — incredible! 🏆' : c.streak === 0 ? 'Ready to start a new one today? One workout is all it takes. 💪' : 'Keep the chain alive — even a 15-minute session keeps it going! 🔗'}`,
    urRoman: (c) => `Aap ka workout streak **{streak} din** lagatar hai! ${c.streak >= 7 ? 'Poora hafta — kamaal! 🏆' : c.streak === 0 ? 'Aaj naya streak shuru karein? Ek workout kaafi hai. 💪' : 'Chain ko zinda rakhein — 15 minute bhi kaafi hai! 🔗'}`,
    'ur-script': (c) => `آپ کا ورکاؤٹ اسٹریک **{streak} دن** لگاتار ہے! ${c.streak >= 7 ? 'پورا ہفتہ — کمال! 🏆' : c.streak === 0 ? 'آج نیا اسٹریک شروع کریں؟ ایک ورکاؤٹ کافی ہے۔ 💪' : 'چین کو زندہ رکھیں — 15 منٹ بھی کافی ہے! 🔗'}`,
    'sd-roman': (c) => `Tawhan jo workout streak **{streak} din** lagatar aahay! ${c.streak >= 7 ? 'Pooro hafto — kamaal! 🏆' : c.streak === 0 ? 'Aaj nayo streak shuru kaju? Hin workout kafi aahay. 💪' : 'Chain zinda rakhu — 15 minute bi kafi aahay! 🔗'}`,
  },
  sleep: {
    en: `Sleep is where the magic happens! 😴 Aim for **7–9 hours**. It balances hunger hormones, rebuilds muscle after workouts and powers your next session.\nTips: same sleep/wake time daily, no screens 30–60 min before bed, and keep your room cool and dark.`,
    urRoman: `Neend hi asli jaadu hai! 😴 **7–9 ghante** ki neend lein. Ye bhook ke hormones balance karti hai, workout ke baad muscle banati hai aur agle session ke liye taaqat deti hai.\nMashware: roz ek hi waqt sona/jagna, sone se 30–60 minute pehle screen band, aur kamra thanda aur andera rakhein.`,
    'ur-script': `نیند ہی اصل جادو ہے! 😴 **7–9 گھنٹے** کی نیند لیں۔ یہ بھوک کے ہارمونز توازن رکھتی ہے، ورکاؤٹ کے بعد پٹھیاں بناتی ہے اور اگلے سیشن کے لیے طاقت دیتی ہے۔\nمشورے: روز ایک ہی وقت سونا/جاگنا، سونے سے 30–60 منٹ پہلے اسکرین بند، اور کمرہ ٹھنڈا اور اندھیرا رکھیں۔`,
    'sd-roman': `Neend asal jado aahay! 😴 **7–9 kanta** ji neend khayo. Hora bhook ja hormone balance kando thi، workout pas muscle banandi thi te agle session khe taaqat dendi thi.\nMashwara: roz hin vagt sumbhan/jagan، sumbhan khan 30–60 minute pehlin screen band، te kamro thando te aando rakho.`,
  },
  thanks: {
    en: `Anytime, {name}! 🙌 That's what I'm here for. Keep showing up — your future self will thank you. Need anything else, just ask!`,
    urRoman: `Jab bhi zaroorat ho, {name}! 🙌 Main isi liye hoon. Lagatar mehnat karte rahiye — aane wala waqt aap ka shukriya karega. Kuch aur poochna ho to bataiye!`,
    'ur-script': `جب بھی ضرورت ہو، {name}! 🙌 میں اسی لیے ہوں۔ مسلسل محنت کرتے رہیے — آنے والا وقت آپ کا شکر گزار ہوگا۔ کچھ اور پوچھنا ہو تو بتائیے!`,
    'sd-roman': `Jadhen bi zaroorat hujay, {name}! 🙌 Moon un khe liye aahyan. Lagatar mehnat karendo — aayundo vagt tawhan jo shukar guzar hundo. Mohtamal khe bi poochho!`,
  },
  help: {
    en: `Here's what I can help with, {name}: 🤖\n• **"What workout should I do today?"** — today's session from your plan\n• **"Give me a beginner home workout"** — quick starter routine\n• **"What should I eat today?"** — meals matched to your goal & preferences\n• **"How can I improve my workout consistency?"** — practical motivation tips\n• Ask about calories, protein, BMI, water intake, sleep or your streak!`,
    urRoman: `Main in cheezon mein madad kar sakta hoon, {name}: 🤖\n• **"Aaj kya workout karun?"** — aaj ka session\n• **"Beginner home workout batao"** — asaan routine\n• **"Aaj kya khana chahiye?"** — goal ke mutabiq meals\n• **"Workout consistency kaise behtar karun?"** — practical tips\n• Calories, protein, BMI, paani, neend ya streak ke baare mein bhi pooch sakte hain!`,
    'ur-script': `میں ان چیزوں میں مدد کر سکتا ہوں، {name}: 🤖\n• **"آج کیا ورکاؤٹ کروں؟"** — آج کا سیشن\n• **"بیگنر ہوم ورکاؤٹ بتاؤ"** — آسان رابطین\n• **"آج کیا کھانا چاہیے؟"** — ہدف کے مطابق کھانے\n• **"ورکاؤٹ تسلسل کیسے بہتر کروں؟"** — عملی مشورے\n• کیلوریز، پروٹین، BMI، پانی، نیند یا اسٹریک کے بارے میں بھی پوچھ سکتے ہیں!`,
    'sd-roman': `Moon in kammun mein madad kare sagho, {name}: 🤖\n• **"Aaj kare workout kajan?"** — aaj jo session\n• **"Beginner home workout chao"** — aasan routine\n• **"Aaj kare khano khayu?"** — target mutabiq khana\n• **"Workout consistency k-enh behtar kajan?"** — practical tips\n• Calories، protein، BMI، pani، neend ya streak baray bi poochho!`,
  },
  fallback: {
    en: `Good question, {name}! I'm strongest on topics like today's workout, meal ideas, calories & macros, BMI, water intake, sleep and consistency. 🎯\nTry asking: **"What workout should I do today?"** or **"What should I eat today?"**`,
    urRoman: `Acha sawal, {name}! Main in topics par sab se behtar hoon: aaj ki workout, khane ke mashware, calories & macros, BMI, paani, neend aur consistency. 🎯\nPoochiye: **"Aaj kya workout karun?"** ya **"Aaj kya khana chahiye?"**`,
    'ur-script': `اچھا سوال، {name}! میں ان موضوعات پر سب سے بہتر ہوں: آج کی ورکاؤٹ، کھانے کے مشورے، کیلوریز و میکروز، BMI، پانی، نیند اور تسلسل۔ 🎯\nپوچھیں: **"آج کیا ورکاؤٹ کروں؟"** یا **"آج کیا کھانا چاہیے؟"**`,
    'sd-roman': `Sutho sawal, {name}! Moon in topikun te sab khe sutho aahyan: aaj ji workout، khane ja mashwara، calories te macros، BMI، pani، neend te consistency. 🎯\nPoochho: **"Aaj kare workout kajan?"** ya **"Aaj kare khano khayu?"**`,
  },
}

/* ---------------------------- context builder ------------------------------- */

/** Builds coach context from the user's live profile + data. */
export function buildCoachContext({ profile, fitness, plan, todayDay, dietPlan, logs, entries, todayEntry, streak, weeklyDone, weeklyTarget }) {
  const latestWeight = entries?.find((e) => e.weight)?.weight || fitness?.weight
  const bmiVal = latestWeight && fitness?.height ? Math.round((latestWeight / ((fitness.height / 100) ** 2)) * 10) / 10 : null
  const cat = bmiVal == null ? '—' : bmiVal < 18.5 ? 'Underweight' : bmiVal < 25 ? 'Healthy' : bmiVal < 30 ? 'Overweight' : 'Obese'
  const targets = dietPlan?.targets || {}
  const consumed = todayEntry?.calories || 0
  return {
    name: profile?.name?.split(' ')[0] || 'Athlete',
    goal: fitness?.goal || 'General Fitness',
    preference: plan?.preference || fitness?.workoutPreference || 'Home Workout',
    experience: fitness?.experienceLevel || 'Beginner',
    activity: fitness?.activityLevel || 'Lightly Active',
    workout: todayDay?.focus || 'Your workout',
    duration: todayDay?.duration || 30,
    count: todayDay?.exercises?.length || 0,
    difficulty: todayDay?.difficulty || 'Beginner',
    firstExercise: todayDay?.exercises?.[0]?.name || '—',
    isRestDay: !todayDay || todayDay.type === 'rest',
    restSuggestion: todayDay?.suggestion || 'Take a 20–30 min walk and stretch gently.',
    avgDuration: plan?.days?.filter((d) => d.type === 'workout').length
      ? Math.round(plan.days.filter((d) => d.type === 'workout').reduce((s, d) => s + (d.duration || 0), 0) / plan.days.filter((d) => d.type === 'workout').length)
      : 40,
    calories: targets.calories || '—',
    protein: targets.protein || '—',
    carbs: targets.carbs || '—',
    fats: targets.fats || '—',
    perMeal: targets.protein ? Math.round(targets.protein / 4) : '—',
    water: fitness?.weight ? Math.max(2, Math.round(fitness.weight * 0.033 * 10) / 10) : 2.5,
    bmi: bmiVal ?? '—',
    bmiCategory: cat,
    weight: latestWeight ? `${latestWeight}` : '—',
    goalWeight: fitness?.goalWeight || null,
    consumed,
    todayPct: targets.calories ? Math.min(100, Math.round((consumed / targets.calories) * 100)) : 0,
    streak: streak || 0,
    weeklyDone: weeklyDone || 0,
    weeklyTarget: weeklyTarget || 3,
    hasAllergies: (fitness?.allergies || []).length > 0,
    preferenceAll: fitness?.foodPreferences || 'Other',
  }
}

/** Main entry: returns { text, lang, intent } */
export function coachReply(userText, ctx) {
  const lang = detectLanguage(userText)
  const intent = detectIntent(userText)
  const tpl = T[intent]?.[lang === 'ur-roman' ? 'urRoman' : lang] || T[intent]?.en || T.fallback.en
  const raw = typeof tpl === 'function' ? tpl(ctx) : tpl
  const text = fill(raw, ctx)
  return { text, lang, intent }
}

export const QUICK_PROMPTS = [
  'What workout should I do today?',
  'Give me a beginner home workout',
  'What should I eat today?',
  'How can I improve my workout consistency?',
]
