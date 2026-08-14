import { defineTool } from "@lovable.dev/mcp-js";

import {
  EMAIL,
  WHATSAPP_LINK,
  WHATSAPP_NUMBER,
  influences,
  profile,
  services,
  socials,
} from "@/data/profile";

export default defineTool({
  name: "get_studio_profile",
  title: "Get studio profile",
  description:
    "Get just mike's public profile: bio, services offered, influences, social links and contact details.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const data = {
      ...profile,
      services,
      influences,
      socials,
      contact: { email: EMAIL, whatsapp: WHATSAPP_NUMBER, whatsappLink: WHATSAPP_LINK },
    };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: data,
    };
  },
});
