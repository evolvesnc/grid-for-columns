let mix = require('laravel-mix');

mix.js( './src/editor.js', 'dist' ).react();
mix.sass( './src/editor.scss', 'dist' );
mix.sass( './src/sidebar.scss', 'dist' );
mix.sass( './src/frontend.scss', 'dist' );
