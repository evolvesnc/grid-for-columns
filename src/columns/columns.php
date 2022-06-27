<?php

/**
 * Columns functionality.
 *
 * @param string $block_content The block markup.
 * @param array $block The block data.
 * @return void
 */
function gfc_columns( $block_content, $block ) {
	if( "core/columns" !== $block['blockName'] ) {
		return $block_content;
	}

	if ( ! isset( $block['attrs']['logic'] ) || $block['attrs']['logic'] === 'flex' ) {
		return $block_content;
	};

	$columns_vars    = [];
	$columns_classes = [];
	$columns_style   = '';
	$columns_helper  = '';
	$useGrid         = 'data-use-gfc = 1';
	$mobileOverride  = isset( $block['attrs']['showMobileBackgroundControls'] ) && $block['attrs']['showMobileBackgroundControls'] ? true : false;

	if ( ! isset( $block['attrs']['isStackedOnMobile'] ) || $block['attrs']['isStackedOnMobile'] === null ) {
		$uid = wp_unique_id();
		$columns_classes[] = 'is-stacked-on-mobile';
		$columns_classes[] = 'wp-block-columns-' . $uid;

		if ( isset( $block['attrs']['mediaQueryMobile'] ) ) {
			$columns_style .= sprintf( '@media (max-width:%s) {', esc_attr( $block['attrs']['mediaQueryMobile'] ) );
				$columns_style .= '.wp-block-columns-' . $uid . '[data-use-gfc="1"] > .wp-block-column {--gfc-col-size: 1;--gfc-shift: 0}';

				$columns_style .= '.wp-block-columns-' . $uid . '[data-use-gfc="1"] {';
					$columns_style .= '--gfc-grid-template: 100%;';
				$columns_style .= '}';

				if ( $mobileOverride && isset( $block['attrs']['mobileFocalPoint'] ) ) {
					$columns_style .= '.wp-block-columns-' . $uid . '[data-use-gfc="1"] > .gfc-bg-helper::before {';
						$columns_style .= 'background-position:' . $block['attrs']['mobileFocalPoint']['x'] * 100 . '% ' . $block['attrs']['mobileFocalPoint']['y'] * 100 . '% !important';
					}
				$columns_style .= '}';
			$columns_style .= '}';
		}
		else {
			if ( $mobileOverride && isset( $block['attrs']['mobileFocalPoint'] ) )  {
				$columns_style .= sprintf( '@media (max-width:%s) {', esc_attr( $block['attrs']['mediaQueryMobile'] ) );
					$columns_style .= '.wp-block-columns-' . $uid . '[data-use-gfc="1"] > .gfc-bg-helper::before {';
						$columns_style .= 'background-position:' . $block['attrs']['mobileFocalPoint']['x'] * 100 . '% ' . $block['attrs']['mobileFocalPoint']['y'] * 100 . '% !important';
					$columns_style .= '}';
				$columns_style .= '}';
			}
		}
	}

	if ( $block['attrs']['logic'] === 'grid-fluid' ) {
		$fluidLogic = ! empty( $block['attrs']['fluidLogic'] ) ? $block['attrs']['fluidLogic'] : 'auto-fit';
		$columns_vars[] = '--gfc-grid-auto:' . $fluidLogic;
	}
	else {
		if ( ! empty( $block['attrs']['gridColumns'] ) ) {
			$columns_vars[] = '--gfc-cols:' . $block['attrs']['gridColumns'];
		}
	}

	if ( ! empty( $block['attrs']['columnsGap'] ) ) {
		$columns_vars[] = '--gfc-columns-gap:' . $block['attrs']['columnsGap'];
	}
	if ( ! empty( $block['attrs']['rowsGap'] ) ) {
		$columns_vars[] = '--gfc-rows-gap:' . $block['attrs']['rowsGap'];
	}
	if ( ! empty( $block['attrs']['colMinWidth'] ) ) {
		$columns_vars[] = '--gfc-col-min-width:' . $block['attrs']['colMinWidth'];
	}

	if ( ! empty( $block['attrs']['mediaUrl'] ) ) {
		$columns_helper = '<span class="gfc-bg-helper"></span>';

		$columns_vars[] = '--gfc-cols-bg:url(' . $block['attrs']['mediaUrl'] . ') '
			. ( ! empty( $block['attrs']['backgroundRepeat'] ) ? ' ' . $block['attrs']['backgroundRepeat'] : 'no-repeat' )
			. ' ' . ( ! empty( $block['attrs']['focalPoint'] ) ? ' ' . $block['attrs']['focalPoint']['x'] * 100 . '% ' . $block['attrs']['focalPoint']['y'] * 100 . '%' : '50% 50%' )
			. ' / ' . ( ! empty( $block['attrs']['backgroundSize'] ) ? ' ' . $block['attrs']['backgroundSize'] : 'auto' )
			. ' ' . ( ! empty( $block['attrs']['backgroundAttachment'] ) ? ' ' . $block['attrs']['backgroundAttachment'] : 'scroll' )
		;

		$columns_vars[] = '--gfc-cols-overlay-opacity:' . ($block['attrs']['overlayDimRatio'] ? $block['attrs']['overlayDimRatio'] / 100 : '0.5');
		$columns_vars[] = '--gfc-cols-overlay-color:'
			. ( ! empty( $block['attrs']['overlayColor'] ) ? $block['attrs']['overlayColor'] : '' )
			. ( ! empty( $block['attrs']['overlayGradient'] ) ? $block['attrs']['overlayGradient'] : '' )
		;
	}

	preg_match('/<div class="wp-block-columns(.*?)"(.*?) style="(.*?)">/i', $block_content, $matches);
	preg_match('/<div class="wp-block-columns(.*?)">/i', $block_content, $matches2);

	if ( ! empty( $block['attrs']['style'] ) && ! empty( $block['attrs']['style']['border'] ) ) {
		if ( ! empty( $block['attrs']['style']['border']['width'] ) ) {
			$columns_vars[] = '--gfc-cols-border-width:' . $block['attrs']['style']['border']['width'];
		}
		if ( ! empty( $block['attrs']['style']['border']['radius'] ) ) {
			$columns_vars[] = '--gfc-cols-border-radius:' . $block['attrs']['style']['border']['radius'];
		}
	}

	if ( isset( $matches[3] ) && ! empty( $matches2[0] ) ) {
		$block_content = preg_replace(
			'/<div class="wp-block-columns(.*?)"(.*?) style="(.*?)">/i',
			'<div class="wp-block-columns$1 ' . esc_attr( implode( ' ', $columns_classes ) ) . '" $2 ' . esc_attr( $useGrid ) . ' style="$3;' . esc_attr( implode( ';', $columns_vars ) ) . '">' . wp_kses_post( $columns_helper ),
			$block_content,
			1
		);
	}
	else if ( ! empty( $matches2[0] ) ) {
		$block_content = preg_replace(
			'/<div class="wp-block-columns(.*?)"(.*?)>/i',
			'<div class="wp-block-columns$1 ' . esc_attr( implode( ' ', $columns_classes ) ) . '" $2 ' . esc_attr( $useGrid ) . ' style="' . esc_attr( implode( ';', $columns_vars ) ) . '">' . wp_kses_post( $columns_helper ),
			$block_content,
			1
		);
	}

	if ( ! empty( $columns_style ) ) {
		wp_enqueue_block_support_styles( $columns_style );
	}

	return $block_content;
};

add_filter( 'render_block', 'gfc_columns', 10, 3 );
