import * as Blockly from 'blockly';

export function defineBlocks() {
  // Go to URL block
  Blockly.Blocks['goto'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Go to')
        .appendField(new Blockly.FieldTextInput('/login'), 'url');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
      this.setTooltip('Navigate to a URL');
      this.setHelpUrl('');
    },
  };

  // Click element block
  Blockly.Blocks['click'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Click')
        .appendField(new Blockly.FieldTextInput(''), 'qaId');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip('Click an element by QA ID');
      this.setHelpUrl('');
    },
  };

  // Fill input block
  Blockly.Blocks['fill'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Fill')
        .appendField(new Blockly.FieldTextInput(''), 'qaId')
        .appendField('with')
        .appendField(new Blockly.FieldTextInput(''), 'value');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(160);
      this.setTooltip('Fill an input field with text');
      this.setHelpUrl('');
    },
  };

  // Expect visible block
  Blockly.Blocks['expectVisible'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Expect')
        .appendField(new Blockly.FieldTextInput(''), 'qaId')
        .appendField('to be visible');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(290);
      this.setTooltip('Assert that an element is visible');
      this.setHelpUrl('');
    },
  };

  // Within container block
  Blockly.Blocks['withinContainer'] = {
    init: function () {
      this.appendDummyInput()
        .appendField('Within container')
        .appendField(new Blockly.FieldTextInput(''), 'containerQaId');
      this.appendStatementInput('steps').setCheck(null);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(120);
      this.setTooltip('Execute steps within a specific container');
      this.setHelpUrl('');
    },
  };

  // Generate JavaScript code for blocks
  // Note: We'll handle code generation in the App component instead
  // since Blockly.JavaScript is not available in this context
}
