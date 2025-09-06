import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupSampleData() {
  try {
    console.log('Setting up sample data...');

    // Create sample categories
    const categories = [
      {
        name: 'Technology',
        description: 'Posts about technology, programming, and software development',
        color: '#3182CE'
      },
      {
        name: 'Lifestyle',
        description: 'Posts about personal development, health, and daily life',
        color: '#38A169'
      },
      {
        name: 'Travel',
        description: 'Posts about travel experiences, destinations, and tips',
        color: '#DD6B20'
      },
      {
        name: 'Food',
        description: 'Posts about cooking, recipes, and culinary experiences',
        color: '#D53F8C'
      },
      {
        name: 'Business',
        description: 'Posts about entrepreneurship, marketing, and business insights',
        color: '#805AD5'
      }
    ];

    console.log('Creating categories...');
    for (const categoryData of categories) {
      const existingCategory = await prisma.category.findUnique({
        where: { name: categoryData.name }
      });

      if (!existingCategory) {
        const category = await prisma.category.create({
          data: {
            name: categoryData.name,
            slug: categoryData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            description: categoryData.description,
            color: categoryData.color
          }
        });
        console.log(`Created category: ${category.name}`);
      } else {
        console.log(`Category already exists: ${categoryData.name}`);
      }
    }

    // Create sample tags
    const tags = [
      'JavaScript',
      'React',
      'Node.js',
      'Python',
      'Machine Learning',
      'Web Development',
      'Mobile Apps',
      'Design',
      'Productivity',
      'Mindfulness',
      'Fitness',
      'Photography',
      'Writing',
      'Marketing',
      'Startups',
      'Remote Work',
      'Leadership',
      'Innovation'
    ];

    console.log('Creating tags...');
    for (const tagName of tags) {
      const existingTag = await prisma.tag.findUnique({
        where: { name: tagName }
      });

      if (!existingTag) {
        const tag = await prisma.tag.create({
          data: {
            name: tagName,
            slug: tagName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
          }
        });
        console.log(`Created tag: ${tag.name}`);
      } else {
        console.log(`Tag already exists: ${tagName}`);
      }
    }

    console.log('Sample data setup completed successfully!');
  } catch (error) {
    console.error('Error setting up sample data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupSampleData();
}

export default setupSampleData;
