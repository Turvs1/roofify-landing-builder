# Creating Placeholder Color Swatches

Since I can't generate actual images, here are some options for creating placeholder color swatches:

## Option 1: Use Online Color Swatch Generators
- **Coolors.co** - Generate color palettes and download individual colors
- **Adobe Color** - Create and export color swatches
- **Canva** - Create simple colored squares and export as PNG

## Option 2: Use Design Software
- **Figma** - Create 32x32 or 64x64 colored squares
- **Sketch** - Design color swatches and export
- **Photoshop** - Create colored squares and save as PNG

## Option 3: Use CSS/HTML to Generate
Create a simple HTML file and screenshot each color:

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        .swatch { width: 64px; height: 64px; border: 1px solid #ccc; }
        .surfmist { background-color: #F5F5F0; }
        .shale-grey { background-color: #8B8B8B; }
        .windspray { background-color: #B8D4E3; }
        .basalt { background-color: #2F2F2F; }
        .monument { background-color: #1C1C1C; }
        .woodland-grey { background-color: #4A4A4A; }
        .dune { background-color: #D2B48C; }
        .evening-haze { background-color: #B8A9C9; }
        .jasper { background-color: #8B4513; }
        .pale-eucalypt { background-color: #C8E6C9; }
    </style>
</head>
<body>
    <div class="swatch surfmist"></div>
    <div class="swatch shale-grey"></div>
    <div class="swatch windspray"></div>
    <div class="swatch basalt"></div>
    <div class="swatch monument"></div>
    <div class="swatch woodland-grey"></div>
    <div class="swatch dune"></div>
    <div class="swatch evening-haze"></div>
    <div class="swatch jasper"></div>
    <div class="swatch pale-eucalypt"></div>
</body>
</html>
```

## Recommended Approach
1. Use the CSS approach above to generate basic swatches
2. Screenshot each color individually
3. Save with the exact naming convention: `{COLOR_NAME}.png`
4. Place all images in the `public/color-swatches/` folder

## Note
The actual Colourbond colors may differ from these placeholder colors. For production use, you should obtain official Colourbond color swatches or accurate representations of the actual colors.
