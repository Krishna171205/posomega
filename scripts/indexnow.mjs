// Submits every URL in the sitemap to IndexNow, which pushes them to Bing,
// Yandex, Seznam and Naver immediately instead of waiting to be crawled.
// Google does not consume IndexNow. Run after a deploy: `node scripts/indexnow.mjs`
//
// The key file at public/<key>.txt is what proves we control the host, so the
// key and the file name must stay in sync. No account or API token is needed.
const KEY = '8d813de9c79d494eb03625fe587c7db2'
const HOST = 'posomega.com'

const sitemap = await fetch(`https://${HOST}/sitemap.xml`).then(r => r.text())
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])

if (urlList.length === 0) {
  console.error('No URLs found in sitemap. Aborting.')
  process.exit(1)
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  }),
})

// 200 = accepted, 202 = accepted but key still being validated. Both are fine.
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URLs`)
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text())
  process.exit(1)
}
