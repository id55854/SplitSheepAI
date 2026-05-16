import { isLikelyDesktopBrowser, isMobilePhone, isSecureForCamera } from '../lib/device';

export default function PhoneDevBanner() {
  if (!import.meta.env.DEV) return null;

  const onPhone = isMobilePhone();
  const secure = isSecureForCamera();

  if (onPhone) {
    if (secure) return null;
    return (
      <p className="dev-banner dev-banner-warn">
        Kamera na mobitelu traži <strong>https://</strong>. Koristi Network URL iz terminala (ne http).
      </p>
    );
  }

  if (isLikelyDesktopBrowser()) {
    return (
      <div className="dev-banner dev-banner-desktop">
        <strong>Otvori na mobitelu, ne na laptopu.</strong>
        <span>
          1. Pokreni <code>npm run dev</code>
          <br />
          2. U terminalu kopiraj <strong>Network → https://192.168…:5173</strong>
          <br />
          3. Zalijepi u Safari/Chrome <strong>na telefonu</strong> (isti Wi‑Fi)
          <br />
          4. Prihvati sigurnosni certifikat jednom
        </span>
      </div>
    );
  }

  return null;
}
