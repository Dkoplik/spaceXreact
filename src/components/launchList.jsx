function LaunchList({
  launches,
  loading,
  error,
  hoveredLaunchId,
  onHoverLaunch,
  onRefresh,
}) {
  return (
    <aside className="aside" id="launchesContainer">
      <button id="refreshBtn" onClick={onRefresh} disabled={loading}>
        {loading ? 'Refreshing…' : 'Refresh data'}
      </button>

      <div id="listContainer">
        {error && (
          <div className="list-error">Failed to load launches. Try again later.</div>
        )}
        {!error && !loading && launches.length === 0 && (
          <div className="list-error">No launches found.</div>
        )}

        <ul>
          {launches.map(launch => (
            <li
              key={launch.id}
              className={launch.id === hoveredLaunchId ? 'hovered' : ''}
              onMouseEnter={() => onHoverLaunch(launch.id)}
              onMouseLeave={() => onHoverLaunch(null)}
            >
              {launch.name}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export { LaunchList };