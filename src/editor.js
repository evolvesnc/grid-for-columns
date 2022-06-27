import columnsAttributes from './columns/attributes';
import columnAttributes from './column/attributes';
import columnsControls from './columns/controls';
import columnControls from './column/controls';

wp.hooks.addFilter( 'blocks.registerBlockType', 'evolve/columns-custom-attribute', columnsAttributes );
wp.hooks.addFilter( 'blocks.registerBlockType', 'evolve/column-custom-attribute', columnAttributes );
wp.hooks.addFilter( 'editor.BlockEdit', 'evolve/columns-advanced-controls', wp.compose.createHigherOrderComponent( columnsControls ) );
wp.hooks.addFilter( 'editor.BlockEdit', 'evolve/column-advanced-controls', wp.compose.createHigherOrderComponent( columnControls ) );
