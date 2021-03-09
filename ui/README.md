This folder contains the UI part of the project.

## Development Setup

1. Clone this repo

```bash
git clone https://github.com/dhritimaandas/Traffic_Sign_Recog_Inter_IIT.git
cd Traffic_Sign_Recog_Inter_IIT/ui
```

2. Checkout to your branch (first one of you already created your branch and second one if not)

```bash
git checkout <branchname>
git checkout -b <branchname>
```

3. Now since you are in the root directory for the Next.Js project, install the required packages. (required whenever someone changes package.json)

```bash
yarn install
```

4. Now run the development server.

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

5. After you have made your changes, you can add your files to the staging area.

```bash
git add . (to add all changes)
git add <filename> (to add only the changes in this file)
```

6. Commit changes

```bash
git commit -m <commit message>
```

7. Push the changes to your branch.

```bash
git push origin <yourbranchname>
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## API Routing (Not required for now)

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
