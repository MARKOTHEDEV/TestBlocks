import React, { useState, useEffect } from 'react';

interface InspectorProps {
  block: any;
  onPickElement: () => void;
  isPicking: boolean;
  sdkDetected: boolean;
}

export const Inspector: React.FC<InspectorProps> = ({
  block,
  onPickElement,
  isPicking,
  sdkDetected,
}) => {
  const [fields, setFields] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!block) return;

    const blockFields: Record<string, string> = {};

    // Extract field values from the block
    const inputList = block.inputList;
    for (const input of inputList) {
      for (const field of input.fieldRow) {
        if (field.name) {
          blockFields[field.name] = field.getValue() || '';
        }
      }
    }

    setFields(blockFields);
  }, [block]);

  const handleFieldChange = (fieldName: string, value: string) => {
    if (!block) return;

    const field = block.getField(fieldName);
    if (field) {
      field.setValue(value);
      setFields((prev) => ({ ...prev, [fieldName]: value }));
    }
  };

  const renderField = (
    fieldName: string,
    label: string,
    type: string = 'text'
  ) => {
    const value = fields[fieldName] || '';
    const isTargetField = fieldName === 'qaId' || fieldName === 'containerQaId';

    return (
      <div key={fieldName} className="field-group">
        <label>{label}</label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type={type}
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            style={{ flex: 1 }}
          />
          {isTargetField && (
            <button
              className="pick-button"
              onClick={onPickElement}
              title="Open sample site to get QA ID"
            >
              Get QA ID
            </button>
          )}
        </div>
      </div>
    );
  };

  if (!block) {
    return <p>No block selected</p>;
  }

  const blockType = block.type;

  return (
    <div>
      <h3 style={{ marginBottom: '16px', color: '#333' }}>
        {getBlockDisplayName(blockType)}
      </h3>

      {blockType === 'goto' && <>{renderField('url', 'URL')}</>}

      {blockType === 'click' && <>{renderField('qaId', 'Target Element')}</>}

      {blockType === 'fill' && (
        <>
          {renderField('qaId', 'Target Element')}
          {renderField('value', 'Value')}
        </>
      )}

      {blockType === 'expectVisible' && (
        <>{renderField('qaId', 'Target Element')}</>
      )}

      {blockType === 'withinContainer' && (
        <>
          {renderField('containerQaId', 'Container Element')}
          <div
            style={{
              marginTop: '12px',
              padding: '8px',
              background: '#f8f9fa',
              borderRadius: '4px',
            }}
          >
            <small style={{ color: '#666' }}>
              Drag blocks into this container to scope them
            </small>
          </div>
        </>
      )}

      <div
        style={{
          marginTop: '16px',
          padding: '8px',
          background: '#e9ecef',
          borderRadius: '4px',
        }}
      >
        <small style={{ color: '#666' }}>
          <strong>Block Type:</strong> {blockType}
        </small>
      </div>
    </div>
  );
};

function getBlockDisplayName(blockType: string): string {
  const names: Record<string, string> = {
    goto: 'Go to URL',
    click: 'Click Element',
    fill: 'Fill Input',
    expectVisible: 'Expect Visible',
    withinContainer: 'Within Container',
  };
  return names[blockType] || blockType;
}
