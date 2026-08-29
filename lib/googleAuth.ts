/**
 * Google Identity Services (GSI) Helper for ReSell Hub
 * Opens real Google Account Selector popup and returns OAuth credential.
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (notification?: (status: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean; isDismissedMoment: () => boolean; getDismissedReason: () => string }) => void) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
            error_callback?: (err: unknown) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "57343068480-j0brbnq37os41jtv4kfhvhlt4dvbqfj2.apps.googleusercontent.com";

/**
 * Ensures the Google Identity Services SDK script is loaded in the browser.
 */
export function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    if (window.google?.accounts) return resolve();

    const existingScript = document.getElementById("google-gsi-client");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Google SDK")));
      return;
    }

    const script = document.createElement("script");
    script.id = "google-gsi-client";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google SDK from accounts.google.com"));
    document.head.appendChild(script);
  });
}

/**
 * Triggers the real Google OAuth Account Picker popup.
 * Opens Google's account selection modal and resolves with the verified token.
 */
export async function triggerGoogleOAuth(): Promise<string> {
  await loadGoogleScript();

  const google = window.google;
  if (!google?.accounts) {
    throw new Error("Google Sign-In SDK could not be loaded. Please disable ad-blockers and try again.");
  }

  return new Promise((resolve, reject) => {
    try {
      // 1. Try Token Client with Account Selector Prompt (Opens Google Popup)
      if (google.accounts.oauth2) {
        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "openid email profile",
          callback: (response) => {
            if (response.error) {
              reject(new Error(response.error === "popup_closed_by_user" ? "Google sign-in popup was closed." : response.error));
            } else if (response.access_token) {
              resolve(response.access_token);
            } else {
              reject(new Error("No access token received from Google."));
            }
          },
          error_callback: (err) => {
            reject(new Error("Google OAuth error: " + JSON.stringify(err)));
          },
        });

        tokenClient.requestAccessToken({ prompt: "select_account" });
        return;
      }

      // 2. Fallback to Google ID Token initialize
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (res) => {
          if (res?.credential) {
            resolve(res.credential);
          } else {
            reject(new Error("Google credential not received."));
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          reject(new Error("Google account picker could not be displayed."));
        }
      });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Google Sign-In failed.";
      reject(new Error(errorMsg));
    }
  });
}
