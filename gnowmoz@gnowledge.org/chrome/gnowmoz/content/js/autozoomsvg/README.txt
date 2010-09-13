Enhanced features

A. Can now display SVG files whose viewport doesn't match its width/height
B. Can now display SVG files with a comment preceding the svg element
C. Lens now correctly displays zoomed SVG files whose aspect ratio is
   different from 4/3

Changes to autozoom.svg (version of 2007-08-29)

1. Added title
2. Changed target icon to use heavier stroke
3. Selection text changes colour, since ASV3 refuses to use the correct cursor
4. Added one more selection, as test file for more general SVG map (see below)
   Also changed labels to be more descriptive
5. Added stub transform to panload and lens to implement A above.

Note: retained DOCTYPE definition despite comments at
	http://jwatt.org/svg/authoring/

Changes to zoom.es (version of 2007-08-29)

1. Merged comments from zoom_commented.es. No point in keeping these separate,
   as the size difference is minor.
2. addDoc now locates the svg element in the DOM tree, to allow SVG documents
   to have comments or other nodes before this element.
3. set_pan_viewbox determines appropriate scale factors to apply when the document
   viewbox isn't the same as its width and height
4. zoom_set adjusts the zoom sizes to ensure the lens retains the aspect ratio
   of the document rather than that of the viewing area until the lens reaches
   both edges of the document
5. set_scale: new function to apply scale factor to selected elements
   (#3 above and #5 in autozoom.svg).

Geoff Whale, G.Whale@unsw.edu.au  2007-09-03.
