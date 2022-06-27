export default function( settings, name ) {
	if ( typeof settings.attributes !== 'undefined' ) {
		if ( name == 'core/column' ) {
			settings.attributes = Object.assign( settings.attributes, {
				useGfc: {
					type: 'string',
					default: '0'
				},
				colSize: {
					type: 'string',
					default: 1
				},
				colShift: {
					type: 'string',
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
				},
				mediaQueryMobile: {
					type: 'string'
				},
			} );
		}
	}

	return settings;
}
