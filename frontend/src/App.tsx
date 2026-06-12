import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './app/routes/AppRoutes';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
