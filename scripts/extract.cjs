const fs = require('fs');

async function fetchWithTimeout(url, ms = 4000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
    clearTimeout(id);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    clearTimeout(id);
    return null;
  }
}

async function run() {
  const courseIds = [
    "do_113569878939262976132",
    "do_1143052789530787841562",
    "do_1143166853070028801812",
    "do_1141533857591132161321"
  ];

  const results = {};

  for (const id of courseIds) {
    console.log(`Processing course: ${id}`);
    const rootData = await fetchWithTimeout(`https://portal.igotkarmayogi.gov.in/api/content/v1/read/${id}`, 8000);
    const c = rootData?.result?.content;
    if (!c) {
      console.log(`Failed to fetch root: ${id}`);
      continue;
    }

    const nodeIds = Array.from(new Set([...(c.childNodes || []), ...(c.leafNodes || [])]));
    console.log(`Course ${id} has ${nodeIds.length} sub-nodes. Fetching in parallel batches...`);

    const children = [];
    const BATCH_SIZE = 5;
    for (let i = 0; i < nodeIds.length; i += BATCH_SIZE) {
      const chunk = nodeIds.slice(i, i + BATCH_SIZE);
      const chunkResults = await Promise.all(
        chunk.map(async (childId) => {
          const childData = await fetchWithTimeout(`https://portal.igotkarmayogi.gov.in/api/content/v1/read/${childId}`, 4000);
          const child = childData?.result?.content;
          if (!child) return null;
          return {
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
            posterImage: child.posterImage
          };
        })
      );
      children.push(...chunkResults.filter(Boolean));
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
      subItems: children
    };
  }

  fs.writeFileSync('src/data/igot_extracted_all.json', JSON.stringify(results, null, 2));
  console.log('Successfully saved to src/data/igot_extracted_all.json!');
}

run();
