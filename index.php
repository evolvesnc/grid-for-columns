<?php
/**
 * Plugin Name: Grid for Columns
 * Plugin URI: https://justevolve.it/
 * Description: Enable advanced CSS Grid functionality on default WordPress Columns block.
 * Requires at least: 5.9.1
 * Requires PHP: 5.6
 * Version: 0.1.0
 * Author: Evolve
 * Text Domain: grid-for-columns
 *
 * Grid for Columns is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * any later version.
 *
 * Grid for Columns is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * @package   Grid for Columns
 * @author 	  Evolve <info@justevolve.it>
 * @copyright Copyright (c) 2022
 * @license   http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */

define( 'GFC_URL', trailingslashit( plugin_dir_url( __FILE__ ) ) );
define( 'GFC_FOLDER', trailingslashit( dirname( __FILE__ ) ) );

require_once GFC_FOLDER . 'src/columns/columns.php';
require_once GFC_FOLDER . 'src/column/column.php';

add_action( 'enqueue_block_editor_assets', function() {
	wp_enqueue_script( 'gfc', GFC_URL . 'dist/editor.js', [ 'wp-edit-post' ] );
	wp_enqueue_style( 'gfc', GFC_URL . 'dist/editor.css' );
} );

add_action( 'admin_init', function() {
	wp_enqueue_style( 'gfc-sidebar', GFC_URL . 'dist/sidebar.css' );
});

add_action( 'wp_enqueue_scripts', function() {
	wp_enqueue_style( 'gfc-frontend', GFC_URL . 'dist/frontend.css' );

	$gfc_query = apply_filters( 'gfc_default_query', '599px' );
	$gfc_style = '@media ( max-width:' . $gfc_query . ') {
		.wp-block-columns[data-use-gfc="1"].is-stacked-on-mobile {--gfc-grid-template:100%}
		.wp-block-columns[data-use-gfc="1"].is-stacked-on-mobile .wp-block-column{--gfc-col-size:1;--gfc-shift:0}
	}';

	wp_add_inline_style( 'gfc-frontend', $gfc_style );
});
