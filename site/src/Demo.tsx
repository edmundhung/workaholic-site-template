import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useQuery } from 'react-query';
import { BrowserRouter, Route, Routes, Outlet, useParams, Link } from 'react-router-dom';

async function getContent(slug: string) {
  const response = await fetch(`/data/${slug}`);
  const data = await response.json();

  return data?.content ?? null;
}

async function listContents(path = '') {
  const response = await fetch('/list');
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
      <ReactMarkdown className="prose">{data}</ReactMarkdown>
    </div>
  );
}

function Layout() {
  const { data } = useQuery({
    queryKey: 'list',
    queryFn: () => listContents(),
  });

  return (
    <div className="p-4 grid grid-cols-3 gap-4">
      <main className="col-span-2">
        <Outlet />
      </main>
      <nav className="pt-12">
        <ol>
          {data?.map(({ slug, metadata }: { slug: string, metadata: Record<string, any> }) => (
            <li key={slug}>
              <Link to={slug !== 'index' ? slug : '/'}>{metadata?.title}</Link>
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
