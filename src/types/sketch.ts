import { z } from 'zod';

export const SketchStatus = z.enum(['seed', 'growing', 'blooming', 'dormant']);
export type SketchStatus = z.infer<typeof SketchStatus>;

export const SketchType = z.enum(['code', 'writing', 'audio', 'visual', 'mixed']);
export type SketchType = z.infer<typeof SketchType>;

export const SketchMood = z.enum([
  'contemplative', 
  'energetic', 
  'experimental', 
  'nostalgic', 
  'playful', 
  'melancholic',
  'focused',
  'chaotic',
  'serene',
  'curious'
]);
export type SketchMood = z.infer<typeof SketchMood>;

export const SketchMetadata = z.object({
  id: z.string(),
  title: z.string(),
  version: z.string(),
  parent_version: z.string().optional(),
  status: SketchStatus,
  type: SketchType,
  mood: SketchMood.array().optional(),
  collections: z.string().array().default([]),
  tags: z.string().array().default([]),
  
  // Content paths
  content_path: z.string(),
  media_paths: z.record(z.string()).optional(),
  
  // Temporal
  created_at: z.date(),
  updated_at: z.date(),
  
  // Creative process
  inspiration: z.string().optional(),
  learnings: z.string().optional(),
  next_ideas: z.string().array().default([]),
  
  // Media specific metadata
  duration: z.number().optional(), // for audio/video in seconds
  dimensions: z.object({
    width: z.number(),
    height: z.number()
  }).optional(), // for images/video
  
  // Technical metadata
  tech_stack: z.string().array().default([]),
  dependencies: z.string().array().default([]),
  
  // Publishing
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  preview_text: z.string().optional(),
});

export type SketchMetadata = z.infer<typeof SketchMetadata>;

// Collection schemas
export const CollectionType = z.enum(['album', 'series', 'mood', 'collaboration', 'season', 'experiment']);
export type CollectionType = z.infer<typeof CollectionType>;

export const CollectionMetadata = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: CollectionType,
  
  // Collection membership (sketch_id -> version)
  sketches: z.record(z.string()),
  
  // Temporal
  created_at: z.date(),
  updated_at: z.date(),
  
  // Organization
  order: z.number().array().optional(), // explicit ordering of sketches
  cover_sketch: z.string().optional(), // sketch_id to use as cover
  
  // Publishing
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export type CollectionMetadata = z.infer<typeof CollectionMetadata>;

// Content schemas for different sketch types
export const CodeSketchContent = z.object({
  type: z.literal('code'),
  language: z.string().optional(),
  demo_url: z.string().optional(),
  repo_url: z.string().optional(),
  sandbox_config: z.record(z.unknown()).optional(),
});

export const AudioSketchContent = z.object({
  type: z.literal('audio'),
  genre: z.string().optional(),
  bpm: z.number().optional(),
  key: z.string().optional(),
  instruments: z.string().array().default([]),
  preview_start: z.number().optional(), // start time for 30s preview
});

export const VisualSketchContent = z.object({
  type: z.literal('visual'),
  medium: z.string().optional(), // digital, traditional, photography, etc.
  tools: z.string().array().default([]),
  style: z.string().optional(),
});

export const WritingSketchContent = z.object({
  type: z.literal('writing'),
  word_count: z.number().optional(),
  reading_time: z.number().optional(), // estimated minutes
  excerpt: z.string().optional(),
});

export const MixedSketchContent = z.object({
  type: z.literal('mixed'),
  components: z.array(z.enum(['code', 'audio', 'visual', 'writing'])),
});

export const SketchContent = z.discriminatedUnion('type', [
  CodeSketchContent,
  AudioSketchContent,
  VisualSketchContent,
  WritingSketchContent,
  MixedSketchContent,
]);

export type SketchContent = z.infer<typeof SketchContent>;

// Full sketch with metadata and content
export const Sketch = z.object({
  metadata: SketchMetadata,
  content: SketchContent,
  body: z.string(), // MDX content
});

export type Sketch = z.infer<typeof Sketch>;