// src/components/TemplatesPanel.jsx

import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

const TemplatesPanel = observer(({ store }) => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetch('/templates/index.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setTemplates)
      .catch((err) => console.error('Failed to load templates:', err));
  }, []);

  return (
    <div
      style={{
        padding: 12,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 12,
      }}
    >
      {templates.map((t) => (
        <div
          key={t.id}
          onClick={async () => {
            try {
              const res = await fetch(t.jsonUrl);
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              const json = await res.json();
              store.loadJSON(json);
              await store.waitLoading();
            } catch (err) {
              console.error('Failed to load template:', err);
            }
          }}
          style={{
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          <img
            src={t.previewUrl}
            alt={t.name}
            style={{
              width: '100%',
              height: 80,
              objectFit: 'cover',
              borderRadius: 4,
              border: '1px solid #ddd',
            }}
          />
          <div style={{ marginTop: 6, fontSize: 12 }}>{t.name}</div>
        </div>
      ))}
    </div>
  );
});

export default TemplatesPanel;