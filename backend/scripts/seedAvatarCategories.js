const mongoose = require('mongoose');
const AvatarCategory = require('../models/AvatarCategory');
require('dotenv').config();

const defaultCategories = [
  {
    name: 'general',
    label: 'General',
    description: 'Avatares generales y neutrales',
    icon: '👤',
    color: '#2e7d32',
    order: 1
  },
  {
    name: 'profesional',
    label: 'Profesional',
    description: 'Avatares formales y corporativos',
    icon: '💼',
    color: '#1976d2',
    order: 2
  },
  {
    name: 'divertido',
    label: 'Divertido',
    description: 'Avatares coloridos y expresivos',
    icon: '🎭',
    color: '#ff9800',
    order: 3
  },
  {
    name: 'anime',
    label: 'Anime',
    description: 'Estilo anime y manga',
    icon: '🎌',
    color: '#9c27b0',
    order: 4
  },
  {
    name: 'animales',
    label: 'Animales',
    description: 'Avatares con animales',
    icon: '🐾',
    color: '#795548',
    order: 5
  },
  {
    name: 'naturaleza',
    label: 'Naturaleza',
    description: 'Paisajes y elementos naturales',
    icon: '🌿',
    color: '#4caf50',
    order: 6
  },
  {
    name: 'arte',
    label: 'Arte',
    description: 'Diseños artísticos y abstractos',
    icon: '🎨',
    color: '#e91e63',
    order: 7
  },
  {
    name: 'deporte',
    label: 'Deporte',
    description: 'Temática deportiva',
    icon: '⚽',
    color: '#2196f3',
    order: 8
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