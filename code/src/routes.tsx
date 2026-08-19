import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';

const Home = lazy(() => import('./pages/Home'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Works = lazy(() => import('./pages/Works'));
const Music = lazy(() => import('./pages/Music'));
const Movies = lazy(() => import('./pages/Movies'));
const Stage = lazy(() => import('./pages/Stage'));
const Variety = lazy(() => import('./pages/Variety'));
const Interview = lazy(() => import('./pages/Interview'));
const Gallery = lazy(() => import('./pages/Gallery'));
const About = lazy(() => import('./pages/About'));
const Chat = lazy(() => import('./pages/Chat'));

function PageFallback() {
  return <div className="p-8 text-center text-text-secondary">加载中…</div>;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/works" element={<Works />} />
          <Route path="/music" element={<Music />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/stage" element={<Stage />} />
          <Route path="/variety" element={<Variety />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
