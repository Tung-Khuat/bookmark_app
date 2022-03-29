const defaultThemeColors = {
    primaryContrastA: "#ffffff",
    primaryContrastB: "#212121",
    secondaryContrastA: "#e2e2e2",
    secondaryContrastB: "#81171b",
    highlight: "#b72f33",
}

const includeAllProperties = (themeColorsProps) => {
    const theme = {
        ...defaultThemeColors,
        ...themeColorsProps,
    }
    if (!theme.paletteArray) {
        theme.paletteArray = [ theme.primaryContrastB, theme.secondaryContrastB, theme.neutral, theme.secondaryContrastA, theme.primaryContrastA, theme.highlight ]
    }
    return theme
}

export const defaultThemes = [
    {
        name: 'Default Theme 1',
        themeColors: includeAllProperties({
            primaryContrastA: "#ffffff",
            primaryContrastB: "#2d3142",
            secondaryContrastA: "#bfc0c0",
            secondaryContrastB: "#4f5d75",
            neutral: "#55828b",
            highlight: "#ef8354",
            // paletteArray: [ "#81171b", "#b72f33", "#e2e2e2", "#ffffff", "#212121"],
        }),
    },
    {
        name: 'Default Theme 2',
        themeColors: includeAllProperties({
            primaryContrastA: "#ffffff",
            primaryContrastB: "#353535",
            secondaryContrastA: "#d9d9d9",
            secondaryContrastB: "#284b63",
            neutral: "#3c6e71",
            highlight: "#ccdbfd",
            // paletteArray: ["#353535","#3c6e71","#ffffff","#d9d9d9", "#284b63"],
        }),
    },
    {
        name: 'Default Theme 3',
        themeColors: includeAllProperties({
            primaryContrastA: "#e0fbfc",
            primaryContrastB: "#293241",
            secondaryContrastA: "#98c1d9",
            secondaryContrastB: "#3d5a80",
            neutral: "#2a6f97",
            highlight: "#ee6c4d",
            // paletteArray: ["#3d5a80","#98c1d9","#e0fbfc","#ee6c4d", "#293241"],
        }),
    },
    {
        name: 'Default Theme 4',
        themeColors: includeAllProperties({
            primaryContrastA: "#f1faee",
            primaryContrastB: "#1d3557",
            secondaryContrastA: "#a8dadc",
            secondaryContrastB: "#22577a",
            neutral: "#457b9d",
            highlight: "#e63946",
            // paletteArray: ["#e63946","#f1faee","#a8dadc","#457b9d", "#1d3557"],
        }),
    },
    {
        name: 'Default Theme 5',
        themeColors: includeAllProperties({
            primaryContrastA: "#cad2c5",
            primaryContrastB: "#2f3e46",
            secondaryContrastA: "#84a98c",
            secondaryContrastB: "#354f52",
            neutral: "#52796f",
            highlight: "#f4d35e",
            // paletteArray: ["#cad2c5","#84a98c","#52796f","#354f52", "#2f3e46"],
        }),
    },
]