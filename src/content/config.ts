import { defineCollection, z } from 'astro:content';
import { 
  SketchMetadata, 
  SketchContent, 
  CollectionMetadata,
  SketchStatus,
  SketchType,
  SketchMood,
  CollectionType
} from '@/types/sketch';

// Astro content collection schema for sketches
const sketchesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Basic metadata
    title: z.string(),
    version: z.string(),
    parent_version: z.string().optional(),
    status: SketchStatus,
    type: SketchType,
    mood: SketchMood.array().optional(),
    collections: z.string().array().default([]),
    tags: z.string().array().default([]),
    
    // Media paths (relative to public/media)
    media_paths: z.record(z.string()).optional(),
    
    // Temporal - Astro handles created/updated automatically
    created_at: z.date().optional(),
    updated_at: z.date().optional(),
    
    // Creative process
    inspiration: z.string().optional(),
    learnings: z.string().optional(),
    next_ideas: z.string().array().default([]),
    
    // Media specific metadata
    duration: z.number().optional(),
    dimensions: z.object({
      width: z.number(),
      height: z.number()
    }).optional(),
    
    // Technical metadata
    tech_stack: z.string().array().default([]),
    dependencies: z.string().array().default([]),
    
    // Type-specific content
    // Code
    language: z.string().optional(),
    demo_url: z.string().optional(),
    repo_url: z.string().optional(),
    
    // Audio
    genre: z.string().optional(),
    bpm: z.number().optional(),
    key: z.string().optional(),
    instruments: z.string().array().default([]),
    preview_start: z.number().optional(),
    
    // Visual
    medium: z.string().optional(),
    tools: z.string().array().default([]),
    style: z.string().optional(),
    
    // Writing
    word_count: z.number().optional(),
    reading_time: z.number().optional(),
    excerpt: z.string().optional(),
    
    // Mixed content components
    components: z.array(z.enum(['code', 'audio', 'visual', 'writing'])).optional(),
    
    // Publishing
    published: z.boolean().default(false),
    featured: z.boolean().default(false),
    preview_text: z.string().optional(),
  })
});

// Astro content collection schema for collections
const collectionsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    type: CollectionType,
    
    // Collection membership (sketch_id -> version)
    sketches: z.record(z.string()),
    
    // Organization
    order: z.number().array().optional(),
    cover_sketch: z.string().optional(),
    
    // Publishing
    published: z.boolean().default(false),
    featured: z.boolean().default(false),
  })
});

export const collections = {
  'sketches': sketchesCollection,
  'collections': collectionsCollection,
};