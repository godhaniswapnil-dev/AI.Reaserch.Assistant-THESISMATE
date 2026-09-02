import { apiFetch } from './apiHelper';

/**
 * Request backend ASP.NET Core AI Engine (Google Gemini API / Server-Side Academic Pipeline)
 * to synthesize a complete scientific research paper securely without exposing API keys.
 */
export async function generateResearchPaperViaBackend(params) {
  try {
    const payload = {
      prompt: params.prompt || params.topic || 'General Academic Topic',
      pages: Number(params.pageCount || params.pages) || 30,
      citationStyle: params.citationStyle || params.style || 'APA 7th',
      citationLevel: params.citationLevel || params.density || 'Sentence',
      language: params.language || 'English',
      databases: Array.isArray(params.selectedDatabases) ? params.selectedDatabases : ['Semantic Scholar', 'PubMed', 'arXiv', 'Crossref'],
      userEmail: params.userEmail || '',
      username: params.username || 'Primary Researcher'
    };

    const result = await apiFetch('/api/research/generate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (result && result.title && result.sections) {
      return result;
    }
    return null;
  } catch (err) {
    console.warn('[Research Service] Backend generation failed, using client fallback:', err.message);
    return null;
  }
}

/**
 * Fetch all research papers from SQL Database
 */
export async function getAllResearchPapers(userEmail = '') {
  try {
    const url = userEmail ? `/api/research?userEmail=${encodeURIComponent(userEmail)}` : '/api/research';
    const data = await apiFetch(url, { method: 'GET' });
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('[Research Service] Unable to fetch from backend API, using local storage fallback:', err.message);
    return null;
  }
}

/**
 * Fetch single research paper by ID
 */
export async function getResearchPaperById(id) {
  try {
    return await apiFetch(`/api/research/${id}`, { method: 'GET' });
  } catch (err) {
    console.warn(`[Research Service] Error fetching paper #${id}:`, err.message);
    return null;
  }
}

/**
 * Save new research paper into SQL Database (SSMS visible table: dbo.ResearchPapers)
 */
export async function saveResearchPaperToBackend(doc, userEmail = '', username = '') {
  try {
    const payload = {
      title: doc.title || 'Untitled Research Paper',
      topic: doc.topic || doc.prompt || 'General Academic Topic',
      userEmail: userEmail || doc.userEmail || '',
      username: username || doc.username || 'Primary Researcher',
      pages: Number(doc.pages) || 30,
      citationStyle: doc.style || doc.citationStyle || 'APA 7th',
      citationLevel: doc.density || doc.citationLevel || 'Sentence',
      language: doc.language || 'English',
      status: doc.status || 'Verified',
      verifiedPct: Number(doc.verifiedPct) || 100,
      citations: Number(doc.citations) || 48,
      words: Number(doc.words) || (Number(doc.pages) || 30) * 320,
      abstract: typeof doc.abstract === 'string' ? doc.abstract : (doc.sections?.abstract || ''),
      keywords: Array.isArray(doc.keywords) ? doc.keywords.join(', ') : (doc.keywords || ''),
      referencesJson: JSON.stringify(doc.references || []),
      sectionsJson: JSON.stringify(doc.sections || {})
    };

    const result = await apiFetch('/api/research', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    return result;
  } catch (err) {
    console.warn('[Research Service] Unable to save paper to backend SQL database:', err.message);
    return null;
  }
}

/**
 * Update research paper in SQL Database
 */
export async function updateResearchPaperInBackend(id, doc) {
  try {
    const payload = {
      title: doc.title,
      topic: doc.topic,
      userEmail: doc.userEmail,
      username: doc.username,
      pages: Number(doc.pages) || 30,
      citationStyle: doc.style || doc.citationStyle,
      citationLevel: doc.density || doc.citationLevel,
      language: doc.language,
      status: doc.status,
      verifiedPct: Number(doc.verifiedPct) || 100,
      citations: Number(doc.citations) || 48,
      words: Number(doc.words) || (Number(doc.pages) || 30) * 320,
      abstract: typeof doc.abstract === 'string' ? doc.abstract : (doc.sections?.abstract || ''),
      keywords: Array.isArray(doc.keywords) ? doc.keywords.join(', ') : (doc.keywords || ''),
      referencesJson: JSON.stringify(doc.references || []),
      sectionsJson: JSON.stringify(doc.sections || {})
    };

    return await apiFetch(`/api/research/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn(`[Research Service] Error updating paper #${id}:`, err.message);
    return null;
  }
}

/**
 * Delete research paper from SQL Database
 */
export async function deleteResearchPaperFromBackend(id) {
  try {
    return await apiFetch(`/api/research/${id}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn(`[Research Service] Error deleting paper #${id}:`, err.message);
    return null;
  }
}
