// in client/src/App.tsx
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage'; // We'll create this in a moment
import PostPage from './pages/PostPage';

function App() {
  return (
    <div>
      <nav>
        <Link to="/">
          <h1>My Modern Blog</h1>
        </Link>
      </nav>
      <hr />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:slug" element={<PostPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;