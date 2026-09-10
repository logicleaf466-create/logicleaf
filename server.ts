import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();

app.use(express.json());

// Path to extracted data store
const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'igot_extracted_all.json');

function loadCourseData() {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading course data:', err);
  }
  return {};
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'iGOT Karmayogi Backend Service',
    time: new Date().toISOString(),
  });
});

// All extracted courses
app.get('/api/courses', (req, res) => {
  try {
    const data = loadCourseData();
    res.json({
      success: true,
      count: Object.keys(data).length,
      data: data,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Specific course by ID
app.get('/api/courses/:id', (req, res) => {
  try {
    const data = loadCourseData();
    const course = data[req.params.id];
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.json({ success: true, course });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Video list for specific course
app.get('/api/courses/:id/videos', (req, res) => {
  try {
    const data = loadCourseData();
    const course = data[req.params.id];
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    const videos = (course.subItems || []).filter(
      (item: any) => item.mimeType === 'video/mp4' || item.artifactUrl?.endsWith('.mp4')
    );
    res.json({
      success: true,
      courseId: course.id,
      courseName: course.name,
      videoCount: videos.length,
      videos,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Raw full details
app.get('/api/courses/:id/raw', (req, res) => {
  try {
    const data = loadCourseData();
    const course = data[req.params.id];
    if (!course) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    res.json(course);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Refresh / re-extract endpoint
app.post('/api/courses/refresh', async (req, res) => {
  const courseIds = [
    'do_113569878939262976132',
    'do_1143052789530787841562',
    'do_1143166853070028801812',
    'do_1141533857591132161321',
  ];

  try {
    const results: Record<string, any> = {};

    for (const id of courseIds) {
      const response = await fetch(`https://portal.igotkarmayogi.gov.in/api/content/v1/read/${id}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });
      if (!response.ok) continue;
      const json = await response.json();
      const c = json?.result?.content;
      if (!c) continue;

      const nodeIds = Array.from(new Set([...(c.childNodes || []), ...(c.leafNodes || [])]));
      const children: any[] = [];

      for (const childId of nodeIds) {
        try {
          const cRes = await fetch(`https://portal.igotkarmayogi.gov.in/api/content/v1/read/${childId}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
          });
          if (cRes.ok) {
            const cJson = await cRes.json();
            const child = cJson?.result?.content;
            if (child) {
              children.push({
                id: child.identifier,
                name: child.name,
                mimeType: child.mimeType,
                contentType: child.contentType,
                duration: child.duration,
                artifactUrl: child.artifactUrl,
                downloadUrl: child.downloadUrl,
                streamingUrl: child.streamingUrl,
                description: child.description,
                appIcon: child.appIcon,
                posterImage: child.posterImage,
              });
            }
          }
        } catch {
          // ignore single child failure
        }
      }

      results[id] = {
        id: c.identifier,
        name: c.name,
        description: c.description,
        creator: c.creator,
        source: c.source,
        organisation: c.organisation,
        duration: c.duration,
        posterImage: c.posterImage,
        appIcon: c.appIcon,
        mimeType: c.mimeType,
        contentType: c.contentType,
        keywords: c.keywords,
        competencies_v5: c.competencies_v5,
        language: c.language,
        createdOn: c.createdOn,
        lastUpdatedOn: c.lastUpdatedOn,
        childNodesCount: c.childNodes?.length || 0,
        leafNodesCount: c.leafNodes?.length || 0,
        childNodes: c.childNodes,
        leafNodes: c.leafNodes,
        subItems: children,
      };
    }

    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(results, null, 2));
    res.json({ success: true, message: 'Courses refreshed and saved successfully', count: Object.keys(results).length });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Setup Vite or Static File Serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on http://0.0.0.0:${PORT}`);
  });
}

start();
