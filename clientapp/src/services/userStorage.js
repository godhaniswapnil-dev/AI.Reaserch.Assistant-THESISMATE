// --- PER-USER STORAGE HELPER UTILITY ---

/**
 * Normalizes user identifier (email, username, or user object) into a consistent storage key.
 */
export function getUserKey(user) {
  if (!user) return "guest";
  if (typeof user === "string") {
    return user.toLowerCase().trim();
  }
  if (user.email && typeof user.email === "string" && user.email.trim()) {
    return user.email.toLowerCase().trim();
  }
  if (user.id) {
    return ("user_" + user.id).toLowerCase().trim();
  }
  return (user.fullName || "guest").toString().toLowerCase().trim();
}

/**
 * Loads isolated profile data for a specific user.
 * For a new user, returns an empty/clean profile matching their registered name and email.
 */
export function getUserProfile(user) {
  const key = getUserKey(user);
  try {
    const saved = localStorage.getItem("thesismate_profile_" + key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error loading user profile:", e);
  }

  // Clean default for a new user
  const fullName = typeof user === "object" ? (user.fullName || user.email || "") : (user || "");
  const email = typeof user === "object" ? (user.email || "") : "";

  return {
    name: fullName || "Research Scholar",
    email: email || "",
    institution: "",
    department: "",
    bio: ""
  };
}

/**
 * Saves isolated profile data for a specific user.
 */
export function saveUserProfile(user, profileData) {
  const key = getUserKey(user);
  try {
    localStorage.setItem("thesismate_profile_" + key, JSON.stringify(profileData));
  } catch (e) {
    console.error("Error saving user profile:", e);
  }
}

/**
 * Loads isolated documents/papers for a specific user.
 * For a new user, returns an empty array [] (0 papers generated).
 */
/**
 * Migrates all user repositories, PDF counts, and profile settings when a user updates their name/email.
 */
export function migrateUserData(oldUser, newUser) {
  const oldKey = getUserKey(oldUser);
  const newKey = getUserKey(newUser);

  if (oldKey === newKey) return;

  try {
    // 1. Preserve and migrate documents/repositories
    const oldDocs = localStorage.getItem("thesismate_docs_" + oldKey);
    if (oldDocs) {
      localStorage.setItem("thesismate_docs_" + newKey, oldDocs);
    }

    // 2. Preserve and migrate PDF exports count
    const oldPdfCount = localStorage.getItem("thesismate_pdf_count_" + oldKey);
    if (oldPdfCount !== null) {
      localStorage.setItem("thesismate_pdf_count_" + newKey, oldPdfCount);
    }

    // 3. Preserve profile details
    const oldProfile = localStorage.getItem("thesismate_profile_" + oldKey);
    if (oldProfile) {
      localStorage.setItem("thesismate_profile_" + newKey, oldProfile);
    }
  } catch (e) {
    console.error("Error migrating user data keys:", e);
  }
}

/**
 * Loads isolated documents/papers strictly for this specific user.
 * For a new user, returns an empty array [] (0 papers generated).
 */
export function getUserDocs(user) {
  const key = getUserKey(user);
  if (!key || key === "guest") return [];
  try {
    const saved = localStorage.getItem("thesismate_docs_" + key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Error loading user docs:", e);
  }
  return []; // Strictly 0 papers for new or other users
}

/**
 * Saves isolated documents/papers strictly for this specific user.
 */
export function saveUserDocs(user, docs) {
  const key = getUserKey(user);
  if (!key || key === "guest") return;
  try {
    localStorage.setItem("thesismate_docs_" + key, JSON.stringify(docs));
  } catch (e) {
    console.error("Error saving user docs:", e);
  }
}

/**
 * Loads total PDF exports count strictly for this specific user.
 */
export function getUserPdfCount(user) {
  const key = getUserKey(user);
  if (!key || key === "guest") return 0;
  try {
    const saved = localStorage.getItem("thesismate_pdf_count_" + key);
    if (saved !== null) {
      return Number(saved) || 0;
    }
  } catch (e) {
    console.error("Error loading PDF count:", e);
  }
  return 0; // Strictly 0 exports for new users
}

/**
 * Increments total PDF exports count strictly for this specific user and returns the new count.
 */
export function incrementUserPdfCount(user) {
  const key = getUserKey(user);
  if (!key || key === "guest") return 1;
  const current = getUserPdfCount(user);
  const next = current + 1;
  try {
    localStorage.setItem("thesismate_pdf_count_" + key, String(next));
  } catch (e) {
    console.error("Error updating PDF count:", e);
  }
  return next;
}

