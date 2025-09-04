import { Router } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user?.userId;
  try {
    const projects = await prisma.project.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const { name } = req.body;
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(403).json({ error: 'User not authenticated' });
  }
  const projectDirName = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
  const projectsRoot = path.join(__dirname, '..', '..', '..', 'user_projects');
  const projectPath = path.join(projectsRoot, projectDirName);
  const dbPath = path.join(projectPath, 'site.db');
  
  try {
    fs.mkdirSync(projectPath, { recursive: true });
    const siteSchema = `
      generator client {
        provider = "prisma-client-js"
      }
      datasource db {
        provider = "sqlite"
        url      = "file:./site.db"
      }
      model Post {
        id        String   @id @default(cuid())
        title     String
        slug      String   @unique
        content   String?
        published Boolean  @default(false)
        createdAt DateTime @default(now())
      }
    `;
    fs.writeFileSync(path.join(projectPath, 'schema.prisma'), siteSchema);
    
    // Create a minimal package.json to install prisma
    fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify({
      "name": "user-site",
      "devDependencies": {
        "prisma": "^5.15.0"
      }
    }));

    // Install prisma client in the new project directory and run migrate
    execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
    execSync('npx prisma migrate dev --name init', { cwd: projectPath, stdio: 'inherit' });
    
    const newProject = await prisma.project.create({
      data: { name, filePath: dbPath, authorId: userId },
    });
    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

export default router;