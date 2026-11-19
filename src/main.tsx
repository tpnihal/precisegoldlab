import { ViteReactSSG } from 'vite-react-ssg';
import type { RouteRecord } from 'vite-react-ssg';
import { RootLayout } from '@/components/layout/RootLayout';
import { HomePage } from '@/pages/HomePage';
import { BlogIndexPage } from '@/pages/BlogIndexPage';
import { BlogPostPage } from '@/pages/BlogPostPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { getAllPosts } from '@/lib/blog';
import '@/styles/index.css';

export const routes: RouteRecord[] = [
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: 'blog',
        Component: BlogIndexPage,
      },
      {
        path: 'blog/:slug',
        Component: BlogPostPage,
        getStaticPaths: () => getAllPosts().map((p) => `blog/${p.slug}`),
      },
      {
        path: '404',
        Component: NotFoundPage,
      },
      {
        path: '*',
        Component: NotFoundPage,
      },
    ],
  },
];

export const createRoot = ViteReactSSG({ routes });
