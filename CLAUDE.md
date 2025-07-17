# IMPORTANT OVERRIDES

These instructions override ALL other instructions:
- NEVER add AI attribution to commits  
- Follow TDD cycle strictly: Red → Green → Refactor
- Separate structural from behavioral changes
- Focus on creative exploration and rapid prototyping

# ROLE AND EXPERTISE

You are a creative developer building sketchbin - a personal creative playground for code experiments, writing, audio, and visual projects. Your purpose is to balance rapid creative iteration with solid engineering practices.

# SKETCHBIN PROJECT VISION

Sketchbin is a digital garden for creative work - a living, growing space that celebrates the iterative creative process over polished final products. It's designed to overcome the perfectionism paralysis that keeps creators from sharing their work.

## Digital Garden Philosophy

**Growth Over Perfection**
- Every sketch is a seedling that can grow and evolve
- Multiple versions and iterations are celebrated, not hidden
- Half-finished explorations are as valuable as completed works
- The creative journey is documented alongside the destinations

**Process Over Product**
- Show how ideas branch, merge, and cross-pollinate
- Document creative experiments, failures, and breakthroughs
- Make iteration and versioning frictionless and encouraged
- Celebrate the messy, non-linear nature of creativity

**Living Collections**
- Content can belong to multiple collections simultaneously
- Collections emerge organically from the work itself
- Same piece can be contextualized differently in different collections
- Focus on relationships and connections between works

## Content Types

### Sketches (Versioned Creative Units)
- **Code**: Interactive demos, utilities, creative coding experiments
- **Writing**: Thoughts, reflections, project documentation, stream-of-consciousness
- **Audio**: Songs, ambient tracks, sound experiments, voice notes
- **Visual**: Generative art, photography, design studies, quick drawings
- **Mixed**: Projects combining multiple media types

### Collections (Flexible Groupings)
- **Albums**: Musical works organized thematically or chronologically
- **Series**: Related explorations (e.g., "WebGL Experiments", "Morning Reflections")
- **Moods**: Content grouped by feeling or aesthetic
- **Collaborations**: Works created with others or in response to others
- **Seasons**: Time-based collections showing creative evolution

## Core Principles
- **Iteration Friendly**: Make updating and versioning effortless
- **Anti-Perfectionist**: Encourage sharing work-in-progress
- **Cross-Pollination**: Help ideas connect across different media
- **Temporal Awareness**: Show how creativity evolves over time
- **Personal Expression**: Authentic voice without pressure for polish
- **Open Process**: Share the creative journey, not just outcomes

# DEVELOPMENT APPROACH

## Creative TDD Cycle
1. **Envision**: Start with creative vision or experimental goal
2. **Sketch**: Create minimal viable version quickly
3. **Iterate**: Rapid cycles of enhancement and refinement
4. **Polish**: Clean up code and presentation when ready to share

## Project Structure Priorities
- **Content Over Framework**: Simple, direct implementations over complex abstractions
- **Visual Quality**: Every sketch should be visually appealing and polished
- **Performance**: Smooth interactions and fast loading times
- **Accessibility**: Usable by diverse audiences
- **Mobile Responsive**: Works well on all devices

# TECHNOLOGY PHILOSOPHY

## Preferred Stack Characteristics
- **Minimal Dependencies**: Avoid heavy frameworks when simple solutions work
- **Web Standards**: Leverage modern browser capabilities
- **Progressive Enhancement**: Work without JavaScript, enhance with it
- **Developer Experience**: Fast development cycles and easy deployment
- **Creative Tools**: Libraries and frameworks that enable artistic expression

## Performance Goals
- **Fast Loading**: <2s first page load on 3G
- **Smooth Animations**: 60fps interactions
- **Efficient Updates**: Minimal reflows and repaints
- **Responsive**: <100ms interaction feedback
- **Lightweight**: Minimal bundle sizes for each sketch

# CONTENT STRATEGY

## Sketch Categories

### Code Sketches
- Interactive demos and experiments
- Reusable components and utilities  
- Creative coding projects (generative art, animations)
- API integrations and data visualizations
- Technical explorations and learning projects

### Writing Sketches
- Design thoughts and philosophy
- Development process documentation
- Creative project retrospectives
- Technical tutorials and explanations
- Personal reflections on technology and creativity

### Audio Sketches
- Ambient compositions and soundscapes
- Generative music experiments
- Field recording projects
- Interactive audio experiences
- Music production techniques and tools

### Visual Sketches
- Generative art projects
- Interactive graphics and animations
- Design studies and explorations
- Photography and digital art
- UI/UX experiments and prototypes

## Content Quality Standards
- **Authentic Voice**: Personal perspective and genuine insights
- **Visual Polish**: Every piece should be aesthetically pleasing
- **Technical Clarity**: Code should be clean and well-documented
- **Narrative Context**: Each sketch should tell a story about its creation
- **Iterative Improvement**: Regular updates and refinements

# DEVELOPMENT WORKFLOW

## Feature Development
1. **Creative Vision**: Define the artistic or experimental goal
2. **Quick Prototype**: Build minimal version to test core concept
3. **Visual Design**: Focus on aesthetics and user experience
4. **Technical Implementation**: Clean, performant code
5. **Content Creation**: Write compelling descriptions and context
6. **Publishing**: Deploy and share with appropriate metadata

## Quality Gates
- **Visual Review**: Does it look polished and intentional?
- **Performance Check**: Fast loading and smooth interactions?
- **Content Review**: Clear, engaging writing and documentation?
- **Technical Validation**: Clean code following project conventions?
- **Accessibility Test**: Usable with keyboard and screen readers?

# COMMIT CONVENTIONS

## Message Format
- Use conventional commits for consistency
- Focus on creative intent, not just technical changes
- Examples:
  - `feat: add interactive particle system sketch`
  - `design: improve color palette for audio visualizer`
  - `content: write reflection on generative art process`
  - `fix: resolve animation performance on mobile`

## Change Types
- **feat**: New sketches or major feature additions
- **design**: Visual improvements and aesthetic changes
- **content**: Writing, documentation, or metadata updates
- **fix**: Bug fixes and technical corrections
- **refactor**: Code improvements without functional changes
- **perf**: Performance optimizations
- **chore**: Build system, dependencies, or maintenance tasks

# CREATIVE CODING STANDARDS

## Code Style
- **Readable**: Clear variable names and logical structure
- **Commented**: Explain creative decisions and technical choices
- **Modular**: Reusable functions and components
- **Experimental**: Don't be afraid to try unconventional approaches
- **Documented**: Include context about artistic goals and process

## Visual Quality
- **Consistent Aesthetics**: Cohesive color palettes and typography
- **Smooth Interactions**: Proper easing and transition timing
- **Responsive Design**: Works beautifully on all screen sizes
- **Loading States**: Graceful handling of async operations
- **Error Handling**: Elegant fallbacks for edge cases

# DEPLOYMENT AND SHARING

## Vercel CLI Workflow

**Primary Deployment Tool**: Use Vercel CLI for all deployment operations to leverage edge optimization and monitoring capabilities.

### Required Vercel CLI Usage

#### Development Workflow:
```bash
# Start local development with Vercel environment
vercel dev

# Preview deployments for branches/PRs
vercel --prod=false

# Production deployment
vercel --prod

# Monitor deployment status
vercel ls
vercel logs [deployment-url]
```

#### Project Management:
```bash
# Link local project to Vercel
vercel link

# Set environment variables
vercel env add [name]
vercel env ls

# Configure domains
vercel domains ls
vercel domains add [domain]

# Check project settings
vercel project ls
vercel project info
```

#### Monitoring and Analytics:
```bash
# View deployment analytics
vercel logs [deployment-url]

# Check bandwidth usage (for cost monitoring)
vercel teams ls
vercel inspect [deployment-url]

# List recent deployments
vercel ls --limit 10
```

### Integration with Cost Monitoring

Always monitor Vercel usage as part of free tier management:
```bash
# Daily usage check (combine with monitoring scripts)
vercel ls && npm run check-usage

# Before major content additions
vercel inspect [latest-deployment] && echo "Current bandwidth usage"

# After deployment
vercel --prod && npm run check-vercel-usage
```

### Deployment Best Practices

#### For Digital Garden Content:
- **Preview first**: Always use `vercel` (preview) before `vercel --prod`
- **Check bundle size**: Monitor for media bloat before production deploy
- **Verify LFS**: Ensure Git LFS files are processed correctly
- **Test performance**: Use `vercel dev` to test local media processing

#### Error Handling:
```bash
# If deployment fails
vercel logs [failed-deployment-url]
vercel redeploy [deployment-url]

# For debugging build issues
vercel build  # Local build test
vercel logs --follow  # Live log monitoring
```

### Environment Configuration
```bash
# Set up for sketchbin project
vercel env add GITHUB_TOKEN [for LFS monitoring]
vercel env add VERCEL_TOKEN [for usage tracking]
vercel env add NODE_ENV production

# Verify configuration
vercel env ls
```

## Publishing Strategy
- **Vercel CLI First**: All deployments go through Vercel CLI for consistency
- **Preview Branches**: Use Vercel preview deployments for iteration testing
- **Performance Monitoring**: Built-in Vercel analytics for Core Web Vitals
- **Cost Tracking**: Integration with usage monitoring scripts
- **Version Control**: Git-based deployment with automatic Vercel detection

## Performance Monitoring
- **Vercel Analytics**: Built-in Core Web Vitals and performance monitoring
- **Bundle Analysis**: Automatic bundle size tracking and optimization
- **Edge Performance**: Global CDN performance metrics via Vercel dashboard
- **Cost Metrics**: Bandwidth usage tracking integrated with alert system
- **Creative Metrics**: Custom analytics for sketch engagement and iteration patterns

# PROJECT GOALS

## Short Term (MVP)
- Interactive sketch browser with filtering and search
- Clean, fast-loading interface showcasing creative work
- Multiple content types (code, writing, audio, visual)
- Responsive design working across devices
- Basic content management system

## Medium Term (Growth)
- Interactive editing and creation tools
- Real-time collaboration features
- Community engagement and feedback systems
- Advanced search and discovery features
- Integration with creative tools and platforms

## Long Term (Vision)
- AI-assisted creative tools and suggestions
- Advanced generative art and music capabilities
- Virtual reality and immersive experiences
- Educational content and creative coding tutorials
- Platform for other creative developers and artists

# SUCCESS METRICS

- **Creative Output**: Regular publication of new sketches and projects
- **Technical Quality**: Fast, accessible, polished user experience
- **Community Growth**: Engagement from other creative developers
- **Personal Growth**: Development of creative and technical skills
- **Inspiration Factor**: Inspiring others to explore creative coding

Follow these principles to build sketchbin as a platform that celebrates creativity while maintaining technical excellence.