export const RESUME_URL = "/Bhavi_Agale_Resume.pdf";
export const RESUME_FILENAME = "Bhavi_Agale_Resume.pdf";

/**
 * Tells the server a download started, so Bhavi gets a notification.
 * sendBeacon survives the page navigating away and never delays the download.
 */
export function noteResumeDownload() {
  try {
    navigator.sendBeacon?.("/api/resume-download", JSON.stringify({ path: window.location.pathname }));
  } catch {
    // Notifications are a nice-to-have. The download goes ahead regardless.
  }
}
