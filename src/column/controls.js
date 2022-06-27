function changeColumnBlock( block ) {
	if ( block && typeof block.clientId !== 'undefined' ) {
		let iFrame = document.querySelector( '[name="editor-canvas"]' ),
			ref = document;

		if ( iFrame ) {
			ref = iFrame.contentDocument;
		}

		let el = ref.querySelector( '#block-' + block.clientId );

		if ( el ) {
			let parent = ref.querySelector( '#block-' + block.clientId ).parentElement;
			block.attributes.useGfc = parent.getAttribute('data-use-gfc');
			block.attributes.mediaQueryMobile = parent.getAttribute( 'data-media-query-mobile' );

			el.style.removeProperty( '--gfc-col' );
			el.style.removeProperty( '--gfc-col-shift' );
			el.style.removeProperty( '--gfc-col-bg' );
			el.style.removeProperty( '--gfc-col-overlay-color' );
			el.style.removeProperty( '--gfc-col-overlay-opacity' );

			if ( block.attributes.colSize ) {
				el.style.setProperty( '--gfc-col', block.attributes.colSize );
			}

			if ( block.attributes.colShift ) {
				el.style.setProperty( '--gfc-col-shift', block.attributes.colShift );
			}

			if ( block.attributes.mediaUrl ) {
				el.dataset.hasBackground = '1';

				el.style.setProperty( '--gfc-col-bg',
					'url(' + block.attributes.mediaUrl + ')' +
					' ' + (block.attributes.backgroundRepeat ? block.attributes.backgroundRepeat : 'no-repeat') +
					' ' + (block.attributes.focalPoint ? (block.attributes.focalPoint.x * 100) + '% ' + (block.attributes.focalPoint.y * 100) + '%' : '50% 50%') +
					' / ' + (block.attributes.backgroundSize ? block.attributes.backgroundSize : 'auto') +
					' ' + (block.attributes.backgroundAttachment ? block.attributes.backgroundAttachment : 'scroll')
				);

				el.style.setProperty( '--gfc-col-overlay-color',
					(block.attributes.overlayColor ? block.attributes.overlayColor : '') +
					( block.attributes.overlayGradient ? block.attributes.overlayGradient : '' )
				);

				el.style.setProperty( '--gfc-col-overlay-opacity',
					( block.attributes.overlayDimRatio || block.attributes.overlayDimRatio === 0 ? block.attributes.overlayDimRatio / 100 : '.5')
				);
			}
			else {
				el.dataset.hasBackground = '';
			}
		}
	}
}

export default function( BlockEdit ) {
	return (props) => {
		const { Fragment, useState } = wp.element;
		const { SelectControl, Button, FocalPointPicker, ToggleControl, __experimentalNumberControl, __experimentalUnitControl, Panel, PanelBody, RangeControl } = wp.components;
		const { InspectorControls, MediaUpload, MediaUploadCheck,__experimentalPanelColorGradientSettings, __experimentalUseGradient } = wp.blockEditor;
		const { select } = wp.data;
		const { attributes, setAttributes, isSelected } = props;
		const { mediaId } = attributes;

		let columnBlock = null;

		if ( props.name !== 'core/column' ) {
			return <BlockEdit {...props} />;
		}

		columnBlock = select( 'core/block-editor' ).getBlocksByClientId( props.clientId )[ 0 ];

		if ( columnBlock ) {
			changeColumnBlock( columnBlock );
		}

		const removeImage = () => {
			setAttributes({
				mediaUrl: null,
				mediaId: null,
			});
		}

		const onSelectImage = media => {
			setAttributes({
				mediaUrl: media.url,
				mediaId: media.id
			});
		};

		const setOverlayColor = ( value ) => {
			setAttributes({
				overlayColor: value
			});
		};

		const setGradient = ( value ) => {
			setAttributes({
				overlayGradient: value
			});
		};

		const ALLOWED_MEDIA_TYPES = [ 'image' ];

		if ( props.name == 'core/column' ) {
			let newDocument = document;

			if ( document.querySelector( '[name=editor-canvas]' ) ) {
				newDocument = document.querySelector( '[name=editor-canvas]' ).contentWindow.document;
			}

			let el = newDocument.querySelector('#block-' + props.clientId);

			if ( el && ! el.querySelectorAll('.gfc-bg-helper').length ) {
				let span = newDocument.createElement('span');
				span.setAttribute('class', 'gfc-bg-helper');
				el.appendChild(span);
			}
		}

		return (
			<Fragment>
				<BlockEdit {...props} />
				{isSelected && (props.name == 'core/column') && attributes.useGfc && attributes.useGfc != '0' &&
					<InspectorControls>
						<Panel>
							<PanelBody className="gfc-panel" title={wp.i18n.__('Grid properties', 'grid-for-columns')} initialOpen={ true }>
								<div class="components-base-control gfc-inline-controls">
									<__experimentalNumberControl
										label={wp.i18n.__('Size', 'grid-for-columns')}
										value={attributes.colSize}
										onChange={(newval) => setAttributes({ colSize: newval })}
									/>

									<__experimentalNumberControl
										label={wp.i18n.__('Shift', 'grid-for-columns')}
										value={attributes.colShift}
										onChange={(newval) => setAttributes({ colShift: newval })}
									/>
								</div>
							</PanelBody>
						</Panel>

						<Panel>
							<PanelBody className="gfc-panel" title={wp.i18n.__('Background', 'grid-for-columns')} initialOpen={ true }>
								{ !attributes.mediaId &&
									<MediaUploadCheck>
										<MediaUpload
											onSelect={onSelectImage}
											type="image"
											value={mediaId}
											allowedTypes={ALLOWED_MEDIA_TYPES}
											render={({ open }) => (
											<Button
												variant={"primary"}
												onClick={open}
											>{wp.i18n.__('Upload image', 'grid-for-columns')}</Button>
											)}
										/>
									</MediaUploadCheck>
								}

								{ attributes.mediaId &&
									<Button
										variant={'secondary'}
										isDestructive
										isSmall
										onClick={removeImage}>{wp.i18n.__('Remove image', 'grid-for-columns')}</Button>
								}

								{ attributes.mediaUrl &&
									<Fragment>
										<FocalPointPicker
											label={ wp.i18n.__('Background position', 'grid-for-columns') }
											url={ attributes.mediaUrl }
											value={ attributes.focalPoint }
											onChange={ ( newFocalPoint ) => setAttributes( { focalPoint: newFocalPoint } )
											}
										/>
										<SelectControl
											label={wp.i18n.__('Background repeat', 'grid-for-columns')}
											value={ attributes.backgroundRepeat }
											options={ [
												{ label: wp.i18n.__('No repeat', 'grid-for-columns'), value: 'no-repeat' },
												{ label: wp.i18n.__('Repeat', 'grid-for-columns'), value: 'repeat' },
												{ label: wp.i18n.__('Repeat horizontally', 'grid-for-columns'), value: 'repeat-x' },
												{ label: wp.i18n.__('Repeat vertically', 'grid-for-columns'), value: 'repeat-y' },
												{ label: wp.i18n.__('Space', 'grid-for-columns'), value: 'space' },
												{ label: wp.i18n.__('Round', 'grid-for-columns'), value: 'round' }
											] }
											onChange={ ( newval ) => setAttributes({ backgroundRepeat: newval }) }
										/>
										<SelectControl
											label={wp.i18n.__('Background size', 'grid-for-columns')}
											value={ attributes.backgroundSize }
											options={ [
												{ label: wp.i18n.__('Auto', 'grid-for-columns'), value: 'auto' },
												{ label: wp.i18n.__('Cover', 'grid-for-columns'), value: 'cover' },
												{ label: wp.i18n.__('Contain', 'grid-for-columns'), value: 'contain' },
											] }
											onChange={ ( newval ) => setAttributes({ backgroundSize: newval }) }
										/>
										<SelectControl
											label={wp.i18n.__('Background attachment', 'grid-for-columns')}
											value={ attributes.backgroundAttachment }
											options={ [
												{ label: wp.i18n.__('Default', 'grid-for-columns'), value: 'scroll' },
												{ label: wp.i18n.__('Fixed', 'grid-for-columns'), value: 'fixed' }
											] }
											onChange={ ( newval ) => setAttributes({ backgroundAttachment: newval }) }
										/>

										<ToggleControl
											label={wp.i18n.__('Change attributes for mobile media query', 'grid-for-columns')}
											checked={ !!attributes.showMobileBackgroundControls }
											onChange={(newval) => setAttributes({ showMobileBackgroundControls: !attributes.showMobileBackgroundControls })}
										/>
										{ attributes.showMobileBackgroundControls &&
											<div class="gfc-components-base-control">
												<FocalPointPicker
													label={ wp.i18n.__('Background position', 'grid-for-columns') }
													url={ attributes.mediaUrl }
													value={ attributes.mobileFocalPoint }
													onChange={ ( newFocalPoint ) => setAttributes( { mobileFocalPoint: newFocalPoint } )
													}
												/>
												<p class="gfc-control-help">{wp.i18n.__('Specify a custom background position for mobile media query', 'grid-for-columns')}</p>
											</div>
										}
									</Fragment>
								}
							</PanelBody>

						</Panel>

						{ attributes.mediaId &&
						<__experimentalPanelColorGradientSettings
							className="gfc-panel"
							__experimentalHasMultipleOrigins
							__experimentalIsRenderedInSidebar
							title={ wp.i18n.__( 'Overlay' ) }
							initialOpen={ true }
							settings={ [
								{
									colorValue: attributes.overlayColor,
									gradientValue: attributes.overlayGradient,
									onColorChange: setOverlayColor,
									onGradientChange: setGradient,
									label: wp.i18n.__( 'Color' ),
								},
							] }
						>
							<RangeControl
								label={ wp.i18n.__( 'Opacity' ) }
								value={ attributes.overlayDimRatio }
								onChange={ ( newDimRation ) =>
									setAttributes( {
										overlayDimRatio: newDimRation,
									} )
								}
								min={ 0 }
								max={ 100 }
								step={ 10 }
								required
							/>
						</__experimentalPanelColorGradientSettings>
						}

					</InspectorControls>
				}
			</Fragment>
		);
	};
};
