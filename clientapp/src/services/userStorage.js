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
  const key = getUserKey(user) || "guest";
  let docs = [];

  try {
    const saved = localStorage.getItem("thesismate_docs_" + key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) docs = parsed;
    }
  } catch (e) {
    console.error("Error loading user docs:", e);
  }

  // If this is a logged-in user, automatically inherit & merge any papers generated as guest on the Home Page
  if (key !== "guest") {
    try {
      const guestSaved = localStorage.getItem("thesismate_docs_guest");
      if (guestSaved) {
        const guestDocs = JSON.parse(guestSaved);
        if (Array.isArray(guestDocs) && guestDocs.length > 0) {
          const existingIds = new Set(docs.map((d) => String(d.id)));
          const unmerged = guestDocs.filter((d) => !existingIds.has(String(d.id)));
          if (unmerged.length > 0) {
            docs = [...unmerged, ...docs];
            localStorage.setItem("thesismate_docs_" + key, JSON.stringify(docs));
          }
          localStorage.removeItem("thesismate_docs_guest");
        }
      }
    } catch (e) {
      console.error("Error migrating guest docs to active user:", e);
    }
  }

  return docs;
}

/**
 * Saves isolated documents/papers strictly for this specific user.
 * Automatically broadcasts an update event so the Dashboard and Profile sync immediately.
 */
export function saveUserDocs(user, docs) {
  const key = getUserKey(user) || "guest";
  try {
    localStorage.setItem("thesismate_docs_" + key, JSON.stringify(docs));
    // Broadcast live event to synchronize Dashboard and other components
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("thesismate_docs_updated", { detail: { key, docs } }));
    }
  } catch (e) {
    console.error("Error saving user docs:", e);
  }
}

/**
 * Loads total PDF exports count strictly for this specific user.
 */
export function getUserPdfCount(user) {
  const key = getUserKey(user) || "guest";
  let count = 0;
  try {
    const saved = localStorage.getItem("thesismate_pdf_count_" + key);
    if (saved !== null) {
      count = Number(saved) || 0;
    }
    // If logged in, merge any guest PDF counts
    if (key !== "guest") {
      const guestCount = Number(localStorage.getItem("thesismate_pdf_count_guest")) || 0;
      if (guestCount > 0) {
        count += guestCount;
        localStorage.setItem("thesismate_pdf_count_" + key, String(count));
        localStorage.removeItem("thesismate_pdf_count_guest");
      }
    }
  } catch (e) {
    console.error("Error loading PDF count:", e);
  }
  return count;
}

/**
 * Increments total PDF exports count strictly for this specific user and returns the new count.
 */
export function incrementUserPdfCount(user) {
  const key = getUserKey(user) || "guest";
  const current = getUserPdfCount(user);
  const next = current + 1;
  try {
    localStorage.setItem("thesismate_pdf_count_" + key, String(next));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("thesismate_docs_updated", { detail: { key } }));
    }
  } catch (e) {
    console.error("Error updating PDF count:", e);
  }
  return next;
}


