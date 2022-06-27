function changeColumnsBlock( block ) {
	if ( block && typeof block.clientId !== 'undefined' ) {
		let iFrame = document.querySelector( '[name="editor-canvas"]' ),
			ref = document;

		if ( iFrame ) {
			ref = iFrame.contentDocument;
		}

		let el = ref.querySelector( '#block-' + block.clientId );

		if ( el ) {
			el.dataset.useGfc = block.attributes.logic && block.attributes.logic != 'flex' ?  '1' : '0';

			if ( block.attributes.style && block.attributes.style.spacing && block.attributes.style.spacing.padding) {
				if ( block.attributes.style.spacing.padding.left ) {
					el.style.setProperty( '--gfc-delta-l', block.attributes.style.spacing.padding.left );
				}
				if ( block.attributes.style.spacing.padding.right ) {
					el.style.setProperty( '--gfc-delta-r', block.attributes.style.spacing.padding.right );
				}
			}

			el.dataset.showGrid = block.attributes.showGrid ? '1' : '0';

			el.style.setProperty( '--gfc-inner-blocks', block.innerBlocks.length );

			if ( block.attributes.logic != 'flex' ) {
				if ( block.attributes.columnsGap ) {
					el.style.setProperty( '--gfc-columns-gap', block.attributes.columnsGap );
				}
				if ( block.attributes.rowsGap ) {
					el.style.setProperty( '--gfc-rows-gap', block.attributes.rowsGap );
				}

				if ( block.attributes.logic == 'grid-fixed' ) {
					if ( block.attributes.gridColumns ) {
						el.style.setProperty( '--gfc-cols', block.attributes.gridColumns );
					}
				}
				else {
					el.style.setProperty( '--gfc-cols', '' );
				}

				if ( block.attributes.logic == 'grid-fluid' ) {
					el.style.setProperty( '--gfc-grid-auto', block.attributes.fluidLogic );
					el.dataset.fluidLogic = block.attributes.fluidLogic;
				}
				else {
					el.style.setProperty( '--gfc-grid-auto', '' );
					el.dataset.fluidLogic = '';
				}

				if ( block.attributes.colMinWidth ) {
					el.style.setProperty( '--gfc-col-min-width', block.attributes.colMinWidth );
				}

				if ( block.attributes.mediaUrl ) {
					el.dataset.hasBackground = '1';

					el.style.setProperty( '--gfc-cols-bg',
						'url(' + block.attributes.mediaUrl + ')' +
						' ' + (block.attributes.backgroundRepeat ? block.attributes.backgroundRepeat : 'no-repeat') +
						' ' + (block.attributes.focalPoint ? (block.attributes.focalPoint.x * 100) + '% ' + (block.attributes.focalPoint.y * 100) + '%' : '50% 50%') +
						' / ' + (block.attributes.backgroundSize ? block.attributes.backgroundSize : 'auto') +
						' ' + (block.attributes.backgroundAttachment ? block.attributes.backgroundAttachment : 'scroll')
					);

					el.style.setProperty( '--gfc-cols-overlay-color',
						(block.attributes.overlayColor ? block.attributes.overlayColor : '') +
						( block.attributes.overlayGradient ? block.attributes.overlayGradient : '' )
					);

					el.style.setProperty( '--gfc-cols-overlay-opacity',
						( block.attributes.overlayDimRatio || block.attributes.overlayDimRatio === 0 ? block.attributes.overlayDimRatio / 100 : '.5')
					);

					if ( block.attributes.style ) {
						if ( block.attributes.style.border && block.attributes.style.border.width ) {
							el.style.setProperty( '--gfc-cols-border-width', block.attributes.style.border.width );
						}
						if ( block.attributes.style.border && block.attributes.style.border.radius ) {
							el.style.setProperty( '--gfc-cols-border-radius', block.attributes.style.border.radius );
						}
					}
				}
				else {
					el.dataset.hasBackground = '';
				}

				if ( block.attributes.mediaQueryMobile ) {
					el.dataset.mediaQueryMobile = block.attributes.mediaQueryMobile;
				}
				else {
					el.dataset.mediaQueryMobile = '';
				}
			}
			else {
				el.style.removeProperty( '--gfc-cols' );
				el.style.removeProperty( '--gfc-columns-gap' );
				el.style.removeProperty( '--gfc-col-min-width' );
				el.style.removeProperty( '--gfc-grid-auto' );
				el.style.removeProperty( '--gfc-cols-bg' );
				el.style.removeProperty( '--gfc-cols-overlay-color' );
				el.style.removeProperty( '--gfc-cols-overlay-opacity' );
				el.style.removeProperty( '--gfc-cols-border-width' );
				el.style.removeProperty( '--gfc-cols-border-radius' );
			}
		}
	}
}

export default function( BlockEdit ) {
	return (props) => {
		const { Fragment } = wp.element;
		const { SelectControl, Button, FocalPointPicker, ToggleControl, __experimentalNumberControl, __experimentalUnitControl, Panel, PanelBody, RangeControl } = wp.components;
		const { InspectorControls, MediaUpload, MediaUploadCheck,__experimentalPanelColorGradientSettings, __experimentalUseGradient } = wp.blockEditor;
		const { select } = wp.data;
		const { attributes, setAttributes, isSelected } = props;
		const { mediaId } = attributes;
		let columnsBlock = null;
		let initialOpen = true;

		if ( props.name !== 'core/columns' ) {
			return <BlockEdit {...props} />;
		}

		columnsBlock = select( 'core/block-editor' ).getBlocksByClientId( props.clientId )[ 0 ];

		if ( columnsBlock ) {
			changeColumnsBlock( columnsBlock );
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

		if ( props.name == 'core/columns' ) {
			let newDocument = document;

			if ( document.querySelector( '[name=editor-canvas]' ) ) {
				newDocument = document.querySelector( '[name=editor-canvas]' ).contentWindow.document;
			}

			let el = newDocument.querySelector('#block-' + props.clientId);

			if ( el ) {
				setTimeout(() => {
					if ( newDocument.querySelectorAll( '#block-' + props.clientId + ' > .gfc-bg-helper').length == 0 ) {
						let span = newDocument.createElement('span');
						span.setAttribute('class', 'gfc-bg-helper');
						el.appendChild(span);
					}
				}, 10 );
			}
		}

		return (
			<Fragment>
				<BlockEdit {...props} />
				{isSelected && (props.name == 'core/columns') &&
					<InspectorControls>
						<Panel>
							<PanelBody className="gfc-panel" title={wp.i18n.__('Structure', 'grid-for-columns')} initialOpen={ initialOpen }>
								<SelectControl
									label={wp.i18n.__('Logic', 'grid-for-columns')}
									value={ attributes.logic }
									options={ [
										{ label: wp.i18n.__('Default behaviour (Flexbox)', 'grid-for-columns'), value: 'flex' },
										{ label: wp.i18n.__('Fixed grid', 'grid-for-columns'), value: 'grid-fixed' },
										{ label: wp.i18n.__('Fluid grid', 'grid-for-columns'), value: 'grid-fluid' }
									] }
									onChange={ ( newval ) => setAttributes({ logic: newval }) }
								/>

								{ attributes.logic != 'flex' && attributes.logic == 'grid-fixed' &&
									<div class="components-base-control">
										<__experimentalNumberControl
											label={wp.i18n.__('Grid columns', 'grid-for-columns')}
											value={attributes.gridColumns}
											onChange={(newval) => setAttributes({ gridColumns: newval })}
										/>
									</div>
								}

								{ attributes.logic != 'flex' && attributes.logic == 'grid-fluid' &&
									<div class="gfc-components-base-control">
										<SelectControl
											label={wp.i18n.__('Fluid logic', 'grid-for-columns')}
											value={ attributes.fluidLogic }
											options={ [
												{ label: wp.i18n.__('Auto fit', 'grid-for-columns'), value: 'auto-fit' },
												{ label: wp.i18n.__('Auto fill', 'grid-for-columns'), value: 'auto-fill' }
											] }
											onChange={ ( newval ) => setAttributes({ fluidLogic: newval }) }
										/>
										{ attributes.fluidLogic == 'auto-fit' &&
											<p class="gfc-control-help">{wp.i18n.__('Fit whatever columns there are into the space. Prefer expanding columns to fill space rather than empty columns', 'grid-for-columns')}</p>
										}
										{ attributes.fluidLogic == 'auto-fill' &&
											<p class="gfc-control-help">{wp.i18n.__('Fit as many possible columns as possible on a row, even if they are empty', 'grid-for-columns')}</p>
										}
									</div>
								}

								{ attributes.logic != 'flex' && attributes.logic == 'grid-fixed' &&
									<ToggleControl
										label={wp.i18n.__('Show grid', 'grid-for-columns')}
										checked={ !!attributes.showGrid }
										onChange={(newval) => setAttributes({ showGrid: !attributes.showGrid })}
									/>
								}

								{ attributes.logic != 'flex' &&
									<div class="components-base-control gfc-inline-controls">
										<__experimentalUnitControl
											label={wp.i18n.__('Columns gap', 'grid-for-columns')}
											onChange={ (newval) => setAttributes({ columnsGap: newval }) }
											value={ attributes.columnsGap }
										/>
										<__experimentalUnitControl
											label={wp.i18n.__('Rows gap', 'grid-for-columns')}
											onChange={ (newval) => setAttributes({ rowsGap: newval }) }
											value={ attributes.rowsGap }
										/>
									</div>
								}

								{ attributes.logic != 'flex' && attributes.logic == 'grid-fluid' &&
									<div class="components-base-control">
										<__experimentalUnitControl
											label={wp.i18n.__('Column min width', 'grid-for-columns')}
											onChange={ (newval) => setAttributes({ colMinWidth: newval }) }
											value={ attributes.colMinWidth }
										/>
										<p class="gfc-control-help">{wp.i18n.__('Default value 100px', 'grid-for-columns')}</p>
									</div>
								}

								{ attributes.logic != 'flex' && attributes.isStackedOnMobile &&
									<div class="components-base-control">
										<__experimentalUnitControl
											label={wp.i18n.__('Media query value', 'grid-for-columns')}
											onChange={ (newval) => setAttributes({ mediaQueryMobile: newval }) }
											value={ attributes.mediaQueryMobile }
										/>
										<p class="gfc-control-help">{wp.i18n.__('Default value 599px', 'grid-for-columns')}</p>
									</div>
								}
							</PanelBody>
						</Panel>
						{ attributes.logic != 'flex' &&
						<Panel>
							<PanelBody className="gfc-panel" title={wp.i18n.__('Background', 'grid-for-columns')} initialOpen={ initialOpen }>
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
						}

						{ attributes.mediaId &&
						<__experimentalPanelColorGradientSettings
							className="gfc-panel"
							__experimentalHasMultipleOrigins
							__experimentalIsRenderedInSidebar
							title={ wp.i18n.__( 'Overlay' ) }
							initialOpen={ initialOpen }
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
