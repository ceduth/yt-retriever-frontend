# ytdt-web

Simple self-service frontend for [YouTube Data Tools API](https://github.com/ceduth/ytdt-api).
Check it in action at [ytdt.ceduth.dev](ytdt.ceduth.dev)

![](assets/screenshot-1.png?raw=true)


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!


## Deploy


### Deploy locally

```shell
docker build . -t harbor.ceduth.dev/project-name/ytdt-web:latest \
  --build-arg EXTERNAL_API_URL=http://localhost:8000 
```

```shell
docker run -p 3000:3000 \
    -e EXTERNAL_API_URL=http://localhost:8000  \
    ytdt-web
```

Open http://localhost:8000 


### Deploy to Kubernetes 

1. Add following secrets to GitHub repository

```shell
gh secret set HARBOR_USERNAME --body "your-username"
gh secret set HARBOR_PASSWORD --body "your-password-value"

gh variable set EXTERNAL_API_URL --body "http://ytdt-api:80"
gh variable set NEXT_PUBLIC_API_URL --body "http://ytdt-api:80"
gh variable set HARBOR_REGISTRY --body "registry.ceduth.dev"
gh variable set HARBOR_PROJECT --body "jfp"
```

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## TODO


* Add the menu to the side of each page
* Persist jobs to storage
* List jobs history
* Channel Analytics: Analyze YouTube channels for subscriber growth, content patterns and more.
* Comment Analyzer: Extract, analyze and visualize YouTube video comments: track sentiment, identify key topics, and discover audience trends.


## FIXME

* No sidebar link for the API Explorer on the Scraper Page
