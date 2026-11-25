import { useCallback, useEffect, useState } from 'react';
import { LaunchList } from './launchList';
import { PadMap } from './padMap';
import { SpaceX } from '../api/spacex';

const spacex = new SpaceX();

function App() {
  const [launches, setLaunches] = useState([]);
  const [hoveredLaunchId, setHoveredLaunchId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadLaunches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await spacex.launches();
      setLaunches(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLaunches();
  }, [loadLaunches]);

  const hoveredLaunch = launches.find(l => l.id === hoveredLaunchId) || null;

  return (
    <main className="main">
      <LaunchList
        launches={launches}
        loading={loading}
        error={error}
        hoveredLaunchId={hoveredLaunchId}
        onHoverLaunch={setHoveredLaunchId}
        onRefresh={loadLaunches}
      />

      <div className="content">
        <div className="pad-info">
          {hoveredLaunch
            ? `${hoveredLaunch.name}
            — ${hoveredLaunch.pad?.name ?? 'Unknown pad'}
            — ${hoveredLaunch.pad?.location?.name ?? 'Unknown location'}`
            : 'Hover a launch to see pad details'}
        </div>
        <PadMap launches={launches} hoveredLaunchId={hoveredLaunchId} />
      </div>
    </main>
  );
}

export { App };