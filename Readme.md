See [https://codereviewvideos.com/url-checker/typescript/]

# To run

1. Clone the project
2. `npm i`
3. `node dist/index.js http://example.com`

If it all works, you should see something like:

```
➜  link-visitor-typescript git:(main) node dist/index.js http://example.com
(node:2633895) ExperimentalWarning: The Fetch API is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
[
  {
    url: 'http://example.com/',
    status: 200,
    statusText: 'OK',
    ok: true,
    redirected: false,
    headers: {
      'accept-ranges': 'bytes',
      age: '466460',
      'cache-control': 'max-age=604800',
      'content-encoding': 'gzip',
      'content-length': '648',
      'content-type': 'text/html; charset=UTF-8',
      date: 'Thu, 22 Dec 2022 16:25:42 GMT',
      etag: '"3147526947+gzip"',
      expires: 'Thu, 29 Dec 2022 16:25:42 GMT',
      'last-modified': 'Thu, 17 Oct 2019 07:18:26 GMT',
      server: 'ECS (nyb/1D10)',
      vary: 'Accept-Encoding',
      'x-cache': 'HIT'
    }
  }
]
```

Enjoy.