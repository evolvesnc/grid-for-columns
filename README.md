# Grid for Columns

Grid for Columns is a plugin designed to extend the WordPress core Columns block, in order to add more flexibility to the component, based on the CSS Grid functionality.

## Why

Layout structure is one of the most basic and fundamental components of a page. As such, it must be flexible enough to manage even complex solutions.

Currently, the only Core block that we can use to create layout structures is the Columns block. Unfortunately this block presents some issues:

1. The style is managed by Flexbox. For more complex layout structures, this is not ideal, and CSS Grid is a more reliable and, ultimately, better choice.
2. There isn't a structured media queries system in WordPress, and all responsive logic is delegated to the "Stack on mobile" option. While being OK for simpler solutions, this approach definitely falls short for more advanced requirements.
3. As far as dimensions are concerned, the columns size purely relies on units applied to the flex-basis property, which is not really recommended for more complex solutions.

## How

The idea was to extend the Core Columns block and create a new set of options to allow us to use the CSS Grid logic and provide progressive enhancement to all those who have already created a layout using the Columns block, without requiring any modification to the structure of the blocks.

By taking advantage of the `render_block` filter we are modifying the block markup by removing the CSS rules that are added as inline style by the Core block and creating a more flexible style with some CSS Custom Properties.

The background color logic has been extended to support images, both on Column and Columns, with some extra options for the responsive behavior for the image positioning.

Concerning the responsive behavior, we have used the "Stack on mobile" option as controller for a new custom Media Query input that can also be controlled globally with a custom filter called `gfc_default_query`.

## How it works

The plugin generates a new section in the block sidebar called "Structure". By default Flexbox mode is selected, which replicates WordPress core styling.

Other options available are:

* "Fixed grid", based on a standard column based grid,
* "Fluid grid", that allows you to switch between the `auto-fit` and `auto-fill` mode for a more flexible solution.

Once you have enabled one of the two Grid options, you can control the sizing of the individual column within the Column block sidebar: you'll be able to choose the size, expressed in column units, and the horizontal shift value, also expressed in column units.
