import { getClientCookie } from "@/lib/cookie.client";

import { mails } from "./_components/data";
import { MailComponent } from "./_components/mail";
import { MAIL_LAYOUT_COOKIE, parseMailLayout } from "./_components/mail-layout-config";

export default function Page() {
  const layoutCookie = getClientCookie(MAIL_LAYOUT_COOKIE);

  return (
    <div className="h-dvh min-h-0 overflow-hidden">
      <MailComponent mails={mails} defaultLayout={parseMailLayout(layoutCookie)} />
    </div>
  );
}
