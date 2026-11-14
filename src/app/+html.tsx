import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';
import type { PropsWithChildren } from 'react';
export default function Root({ children }: PropsWithChildren) {
  const { htmlAttributes, bodyAttributes, headNodes, bodyNodes } = useServerDocumentContext();
  return <html {...htmlAttributes} lang="ja"><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" /><title>BAND T NOTES</title><meta name="description" content="街で見かけたバンドT・フェスTを記録。バンド名候補、履歴、ランキング。" /><meta name="theme-color" content="#111116" /><meta name="apple-mobile-web-app-capable" content="yes" /><link rel="icon" type="image/svg+xml" href="./favicon.svg" /><link rel="manifest" href="./manifest.webmanifest" /><ScrollViewStyleReset />{headNodes}<style dangerouslySetInnerHTML={{__html:'html,body,#root{height:100%;background:#111116}body{margin:0;overflow:hidden}'}} /></head><body {...bodyAttributes}>{children}{bodyNodes}</body></html>;
}
