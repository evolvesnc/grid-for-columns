export default function( settings, name ) {
	if ( typeof settings.attributes !== 'undefined' ) {
		if ( name == 'core/columns' ) {
			settings.attributes = Object.assign( settings.attributes, {
				logic: {
					type: 'string',
					default: 'flex'
				},
				fluidLogic: {
					type: 'string',
					default: 'auto-fit'
				},
				gridColumns: {
					type: 'string',
					default: 2
				},
				showGrid: {
					type: 'boolean'
				},
				columnsGap: {
					type: 'string',
				},
				rowsGap: {
					type: 'string',
				},
				colMinWidth: {
					type: 'string'
				},
				mediaQueryMobile: {
					type: 'string'
				},
				mediaId: {
					type: 'Number'
				},
				mediaUrl: {
					type: 'string'
				},
				focalPoint: {
					type: 'object'
				},
				backgroundSize: {
					type: 'string'
				},
				backgroundRepeat: {
					type: 'string'
				},
				backgroundAttachment: {
					type: 'string'
				},
				showMobileBackgroundControls: {
					type: 'boolean'
				},
				mobileFocalPoint: {
					type: 'object'
				},
				overlayColor: {
					type: 'string'
				},
				overlayDimRatio: {
					type: 'number',
					default: 50
				},
				overlayGradient: {
					type: 'string'
				}
			} );
		}
	}

	return settings;
}
