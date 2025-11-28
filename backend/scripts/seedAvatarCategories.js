const mongoose = require('mongoose');
const AvatarCategory = require('../models/AvatarCategory');
require('dotenv').config();

const defaultCategories = [
  {
    name: 'general',
    label: 'General',
    description: 'Avatares generales para todos los usuarios',
    icon: '👤',
    color: '#2e7d32',
    order: 1,
    isActive: true
  },
  {
    name: 'profesional',
    label: 'Profesional',
    description: 'Avatares para entornos profesionales',
    icon: '💼',
    color: '#1976d2',
    order: 2,
    isActive: true
  },
  {
    name: 'estudiante',
    label: 'Estudiante',
    description: 'Avatares para estudiantes y académicos',
    icon: '🎓',
    color: '#388e3c',
    order: 3,
    isActive: true
  },
  {
    name: 'familiar',
    label: 'Familiar',
    description: 'Avatares para contextos familiares',
    icon: '👨‍👩‍👧‍👦',
    color: '#f57c00',
    order: 4,
    isActive: true
  },
  {
    name: 'deportivo',
    label: 'Deportivo',
    description: 'Avatares para entusiastas del deporte',
    icon: '🏃‍♂️',
    color: '#7b1fa2',
    order: 5,
    isActive: true
  }
];

async function seedAvatarCategories() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗂️ Checking existing categories...');
    const existingCount = await AvatarCategory.countDocuments();
    console.log(`📊 Found ${existingCount} existing categories`);

    if (existingCount > 0) {
      console.log('⚠️ Categories already exist. Skipping seeding.');
      return;
    }

    console.log('📝 Creating default categories...');

    // Create admin user reference (you might want to change this to an actual admin user ID)
    const User = require('../models/User');
    const adminUser = await User.findOne({ role: 'admin' });

    if (!adminUser) {
      console.log('❌ No admin user found. Please create an admin user first.');
      return;
    }

    const categoriesWithUser = defaultCategories.map(category => ({
      ...category,
      createdBy: adminUser._id
    }));

    const createdCategories = await AvatarCategory.insertMany(categoriesWithUser);
    console.log(`✅ Created ${createdCategories.length} categories:`);

    createdCategories.forEach(category => {
      console.log(`  - ${category.icon} ${category.label} (${category.name})`);
    });

  } catch (error) {
    console.error('❌ Error seeding avatar categories:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run if called directly
if (require.main === module) {
  seedAvatarCategories();
}

module.exports = { seedAvatarCategories };