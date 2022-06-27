<?php

/**
 * Column functionality.
 *
 * @param string $block_content The block markup.
 * @param array $block The block data.
 * @return void
 */
function gfc_column( $block_content, $block ) {
	if( "core/column" !== $block['blockName'] ) {
		return $block_content;
	}

	$column_vars    = [];
	$column_style   = '';
	$column_helper  = '';
	$column_classes = [];
	$mobileOverride = isset( $block['attrs']['showMobileBackgroundControls'] ) && $block['attrs']['showMobileBackgroundControls'] ? true: false;

	if ( $mobileOverride ) {
		$uid = wp_unique_id();
		$column_classes[] = 'wp-block-column-' . $uid;

		if ( isset( $block['attrs']['mediaQueryMobile'] ) ) {
			$column_style .= sprintf( '@media (max-width:%s) {', esc_attr( $block['attrs']['mediaQueryMobile'] ) );
				$column_style .= '.wp-block-column-' . $uid . ' > .gfc-bg-helper::before {';
					if ( $mobileOverride && isset( $block['attrs']['mobileFocalPoint'] ) ) {
						$column_style .= 'background-position:' . $block['attrs']['mobileFocalPoint']['x'] * 100 . '% ' . $block['attrs']['mobileFocalPoint']['y'] * 100 . '% !important';
					}
				$column_style .= '}';
			$column_style .= '}';
		}
		else {
			if ( isset( $block['attrs']['mobileFocalPoint'] ) )  {
				$column_style .= sprintf( '@media (max-width:%s) {', esc_attr( $block['attrs']['mediaQueryMobile'] ) );
					$column_style .= '.wp-block-column-' . $uid . ' > .gfc-bg-helper::before {';
						$column_style .= 'background-position:' . $block['attrs']['mobileFocalPoint']['x'] * 100 . '% ' . $block['attrs']['mobileFocalPoint']['y'] * 100 . '% !important';
					$column_style .= '}';
				$column_style .= '}';
			}
		}
	}

	if ( ! empty( $block['attrs']['colSize'] ) ) {
		$column_vars[] = '--gfc-col:' . $block['attrs']['colSize'];
	}
	if ( ! empty( $block['attrs']['colShift'] ) ) {
		$column_vars[] = '--gfc-col-shift:' . $block['attrs']['colShift'];
	}

	if ( ! empty( $block['attrs']['mediaUrl'] ) ) {
		$column_helper = '<span class="gfc-bg-helper"></span>';

		$column_vars[] = '--gfc-col-bg:url(' . $block['attrs']['mediaUrl'] . ') '
			. ( ! empty( $block['attrs']['backgroundRepeat'] ) ? ' ' . $block['attrs']['backgroundRepeat'] : 'no-repeat' )
			. ' ' . ( ! empty( $block['attrs']['focalPoint'] ) ? ' ' . $block['attrs']['focalPoint']['x'] * 100 . '% ' . $block['attrs']['focalPoint']['y'] * 100 . '%' : '50% 50%' )
			. ' / ' . ( ! empty( $block['attrs']['backgroundSize'] ) ? ' ' . $block['attrs']['backgroundSize'] : 'auto' )
			. ' ' . ( ! empty( $block['attrs']['backgroundAttachment'] ) ? ' ' . $block['attrs']['backgroundAttachment'] : 'scroll' )
		;

		$column_vars[] = '--gfc-col-overlay-opacity:' . ( ! empty( $block['attrs']['overlayDimRatio'] ) ? $block['attrs']['overlayDimRatio'] / 100 : '0.5');
		$column_vars[] = '--gfc-col-overlay-color:'
			. ( ! empty( $block['attrs']['overlayColor'] ) ? $block['attrs']['overlayColor'] : '' )
			. ( ! empty( $block['attrs']['overlayGradient'] ) ? $block['attrs']['overlayGradient'] : '' )
		;
	}

	if ( ! empty( $column_vars ) ) {
		preg_match('/<div class="wp-block-column(.*?)" style="(.*?)">/i', $block_content, $matches);
		preg_match('/<div class="wp-block-column(.*?)">/i', $block_content, $matches2);

		if ( isset( $matches[2] ) && ! empty( $matches2[0] ) ) {
			$block_content = preg_replace(
				'/<div class="wp-block-column(.*?)" style="(.*?)">/i',
				'<div class="wp-block-column$1 ' . esc_attr( implode( ' ', $column_classes ) ) . '" style="$2;' . esc_attr( implode( ';', $column_vars ) ) . '">' . wp_kses_post( $column_helper ),
				$block_content,
				1
			);
		}
		else if ( ! empty( $matches2[0] ) ) {
			$block_content = preg_replace(
				'/<div class="wp-block-column(.*?)">/i',
				'<div class="wp-block-column$1 ' . esc_attr( implode( ' ', $column_classes ) ) . '" style="' . esc_attr( implode( ';', $column_vars ) ) . '">' . wp_kses_post( $column_helper ),
				$block_content,
				1
			);
		}
	}

	if ( ! empty( $column_style ) ) {
		wp_enqueue_block_support_styles( $column_style );
	}

	return $block_content;
};

add_filter( 'render_block', 'gfc_column', 10, 3 );
