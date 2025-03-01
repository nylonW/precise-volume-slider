# YouTube Volume Control Slider Extension

A Chrome extension that adds a full-width volume control slider under YouTube videos.

## Features

- Adds a clean, full-width volume slider beneath YouTube videos
- Syncs with YouTube's built-in volume controls
- Displays current volume percentage
- Click the volume icon to mute/unmute
- Multiple insertion methods to ensure reliability across YouTube's layout updates

## Installation

### From Chrome Web Store (recommended method)
1. Once published, you would be able to find and install it from the Chrome Web Store

### Manual Installation (developer mode)
1. Download or clone this repository to your computer
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" using the toggle in the top-right corner
4. Click "Load unpacked" and select the folder containing the extension files
5. The extension should now be installed and active

## Usage

1. Navigate to any YouTube video page
2. The volume slider will automatically appear beneath the video
3. Drag the slider to adjust volume
4. Click the speaker icon to mute/unmute
5. The current volume percentage is displayed on the right side

## Files

- `manifest.json` - Extension metadata and permissions
- `content.js` - Main script that runs on YouTube pages
- `styles.css` - CSS styling for the volume slider
- `icons/` - Extension icons in various sizes

## Notes

This extension only runs on YouTube video pages (URLs matching `*://*.youtube.com/watch*`).

## License

MIT License

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.
