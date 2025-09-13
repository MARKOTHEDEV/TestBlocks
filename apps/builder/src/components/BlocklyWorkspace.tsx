import React, { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';
import { defineBlocks } from '../blocks/defineBlocks';

interface BlocklyWorkspaceProps {
  onWorkspaceChange: (workspace: any) => void;
  onBlockSelect: (block: any) => void;
}

export const BlocklyWorkspace: React.FC<BlocklyWorkspaceProps> = ({
  onWorkspaceChange,
  onBlockSelect,
}) => {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const blocklyWorkspaceRef = useRef<any>(null);

  useEffect(() => {
    if (!workspaceRef.current) return;

    // Define custom blocks
    defineBlocks();

    // Create workspace
    const workspace = Blockly.inject(workspaceRef.current, {
      toolbox: {
        kind: 'flyoutToolbox',
        contents: [
          {
            kind: 'block',
            type: 'goto',
          },
          {
            kind: 'block',
            type: 'click',
          },
          {
            kind: 'block',
            type: 'fill',
          },
          {
            kind: 'block',
            type: 'expectVisible',
          },
          {
            kind: 'block',
            type: 'withinContainer',
          },
        ],
      },
      grid: {
        spacing: 20,
        length: 3,
        colour: '#ccc',
        snap: true,
      },
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
      },
      trashcan: true,
      media: 'https://unpkg.com/blockly/media/',
    });

    blocklyWorkspaceRef.current = workspace;
    onWorkspaceChange(workspace);

    // Listen for block selection
    workspace.addChangeListener((event: any) => {
      if (event.type === Blockly.Events.SELECTED) {
        const block = event.newElementId
          ? workspace.getBlockById(event.newElementId)
          : null;
        onBlockSelect(block);
      }
    });

    // Listen for block changes
    workspace.addChangeListener((event: any) => {
      if (
        event.type === Blockly.Events.BLOCK_CREATE ||
        event.type === Blockly.Events.BLOCK_DELETE ||
        event.type === Blockly.Events.BLOCK_CHANGE
      ) {
        onWorkspaceChange(workspace);
      }
    });

    return () => {
      workspace.dispose();
    };
  }, [onWorkspaceChange, onBlockSelect]);

  return (
    <div className="blockly-container">
      <div
        ref={workspaceRef}
        className="blockly-workspace"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
