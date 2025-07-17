# Sketchbin System Architecture

## Overview: Cost-Effective Media Hosting for Digital Gardens

Sketchbin is designed to support extensive media content (audio, images, code demos) while maintaining affordable hosting costs through intelligent tiering, progressive enhancement, and edge processing.

## Core Principles

- **Tiered Storage**: Hot/Warm/Cold storage strategy based on access patterns
- **Progressive Enhancement**: Load minimal content first, full quality on demand
- **Edge Processing**: Real-time optimization without storing all variants
- **Cost Optimization**: Smart compression, deduplication, and automatic archiving

## Storage Architecture

### Three-Tier Storage Strategy

```
┌─ HOT TIER ────────────────────────────────────────┐
│ Platform: Vercel Edge + Cloudflare R2             │
│ Content: Current versions, previews, thumbnails   │
│ Size: <100KB per item, 30-day active window       │
│ Cost: ~$5-10/month                                 │
│ Access: <100ms globally                           │
└────────────────────────────────────────────────────┘

┌─ WARM TIER ───────────────────────────────────────┐
│ Platform: Cloudflare R2 with CDN                  │
│ Content: Recent versions, full-resolution files   │
│ Size: 1-10MB per item, 6-month window            │
│ Cost: ~$10-20/month                               │
│ Access: <500ms globally                           │
└────────────────────────────────────────────────────┘

┌─ COLD TIER ───────────────────────────────────────┐
│ Platform: Backblaze B2                            │
│ Content: Archives, source files, old versions     │
│ Size: 10-100MB per item, long-term storage       │
│ Cost: ~$2-5/month                                 │
│ Access: 10-30s retrieval delay                   │
└────────────────────────────────────────────────────┘
```

### Content Distribution by Type

**🎵 Audio Files**
```
Hot:  30s preview snippet (128kbps MP3, ~500KB)
Warm: Full song (320kbps MP3, ~8MB)  
Cold: Original WAV/FLAC source (~40MB)
```

**🖼️ Visual Content**
```
Hot:  Thumbnail + WebP preview (50KB + 200KB)
Warm: Full resolution WebP/AVIF (1-3MB)
Cold: Original PSD/AI/RAW files (10-50MB)
```

**💻 Code Demos**
```
Hot:  Embedded iframe or lightweight preview
Warm: Full sandbox with assets
Cold: Source code archive + dependencies
```

## Technology Stack

### Core Infrastructure
- **Frontend**: Astro + React + TypeScript
- **Styling**: Tailwind CSS with CSS variables
- **Content**: MDX with Zod schema validation
- **State**: Zustand for client-side state management

### Storage & CDN
- **Primary**: Cloudflare R2 (zero egress fees) + Workers
- **Secondary**: Vercel Edge Functions + GitHub LFS
- **Archive**: Backblaze B2 (ultra-low cost cold storage)
- **CDN**: Cloudflare global network

### Media Processing
- **Build-time**: Astro + Sharp (images) + FFmpeg (audio)
- **Edge**: Cloudflare Workers for dynamic optimization
- **Formats**: WebP/AVIF images, MP3/AAC audio, WebM video

## Media Processing Pipeline

### Build-Time Processing (Static Generation)

```typescript
// Astro integration for media processing
const processSketchMedia = async (sketchPath: string) => {
  const metadata = await parseSketchMetadata(sketchPath);
  
  // Generate tiered versions
  const processed = {
    hot: await generatePreviews(metadata),
    warm: await generateOptimized(metadata), 
    cold: await archiveOriginals(metadata)
  };
  
  // Upload to appropriate storage tiers
  await uploadToTiers(processed);
  
  return processed.hot; // Return hot tier for immediate use
};
```

### Edge Processing (Dynamic Optimization)

```typescript
// Cloudflare Worker for on-demand processing
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    
    // Dynamic image resizing: /img/sketch.jpg?w=800&h=600&f=webp
    if (url.pathname.startsWith('/img/')) {
      return resizeImage(request, env.R2_BUCKET);
    }
    
    // Audio format conversion: /audio/song.mp3?f=aac&q=192
    if (url.pathname.startsWith('/audio/')) {
      return convertAudio(request, env.R2_BUCKET);
    }
    
    // Code demo sandboxing
    if (url.pathname.startsWith('/demo/')) {
      return createSandbox(request, env);
    }
  }
};
```

## Progressive Enhancement Strategy

### Load Performance Hierarchy

1. **Critical Path (0-100ms)**
   - CSS skeleton placeholders
   - Essential layout and navigation
   - Tiny thumbnail images (<10KB)

2. **Primary Content (100-500ms)**
   - Preview-quality media (50-200KB)
   - Text content and metadata
   - Interactive UI components

3. **Enhanced Experience (500ms+)**
   - Full-quality media on demand
   - Interactive demos and sandboxes
   - Rich visualizations and animations

### Smart Loading Patterns

```typescript
// Intersection Observer for viewport-based loading
const lazyLoadMedia = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const element = entry.target as HTMLElement;
      loadFullQuality(element);
    }
  });
});

// Connection-aware loading
const loadStrategy = navigator.connection?.effectiveType === '4g' 
  ? 'high-quality' 
  : 'optimized';
```

## Version Management for Media

### File Organization
```
content/
├── sketches/
│   └── morning-reflection/
│       ├── v1-voice-memo/
│       │   ├── content.md
│       │   ├── audio.wav          # Cold storage
│       │   ├── preview.mp3        # Hot storage  
│       │   └── waveform.svg       # Hot storage
│       ├── v2-guitar-added/
│       │   ├── content.md
│       │   ├── master.wav         # Cold storage
│       │   ├── mixed.mp3          # Warm storage
│       │   └── preview.mp3        # Hot storage
│       └── current -> v2-guitar-added/
```

### Deduplication Strategy
- **Content hashing**: Avoid storing identical files across versions
- **Delta compression**: Store only differences between similar versions
- **Reference tracking**: Multiple sketches can reference same media files

## Cost Optimization Features

### Automatic Tier Migration
```typescript
// Scheduled function to optimize storage costs
export const optimizeStorage = async () => {
  const analytics = await getAccessAnalytics();
  
  // Move unused content to colder storage
  for (const file of analytics.unused30Days) {
    await migrateToColdStorage(file);
  }
  
  // Promote popular content to hot tier
  for (const file of analytics.highTraffic) {
    await migrateToHotStorage(file);
  }
};
```

### Smart Compression
- **Perceptual quality metrics**: Optimize for human perception, not file size
- **Content-aware compression**: Different strategies for speech vs. music
- **Adaptive bitrates**: Adjust quality based on content importance and user context

## Monitoring & Analytics

### Cost Tracking
- **Per-tier usage monitoring**: Track storage and bandwidth by tier
- **Content lifecycle analytics**: How long content stays in each tier
- **User behavior insights**: Which content types drive the most traffic

### Performance Metrics
- **Core Web Vitals**: LCP, FID, CLS monitoring
- **Media loading performance**: Time to first preview, full quality load time
- **Edge cache hit rates**: Effectiveness of CDN and processing optimization

## Scalability Considerations

### Growth Planning
- **Storage scaling**: Automatic tier allocation based on usage patterns
- **Geographic distribution**: CDN optimization for global audience
- **Processing scaling**: Cloudflare Workers auto-scaling for media processing

### Future Enhancements
- **AI-powered optimization**: Automatic quality adjustment based on content analysis
- **Collaborative features**: Shared storage for community gardens
- **Advanced analytics**: Creative pattern analysis and recommendation systems

## Security & Privacy

### Access Control
- **Public by default**: Aligned with digital garden philosophy
- **Selective privacy**: Option to keep specific versions private
- **Content signing**: Verify integrity of media files across tiers

### Data Protection
- **Backup strategy**: Multi-provider redundancy for important content
- **Version recovery**: Ability to restore accidentally deleted versions
- **Export capabilities**: Full content export for platform independence

## Implementation Phases

### Phase 1: Foundation (Weeks 1-4)
- Basic three-tier storage setup
- Astro build-time processing pipeline
- Cloudflare R2 integration

### Phase 2: Optimization (Weeks 5-8)  
- Edge processing with Workers
- Progressive loading implementation
- Cost monitoring and analytics

### Phase 3: Advanced Features (Weeks 9-12)
- Automatic tier migration
- Advanced compression and deduplication
- Performance optimization and monitoring

This architecture balances cost-effectiveness with performance, ensuring that your digital garden can grow extensively without breaking the bank while maintaining excellent user experience.