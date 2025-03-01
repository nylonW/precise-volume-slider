'use strict';

// SVG path data for different volume states
const SVG_PATHS = {
    muted: "M3.97 5.03 2.03 6.97 4.97 9.91 4.5 10.5H1.5v3h3l6 6V13.91l2.25 2.25c-.19.14-.4.27-.63.39v2.24c.43-.19.83-.42 1.19-.68l1.72 1.72 1.94-1.94L4.97 5.03zM10.5 6.9v2.6l1.41 1.41-.51.51v-.01l-4.41-4.41L10.5 3.75v3.15zm10.29 8.85c.48-.77.72-1.65.72-2.49 0-2.55-1.95-4.65-4.5-4.95v2.02c1.35.3 2.25 1.5 2.25 2.93 0 .45-.1.84-.26 1.21l1.79 1.28z",
    low: "M7.5 9h-6v6h6l6 6V3l-6 6z",
    high: "M14.016 3.234C9.125 5.0 5.016 8.719 5.016 12.984S9.125 20.766 14.016 22.5V3.234zM7.5 12.984C7.5 10.5 9.891 7.969 12.984 6.703V19.266C9.891 18 7.5 15.469 7.5 12.984zM20.016 12.984A8.02 8.02 0 0 0 18.984 9.984H17.016A6.554 6.554 0 0 1 18 12.984 6.554 6.554 0 0 1 17.016 15.984H18.984A8.018 8.018 0 0 0 20.016 12.984zM23.016 12.984A11.1 11.1 0 0 0 21.984 9H20.016A9.338 9.338 0 0 1 21 12.984 9.338 9.338 0 0 1 20.016 16.969H21.984A11.1 11.1 0 0 0 23.016 12.984z"
};

// Create SVG element properly without using innerHTML
function createSvgIcon(pathData) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.style.width = "24px";
    svg.style.height = "24px";
    svg.style.fill = "white";
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    
    svg.appendChild(path);
    return svg;
}

// Function to create and insert the volume slider
function insertVolumeSlider() {
    console.log("Volume Slider: Starting insertion attempt");
    
    // Remove any existing slider
    const existingSlider = document.querySelector('.yt-custom-volume-container');
    if (existingSlider) {
        existingSlider.remove();
    }
    
    // Check if video exists
    const videoPlayer = document.querySelector('video');
    if (!videoPlayer) {
        console.log("Volume Slider: No video element found");
        return false;
    }
    
    // Find the target location to insert the slider
    const aboveTheFold = document.querySelector('#above-the-fold');
    if (!aboveTheFold) {
        console.log("Volume Slider: No #above-the-fold element found");
        return false;
    }
    
    // Find the middle-row or create insertion point after top-row
    const topRow = document.querySelector('#top-row');
    const middleRow = document.querySelector('#middle-row');
    
    if (!topRow) {
        console.log("Volume Slider: No #top-row element found");
        return false;
    }
    
    // Create container for the volume slider
    const volumeContainer = document.createElement('div');
    volumeContainer.className = 'yt-custom-volume-container';
    volumeContainer.id = 'yt-custom-volume-control';
    
    // Create volume icon
    const volumeIcon = document.createElement('div');
    volumeIcon.className = 'yt-custom-volume-icon';
    volumeIcon.title = 'Mute/Unmute';
    
    // Add the appropriate SVG based on current volume
    const initialSvg = createSvgIcon(videoPlayer.muted ? SVG_PATHS.muted : 
                                     (videoPlayer.volume < 0.5 ? SVG_PATHS.low : SVG_PATHS.high));
    volumeIcon.appendChild(initialSvg);
    
    // Create slider container
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'yt-custom-volume-slider-container';
    
    // Create volume slider
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '100';
    volumeSlider.value = videoPlayer.volume * 100;
    volumeSlider.className = 'yt-custom-volume-slider';
    
    // Create volume value display
    const volumeValue = document.createElement('div');
    volumeValue.className = 'yt-custom-volume-value';
    volumeValue.textContent = Math.round(videoPlayer.volume * 100) + '%';
    
    // Add event listener to update video volume when slider is moved
    volumeSlider.addEventListener('input', function() {
        videoPlayer.volume = this.value / 100;
        volumeValue.textContent = this.value + '%';
        updateVolumeIcon(this.value);
    });
    
    // Add event listener to toggle mute when icon is clicked
    volumeIcon.addEventListener('click', function() {
        videoPlayer.muted = !videoPlayer.muted;
        updateVolumeIcon(volumeSlider.value);
    });
    
    // Function to update the volume icon based on volume level
    function updateVolumeIcon(value) {
        // Clear existing SVG
        while (volumeIcon.firstChild) {
            volumeIcon.removeChild(volumeIcon.firstChild);
        }
        
        // Add new SVG based on current volume
        let pathData;
        if (videoPlayer.muted || value == 0) {
            pathData = SVG_PATHS.muted;
        } else if (value < 50) {
            pathData = SVG_PATHS.low;
        } else {
            pathData = SVG_PATHS.high;
        }
        
        volumeIcon.appendChild(createSvgIcon(pathData));
    }
    
    // Add elements to the DOM
    sliderContainer.appendChild(volumeSlider);
    volumeContainer.appendChild(volumeIcon);
    volumeContainer.appendChild(sliderContainer);
    volumeContainer.appendChild(volumeValue);
    
    // Insert at the appropriate location
    if (middleRow) {
        // Insert at the beginning of middle-row if it exists
        middleRow.insertBefore(volumeContainer, middleRow.firstChild);
        console.log("Volume Slider: Inserted into middle-row");
    } else if (topRow.nextElementSibling) {
        // Insert after top-row
        aboveTheFold.insertBefore(volumeContainer, topRow.nextElementSibling);
        console.log("Volume Slider: Inserted after top-row");
    } else {
        // Fallback - append to above-the-fold
        aboveTheFold.appendChild(volumeContainer);
        console.log("Volume Slider: Appended to above-the-fold");
    }
    
    // Sync with native volume control
    const observer = new MutationObserver(function() {
        if (!videoPlayer.muted) {
            volumeSlider.value = videoPlayer.volume * 100;
            volumeValue.textContent = Math.round(videoPlayer.volume * 100) + '%';
            updateVolumeIcon(volumeSlider.value);
        } else {
            updateVolumeIcon(0);
        }
    });
    
    observer.observe(videoPlayer, { 
        attributes: true, 
        attributeFilter: ['volume', 'muted'] 
    });
    
    console.log("Volume Slider: Successfully created and inserted");
    return true;
}

// Alternative insertion method that targets different elements
function alternativeInsertion() {
    console.log("Volume Slider: Trying alternative insertion method");
    
    // Get the video player
    const videoPlayer = document.querySelector('video');
    if (!videoPlayer) {
        console.log("Volume Slider: No video element found (alternative)");
        return false;
    }
    
    // Alternative target 1: Below the video but above comments/info
    let targetElement = document.querySelector('#above-the-fold');
    if (!targetElement) {
        // Alternative target 2: Primary container
        targetElement = document.querySelector('#primary-inner, #primary, #content');
    }
    
    if (!targetElement) {
        console.log("Volume Slider: No suitable target element found (alternative)");
        return false;
    }
    
    // Create container for the volume slider
    const volumeContainer = document.createElement('div');
    volumeContainer.className = 'yt-custom-volume-container';
    volumeContainer.id = 'yt-custom-volume-control';
    
    // Create volume icon
    const volumeIcon = document.createElement('div');
    volumeIcon.className = 'yt-custom-volume-icon';
    volumeIcon.title = 'Mute/Unmute';
    
    // Add the appropriate SVG based on current volume
    const initialSvg = createSvgIcon(videoPlayer.muted ? SVG_PATHS.muted : 
                                     (videoPlayer.volume < 0.5 ? SVG_PATHS.low : SVG_PATHS.high));
    volumeIcon.appendChild(initialSvg);
    
    // Create slider container
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'yt-custom-volume-slider-container';
    
    // Create volume slider
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '100';
    volumeSlider.value = videoPlayer.volume * 100;
    volumeSlider.className = 'yt-custom-volume-slider';
    
    // Create volume value display
    const volumeValue = document.createElement('div');
    volumeValue.className = 'yt-custom-volume-value';
    volumeValue.textContent = Math.round(videoPlayer.volume * 100) + '%';
    
    // Add event listener to update video volume when slider is moved
    volumeSlider.addEventListener('input', function() {
        videoPlayer.volume = this.value / 100;
        volumeValue.textContent = this.value + '%';
        updateVolumeIcon(this.value);
    });
    
    // Add event listener to toggle mute when icon is clicked
    volumeIcon.addEventListener('click', function() {
        videoPlayer.muted = !videoPlayer.muted;
        updateVolumeIcon(volumeSlider.value);
    });
    
    // Function to update the volume icon based on volume level
    function updateVolumeIcon(value) {
        // Clear existing SVG
        while (volumeIcon.firstChild) {
            volumeIcon.removeChild(volumeIcon.firstChild);
        }
        
        // Add new SVG based on current volume
        let pathData;
        if (videoPlayer.muted || value == 0) {
            pathData = SVG_PATHS.muted;
        } else if (value < 50) {
            pathData = SVG_PATHS.low;
        } else {
            pathData = SVG_PATHS.high;
        }
        
        volumeIcon.appendChild(createSvgIcon(pathData));
    }
    
    // Add elements to the DOM
    sliderContainer.appendChild(volumeSlider);
    volumeContainer.appendChild(volumeIcon);
    volumeContainer.appendChild(sliderContainer);
    volumeContainer.appendChild(volumeValue);
    
    // Try to find the best position to insert
    const videoTitle = document.querySelector('#title.ytd-watch-metadata');
    if (videoTitle) {
        targetElement.insertBefore(volumeContainer, videoTitle.nextSibling);
        console.log("Volume Slider: Inserted after video title");
    } else {
        // Fallback - just prepend to the target
        targetElement.prepend(volumeContainer);
        console.log("Volume Slider: Prepended to target element");
    }
    
    // Sync with native volume control
    const observer = new MutationObserver(function() {
        if (!videoPlayer.muted) {
            volumeSlider.value = videoPlayer.volume * 100;
            volumeValue.textContent = Math.round(videoPlayer.volume * 100) + '%';
            updateVolumeIcon(volumeSlider.value);
        } else {
            updateVolumeIcon(0);
        }
    });
    
    observer.observe(videoPlayer, { 
        attributes: true, 
        attributeFilter: ['volume', 'muted'] 
    });
    
    console.log("Volume Slider: Alternative insertion successful");
    return true;
}

// Last resort method - direct insertion into body with absolute positioning
function lastResortInsertion() {
    console.log("Volume Slider: Trying last resort insertion method");
    
    // Get the video player
    const videoPlayer = document.querySelector('video');
    if (!videoPlayer) {
        console.log("Volume Slider: No video element found (last resort)");
        return false;
    }
    
    // Create container for the volume slider
    const volumeContainer = document.createElement('div');
    volumeContainer.className = 'yt-custom-volume-container-absolute';
    volumeContainer.id = 'yt-custom-volume-control-absolute';
    
    // Create volume icon
    const volumeIcon = document.createElement('div');
    volumeIcon.className = 'yt-custom-volume-icon';
    volumeIcon.title = 'Mute/Unmute';
    
    // Add the appropriate SVG based on current volume
    const initialSvg = createSvgIcon(videoPlayer.muted ? SVG_PATHS.muted : 
                                     (videoPlayer.volume < 0.5 ? SVG_PATHS.low : SVG_PATHS.high));
    volumeIcon.appendChild(initialSvg);
    
    // Create slider container
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'yt-custom-volume-slider-container';
    
    // Create volume slider
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '100';
    volumeSlider.value = videoPlayer.volume * 100;
    volumeSlider.className = 'yt-custom-volume-slider';
    
    // Create volume value display
    const volumeValue = document.createElement('div');
    volumeValue.className = 'yt-custom-volume-value';
    volumeValue.textContent = Math.round(videoPlayer.volume * 100) + '%';
    
    // Add event listener to update video volume when slider is moved
    volumeSlider.addEventListener('input', function() {
        videoPlayer.volume = this.value / 100;
        volumeValue.textContent = this.value + '%';
        updateVolumeIcon(this.value);
    });
    
    // Add event listener to toggle mute when icon is clicked
    volumeIcon.addEventListener('click', function() {
        videoPlayer.muted = !videoPlayer.muted;
        updateVolumeIcon(volumeSlider.value);
    });
    
    // Function to update the volume icon based on volume level
    function updateVolumeIcon(value) {
        // Clear existing SVG
        while (volumeIcon.firstChild) {
            volumeIcon.removeChild(volumeIcon.firstChild);
        }
        
        // Add new SVG based on current volume
        let pathData;
        if (videoPlayer.muted || value == 0) {
            pathData = SVG_PATHS.muted;
        } else if (value < 50) {
            pathData = SVG_PATHS.low;
        } else {
            pathData = SVG_PATHS.high;
        }
        
        volumeIcon.appendChild(createSvgIcon(pathData));
    }
    
    // Add elements to the DOM
    sliderContainer.appendChild(volumeSlider);
    volumeContainer.appendChild(volumeIcon);
    volumeContainer.appendChild(sliderContainer);
    volumeContainer.appendChild(volumeValue);
    
    // Append to body
    document.body.appendChild(volumeContainer);
    
    // Sync with native volume control
    const observer = new MutationObserver(function() {
        if (!videoPlayer.muted) {
            volumeSlider.value = videoPlayer.volume * 100;
            volumeValue.textContent = Math.round(videoPlayer.volume * 100) + '%';
            updateVolumeIcon(volumeSlider.value);
        } else {
            updateVolumeIcon(0);
        }
    });
    
    observer.observe(videoPlayer, { 
        attributes: true, 
        attributeFilter: ['volume', 'muted'] 
    });
    
    console.log("Volume Slider: Last resort insertion successful");
    return true;
}

// Function to try all insertion methods in sequence
function tryAllInsertionMethods() {
    if (insertVolumeSlider()) {
        return;
    }
    
    setTimeout(() => {
        if (alternativeInsertion()) {
            return;
        }
        
        setTimeout(() => {
            lastResortInsertion();
        }, 1000);
    }, 1000);
}

// Wait for the page to load, then try to insert the slider
function init() {
    console.log("Volume Slider: Initializing");
    
    // Remove any existing sliders
    const existingSliders = document.querySelectorAll('.yt-custom-volume-container, .yt-custom-volume-container-absolute');
    existingSliders.forEach(slider => slider.remove());
    
    // Try all insertion methods
    tryAllInsertionMethods();
}

// Initial run
setTimeout(init, 2000);

// Re-run on navigation changes
window.addEventListener('yt-navigate-finish', function() {
    console.log("Volume Slider: navigation detected");
    setTimeout(init, 2000);
});

// Periodic check to ensure the slider is present
setInterval(function() {
    const sliderExists = document.querySelector('.yt-custom-volume-container, .yt-custom-volume-container-absolute');
    const videoExists = document.querySelector('video');
    
    if (videoExists && !sliderExists) {
        console.log("Volume Slider: Reinserting slider");
        init();
    }
}, 10000);

console.log("Volume Slider: Script loaded");
