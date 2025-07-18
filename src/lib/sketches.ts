import { getCollection, type CollectionEntry } from 'astro:content';
import type { SketchMetadata, SketchContent, SketchType, SketchStatus } from '@/types/sketch';

export type SketchEntry = CollectionEntry<'sketches'>;
export type CollectionEntry_ = CollectionEntry<'collections'>;

// Get all sketches with optional filtering
export async function getSketches(filters?: {
  type?: SketchType;
  status?: SketchStatus;
  published?: boolean;
  collection?: string;
  mood?: string;
}): Promise<SketchEntry[]> {
  const allSketches = await getCollection('sketches');
  
  if (!filters) {
    return allSketches.sort((a, b) => 
      new Date(b.data.updated_at || b.data.created_at || 0).getTime() - 
      new Date(a.data.updated_at || a.data.created_at || 0).getTime()
    );
  }
  
  return allSketches
    .filter(sketch => {
      if (filters.type && sketch.data.type !== filters.type) return false;
      if (filters.status && sketch.data.status !== filters.status) return false;
      if (filters.published !== undefined && sketch.data.published !== filters.published) return false;
      if (filters.collection && !sketch.data.collections.includes(filters.collection)) return false;
      if (filters.mood && !sketch.data.mood?.includes(filters.mood as any)) return false;
      return true;
    })
    .sort((a, b) => 
      new Date(b.data.updated_at || b.data.created_at || 0).getTime() - 
      new Date(a.data.updated_at || a.data.created_at || 0).getTime()
    );
}

// Get sketch by ID (returns latest version by default)
export async function getSketch(id: string, version?: string): Promise<SketchEntry | undefined> {
  const allSketches = await getCollection('sketches');
  
  if (version) {
    return allSketches.find(sketch => 
      sketch.slug.startsWith(id) && sketch.data.version === version
    );
  }
  
  // Find all versions of this sketch and return the latest
  const sketchVersions = allSketches.filter(sketch => 
    sketch.slug.startsWith(id)
  );
  
  if (sketchVersions.length === 0) return undefined;
  
  // Sort by creation date and return latest
  return sketchVersions.sort((a, b) => 
    new Date(b.data.created_at || 0).getTime() - 
    new Date(a.data.created_at || 0).getTime()
  )[0];
}

// Get all versions of a sketch
export async function getSketchVersions(id: string): Promise<SketchEntry[]> {
  const allSketches = await getCollection('sketches');
  
  return allSketches
    .filter(sketch => sketch.slug.startsWith(id))
    .sort((a, b) => 
      new Date(a.data.created_at || 0).getTime() - 
      new Date(b.data.created_at || 0).getTime()
    );
}

// Get sketches in a collection
export async function getCollectionSketches(collectionId: string): Promise<SketchEntry[]> {
  const collections = await getCollection('collections');
  const collection = collections.find(c => c.slug === collectionId);
  
  if (!collection) return [];
  
  const allSketches = await getCollection('sketches');
  const sketchEntries: SketchEntry[] = [];
  
  // Get specific versions from collection
  for (const [sketchId, version] of Object.entries(collection.data.sketches)) {
    const sketch = await getSketch(sketchId, version);
    if (sketch) sketchEntries.push(sketch);
  }
  
  // Apply custom ordering if specified
  if (collection.data.order) {
    const orderMap = new Map(collection.data.order.map((id, index) => [id, index]));
    sketchEntries.sort((a, b) => {
      const aOrder = orderMap.get(a.slug) ?? Infinity;
      const bOrder = orderMap.get(b.slug) ?? Infinity;
      return aOrder - bOrder;
    });
  }
  
  return sketchEntries;
}

// Get featured sketches
export async function getFeaturedSketches(): Promise<SketchEntry[]> {
  return getSketches({ featured: true, published: true });
}

// Get recent sketches
export async function getRecentSketches(limit = 10): Promise<SketchEntry[]> {
  const sketches = await getSketches({ published: true });
  return sketches.slice(0, limit);
}

// Generate sketch URL
export function getSketchUrl(sketch: SketchEntry): string {
  return `/sketches/${sketch.slug}`;
}

// Generate sketch preview image URL
export function getSketchPreviewUrl(sketch: SketchEntry): string | undefined {
  if (sketch.data.type === 'visual' && sketch.data.media_paths?.image) {
    return `/media/images/${sketch.data.media_paths.image}`;
  }
  if (sketch.data.type === 'code' && sketch.data.media_paths?.preview) {
    return `/media/images/${sketch.data.media_paths.preview}`;
  }
  return undefined;
}

// Get estimated reading time for text content
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Format sketch status for display
export function formatStatus(status: SketchStatus): string {
  const statusEmojis = {
    'seed': '🌱',
    'growing': '🌿', 
    'blooming': '🌸',
    'dormant': '🍂'
  };
  
  return `${statusEmojis[status]} ${status.charAt(0).toUpperCase() + status.slice(1)}`;
}

// Generate next version number
export async function generateNextVersion(id: string): Promise<string> {
  const versions = await getSketchVersions(id);
  
  if (versions.length === 0) return 'v1';
  
  // Simple incrementing version numbers
  const versionNumbers = versions
    .map(v => v.data.version)
    .filter(v => v.startsWith('v'))
    .map(v => parseInt(v.slice(1)))
    .filter(n => !isNaN(n));
  
  if (versionNumbers.length === 0) return 'v1';
  
  const maxVersion = Math.max(...versionNumbers);
  return `v${maxVersion + 1}`;
}