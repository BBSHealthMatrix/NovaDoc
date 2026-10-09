const CATS = ["Handout", "Patient Education", "Non-Pharma Guidance"];

const BADGE = { "Handout": "hel-b-blue", "Patient Education": "hel-b-purple", "Non-Pharma Guidance": "hel-b-green" };

const doc = (title, desc, cat) => ({ title, desc, cat, content: "" });

const SEED = [
  doc("Understanding Your Blood Pressure", "What your blood pressure numbers mean and how to keep them healthy", "Handout"),
  doc("How to Use Your Inhaler Correctly", "Step-by-step guide for metered dose inhalers (MDI) and spacers", "Handout"),
  doc("Managing Your Blood Sugar at Home", "Daily monitoring tips, target ranges, and what to do when levels are off", "Handout"),
  doc("Wound Care at Home", "How to clean and dress your wound safely to prevent infection", "Handout"),
  doc("Reading Your Prescription", "How to understand and safely follow your medicine prescription", "Handout"),
  doc("When to Visit the Emergency Room", "Warning signs that require immediate emergency medical care", "Handout"),
  doc("Safe Medication Storage", "How to store medicines correctly to keep them safe and effective", "Handout"),
  doc("Understanding Your ECG Report", "What the lines on your ECG mean and when to follow up", "Handout"),

  doc("Living with Diabetes", "Long-term self-care, diet, and monitoring for people with diabetes", "Patient Education"),
  doc("Asthma Care at Home", "Recognising triggers, using your action plan, and when to seek help", "Patient Education"),
  doc("Managing Heart Failure", "Daily weight checks, fluid limits, and warning signs to watch for", "Patient Education"),
  doc("Understanding Your Cholesterol", "What the numbers mean and lifestyle changes to improve your lipid profile", "Patient Education"),
  doc("Stroke Prevention and Recovery", "Risk factors, FAST warning signs, prevention steps, and rehabilitation", "Patient Education"),
  doc("COPD Self-Management Guide", "Breathing techniques, energy conservation, trigger avoidance, and medication management", "Patient Education"),
  doc("Kidney Disease: Diet and Lifestyle", "Dietary restrictions, fluid intake, and lifestyle habits to protect kidney function", "Patient Education"),
  doc("Understanding Thyroid Disorders", "Symptoms of hypothyroidism and hyperthyroidism, treatment, and monitoring", "Patient Education"),
  doc("Osteoporosis and Bone Health", "Prevention, calcium and vitamin D, exercise, and fall prevention strategies", "Patient Education"),

  doc("Exercise Guidelines for Cardiac Patients", "Safe exercise types, intensity, warning signs to stop, and how to progress", "Non-Pharma Guidance"),
  doc("Anti-Inflammatory Diet Plan", "Foods to include and avoid to reduce chronic inflammation in the body", "Non-Pharma Guidance"),
  doc("Stress Management Techniques", "Practical evidence-based techniques to reduce stress and improve mental wellbeing", "Non-Pharma Guidance"),
  doc("Sleep Hygiene for Better Health", "Practical habits to improve sleep quality and duration", "Non-Pharma Guidance"),
  doc("Smoking Cessation Support", "Why quitting matters, what to expect, and the tools and strategies available", "Non-Pharma Guidance"),
  doc("Weight Management Strategies", "Sustainable approaches to achieving and maintaining a healthy weight", "Non-Pharma Guidance"),
  doc("Home Exercise Programme: Knee", "Physiotherapy exercises to strengthen the knee and reduce pain", "Non-Pharma Guidance"),
  doc("Home Exercise Programme: Lower Back", "Physiotherapy exercises to relieve lower back pain and improve core strength", "Non-Pharma Guidance"),
  doc("Mindfulness for Chronic Pain", "How mindfulness can change your relationship with pain and improve quality of life", "Non-Pharma Guidance"),
  doc("Nutrition Guide for Diabetics", "The plate method, glycaemic index, meal timing, and practical food choices", "Non-Pharma Guidance"),
].map((d, i) => ({ ...d, id: i + 1 }));

export { CATS, BADGE, SEED };
