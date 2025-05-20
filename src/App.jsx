// src/App.jsx
import React from 'react';
import { createStore } from 'polotno/model/store';
import {
  PolotnoContainer,
  SidePanelWrap,
  WorkspaceWrap,
} from 'polotno';
import { Toolbar } from 'polotno/toolbar/toolbar';
import { Workspace } from 'polotno/canvas/workspace';
import { SidePanel, DEFAULT_SECTIONS } from 'polotno/side-panel';

import TemplatesPanel from './components/TemplatesPanel';
import PhotosPanel    from './components/PhotosPanel';

export default function App() {
  // 1) Initialize your store & add a page
  const store = React.useMemo(() => {
    const s = createStore({ showCredit: false });
    s.addPage();  
    return s;
  }, []);

  // 2) Pull out the built‑in tabs you want to override
  const defaultTemplates = DEFAULT_SECTIONS.find(s => s.name === 'templates');
  const defaultPhotos    = DEFAULT_SECTIONS.find(s => s.name === 'photos');

  // 3) Build your custom sections array
  const MY_SECTIONS = [
    {
      ...defaultTemplates,
      title: 'My Templates',   // optional rename
      Panel: TemplatesPanel,   // your JSON+PNG panel
    },
    {
      ...defaultPhotos,
      title: 'My Photos',      // optional rename
      Panel: PhotosPanel,      // your custom photo picker
    },
    // finally, all the other default tabs
    ...DEFAULT_SECTIONS.filter(s => !['templates','photos'].includes(s.name)),
  ];

  // 4) Render
  return (
    <PolotnoContainer style={{ width: '100vw', height: '100vh' }}>
      <SidePanelWrap>
        <SidePanel
          store={store}
          sections={MY_SECTIONS}
          defaultSection="templates"  // or "photos" if you’d rather land there first
        />
      </SidePanelWrap>


      <WorkspaceWrap>
        <Toolbar store={store} downloadButtonEnabled />
        <Workspace store={store} />

        <button
          onClick={async () => {
            // 1. JSON download
            const jsonStr = JSON.stringify(store.toJSON());
            const jsonBlob = new Blob([jsonStr], { type: 'application/json' });
            const jsonUrl = URL.createObjectURL(jsonBlob);
            const jsonA = document.createElement('a');
            jsonA.href = jsonUrl;
            jsonA.download = 'template.json';
            jsonA.click();
            URL.revokeObjectURL(jsonUrl);


            // 2. PNG download
            await store.saveAsImage({ fileName: 'template.png', pixelRatio: 2 });
          }}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            padding: '8px 12px',
            background: '#2E8BF0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Download JSON + PNG
        </button>
        
      </WorkspaceWrap>
    </PolotnoContainer>
  );
}