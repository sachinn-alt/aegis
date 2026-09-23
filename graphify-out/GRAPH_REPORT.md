# Graph Report - resilicoast  (2026-09-23)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 71 nodes · 112 edges · 8 communities (3 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 23,476 input · 622 output

## Graph Freshness
- Built from commit: `242e2466`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Project Configuration
- BRICS Basin Analysis
- ResiliCoast Application
- Surge Physics Engine
- Advisory Dispatch System
- NPM Scripts

## God Nodes (most connected - your core abstractions)
1. `ResiliCoastApp` - 22 edges
2. `GeminiReasoningEngine` - 9 edges
3. `SurgePhysicsEngine` - 8 edges
4. `AdvisoryDispatcher` - 7 edges
5. `ReportGenerator` - 5 edges
6. `scripts` - 4 edges
7. `leaflet` - 2 edges
8. `vite` - 2 edges
9. `BRICS_BASINS` - 2 edges
10. `leaflet` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (8 total, 5 thin omitted)

### Community 0 - "Project Configuration"
Cohesion: 0.12
Nodes (14): dependencies, leaflet, lucide, description, devDependencies, vite, name, private (+6 more)

### Community 1 - "BRICS Basin Analysis"
Cohesion: 0.19
Nodes (3): BRICS_BASINS, GeminiReasoningEngine, ReportGenerator

### Community 7 - "NPM Scripts"
Cohesion: 0.50
Nodes (4): scripts, build, dev, preview

## Knowledge Gaps
- **12 isolated node(s):** `leaflet`, `lucide`, `description`, `vite`, `name` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 24 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ResiliCoastApp` connect `ResiliCoast Application` to `BRICS Basin Analysis`, `Surge Visualization Controls`, `Map Rendering & UI Updates`?**
  _High betweenness centrality (0.444) - this node is a cross-community bridge._
- **Why does `leaflet` connect `Project Configuration` to `BRICS Basin Analysis`?**
  _High betweenness centrality (0.414) - this node is a cross-community bridge._
- **Why does `GeminiReasoningEngine` connect `BRICS Basin Analysis` to `ResiliCoast Application`?**
  _High betweenness centrality (0.166) - this node is a cross-community bridge._
- **What connects `leaflet`, `lucide`, `description` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Project Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._