// src/components/PhotosPanel.jsx
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

const PhotosPanel = observer(({ store }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/photos/index.json')
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        setPhotos(data);
      })
      .catch((err) => console.error('Failed to load photos list:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleClick = (p) => {
    const page  = store.activePage;
    const pageW = page.computedWidth;
    const pageH = page.computedHeight;

    page.addElement({
      type:   'image',
      src:     p.url,
      x:      pageW * 0.1,
      y:      pageH * 0.1,
      width:  pageW * 0.8,
      height: pageH * 0.8,
    });
  };

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={styles.grid}>
      {photos.map((p) => (
        <div
          key={p.id}
          style={styles.thumbWrapper}
          onClick={() => handleClick(p)}
        >
          <img
            loading="lazy"
            src={p.previewUrl}
            alt={p.name}
            style={styles.thumbImage}
          />
          <div style={styles.thumbLabel}>{p.name}</div>
        </div>
      ))}
    </div>
  );
});

const styles = {
  loaderContainer: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    height:         '100%',
  },
  loader: {
    fontSize: '1.2rem',
    color:    '#555',
  },
  grid: {
    padding:             12,
    display:             'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px,1fr))',
    gap:                 12,
  },
  thumbWrapper: {
    cursor:       'pointer',
    textAlign:    'center',
    border:       '1px solid #ddd',
    borderRadius: 4,
    overflow:     'hidden',
  },
  thumbImage: {
    width:     '100%',
    height:    80,
    objectFit: 'cover',
  },
  thumbLabel: {
    padding:  4,
    fontSize: 12,
  },
};

export default PhotosPanel;