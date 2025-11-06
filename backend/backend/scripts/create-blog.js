#!/usr/bin/env node

/**
 * Simple CLI tool to create blog posts from anywhere
 * Usage: node create-blog.js <title> <category> [file.md]
 *   or:  node create-blog.js --file path/to/post.md
 *   or:  node create-blog.js --interactive
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = process.env.API_URL || 'http://localhost:5000';
const API_KEY = process.env.API_KEY || '';

if (!API_KEY) {
  console.error('❌ Error: API_KEY environment variable is required');
  console.log('\n💡 Set it up:');
  console.log('   export API_KEY=your_api_key_here');
  console.log('   Or create one: POST http://localhost:5000/api/admin/api-keys');
  process.exit(1);
}

async function createBlog(title, content, category, tags = null) {
  try {
    const response = await fetch(`${API_URL}/api/blogs/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify({ title, content, category, tags })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create blog');
    }

    return data;
  } catch (error) {
    throw new Error(`API Error: ${error.message}`);
  }
}

async function readMarkdownFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    let title = '';
    let category = 'tech';
    let tags = null;
    let body = content;
    
    // Parse frontmatter
    if (content.startsWith('---')) {
      const endIndex = content.indexOf('---', 3);
      if (endIndex > 0) {
        const frontmatter = content.substring(3, endIndex);
        body = content.substring(endIndex + 3).trim();
        
        const titleMatch = frontmatter.match(/title:\s*(.+)/i);
        const categoryMatch = frontmatter.match(/category:\s*(.+)/i);
        const tagsMatch = frontmatter.match(/tags:\s*\[(.+)\]/i);
        
        if (titleMatch) title = titleMatch[1].replace(/['"]/g, '').trim();
        if (categoryMatch) category = categoryMatch[1].replace(/['"]/g, '').trim();
        if (tagsMatch) {
          tags = tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, ''));
        }
      }
    }
    
    // If no title in frontmatter, try first H1
    if (!title) {
      const h1Match = body.match(/^#\s+(.+)$/m);
      if (h1Match) {
        title = h1Match[1];
        body = body.replace(/^#\s+.+$/m, '').trim();
      } else {
        title = path.basename(filePath, '.md').replace(/-/g, ' ');
      }
    }
    
    return { title, content: body, category, tags };
  } catch (error) {
    throw new Error(`File read error: ${error.message}`);
  }
}

async function interactiveMode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const question = (query) => new Promise(resolve => rl.question(query, resolve));

  try {
    console.log('\n📝 Interactive Blog Creation\n');
    
    const title = await question('Title: ');
    const category = await question('Category (tech/personal/gaming) [tech]: ') || 'tech';
    const filePath = await question('Markdown file path (optional, press Enter to type content): ');
    
    let content;
    if (filePath.trim()) {
      const parsed = await readMarkdownFile(filePath.trim());
      content = parsed.content;
      if (!title.trim()) {
        title = parsed.title;
      }
    } else {
      console.log('\nEnter content (end with Ctrl+D or Ctrl+Z):');
      const lines = [];
      for await (const line of rl) {
        lines.push(line);
      }
      content = lines.join('\n');
    }
    
    rl.close();
    
    const result = await createBlog(title.trim(), content.trim(), category.trim());
    console.log('\n✅ Blog created successfully!');
    console.log(`   ID: ${result.blog._id}`);
    console.log(`   Title: ${result.blog.title}`);
    console.log(`   View at: ${API_URL.replace('/api', '')}/blog/${result.blog._id}\n`);
  } catch (error) {
    rl.close();
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
📝 Blog Creation CLI Tool

Usage:
  node create-blog.js <title> <category> [file.md]
  node create-blog.js --file path/to/post.md
  node create-blog.js --interactive

Examples:
  node create-blog.js "My Post" tech post.md
  node create-blog.js --file ./posts/my-blog.md
  node create-blog.js --interactive

Environment Variables:
  API_URL  - API endpoint (default: http://localhost:5000)
  API_KEY  - Your API key (required)

Markdown File Format:
  You can use frontmatter in your .md files:
  
  ---
  title: My Blog Post
  category: tech
  tags: [javascript, nodejs]
  ---
  
  # My Blog Post
  
  Content here...
    `);
    process.exit(0);
  }
  
  try {
    if (args[0] === '--interactive' || args[0] === '-i') {
      await interactiveMode();
      return;
    }
    
    if (args[0] === '--file' || args[0] === '-f') {
      const filePath = args[1];
      if (!filePath) {
        console.error('❌ Error: File path required');
        process.exit(1);
      }
      
      const parsed = await readMarkdownFile(filePath);
      const result = await createBlog(parsed.title, parsed.content, parsed.category, parsed.tags);
      
      console.log('✅ Blog created successfully!');
      console.log(`   ID: ${result.blog._id}`);
      console.log(`   Title: ${result.blog.title}\n`);
      return;
    }
    
    // Direct mode: title category [file]
    const title = args[0];
    const category = args[1] || 'tech';
    const filePath = args[2];
    
    let content;
    if (filePath) {
      const parsed = await readMarkdownFile(filePath);
      content = parsed.content;
    } else {
      // Read from stdin
      const chunks = [];
      for await (const chunk of process.stdin) {
        chunks.push(chunk);
      }
      content = Buffer.concat(chunks).toString('utf-8');
      
      if (!content.trim()) {
        console.error('❌ Error: No content provided');
        process.exit(1);
      }
    }
    
    const result = await createBlog(title, content, category);
    console.log('✅ Blog created successfully!');
    console.log(`   ID: ${result.blog._id}`);
    console.log(`   Title: ${result.blog.title}\n`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

