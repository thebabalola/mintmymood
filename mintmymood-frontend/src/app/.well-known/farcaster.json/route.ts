declare const process: {
  env: {
    [key: string]: string | undefined;
  };
};

function withValidProperties(properties: Record<string, undefined | string | string[] | boolean>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => {
      if (typeof value === 'boolean') return true;
      return Array.isArray(value) ? value.length > 0 : !!value;
    })
  );
}

export async function GET() {
  const URL = "https://mintmymood.vercel.app";
  return Response.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    },
    frame: withValidProperties({
      version: '1',
      name: 'MintMyMood',
      subtitle: 'Mint your daily mood as NFT',
      description: 'Transform your daily emotions into unique NFTs and share your mood journey with friends',
      screenshotUrls: [],
      iconUrl: 'https://mintmymood.vercel.app/og.png',
      splashImageUrl: 'https://mintmymood.vercel.app/mym-logo.png',
      splashBackgroundColor: '#FEFCE8',
      homeUrl: URL,
      webhookUrl: `${URL}/api/webhook`,
      primaryCategory: 'social',
      tags: [],
      heroImageUrl: 'https://mintmymood.vercel.app/og.png',
      tagline: 'Mint instantly',
      ogTitle: 'MintMyMood',
      ogDescription: 'Fast, fun, social mood minting',
      ogImageUrl: 'https://mintmymood.vercel.app/og.png',
      // use only while testing
      noindex: true,
    }),
  });
}
