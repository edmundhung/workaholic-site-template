import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useQuery } from 'react-query';
import { BrowserRouter, Route, Routes, Outlet, useParams, NavLink } from 'react-router-dom';

async function getContent(slug: string) {
  const response = await fetch(`/api/data/${slug}`);
  const data = await response.json();

  return data?.content ?? null;
}

async function listContents(path = '') {
  const response = await fetch('/api/list');
  const data = await response.json();

  return data;
}

function Documentation() {
  const { slug } = useParams();
  const { data } = useQuery({
    queryKey: ['get', slug],
    queryFn: () => getContent(slug ?? 'index'),
  });

  return (
    <div className="p-4">
      <ReactMarkdown className="prose prose-sm">{data}</ReactMarkdown>
    </div>
  );
}

function Layout() {
  const { data } = useQuery({
    queryKey: 'list',
    queryFn: () => listContents(),
  });

  return (
    <div className="p-4 sm:grid sm:grid-cols-4 gap-4">
      <main className="sm:col-span-3 sm:col-start-2">
        <Outlet />
      </main>
      <nav className="sm:pt-12 sm:col-start-1 sm:order-first">
        <ol className="pt-6 sm:text-right sm:sticky sm:top-6">
          {data?.map(({ slug, metadata }: { slug: string, metadata: Record<string, any> }) => (
            <li key={slug} className="p-1">
              <NavLink to={slug !== 'index' ? slug : '/'} className={({ isActive }) => isActive ? `font-bold` : ``}>{metadata?.title}</NavLink>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

function Demo() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Documentation />} />
          <Route path=":slug" element={<Documentation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Demo;
