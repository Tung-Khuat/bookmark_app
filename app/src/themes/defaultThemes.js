const defaultThemeColors = {
    primaryContrastB: "#e9e9e9",
    primaryContrastA: "#2d3142",
    secondaryContrastB: "#bfc0c0",
    secondaryContrastA: "#4f5d75",
    neutral: "#55828b",
    highlight: "#ef8354",
}

const includeAllProperties = (themeColorsProps) => {
    const theme = {
        ...defaultThemeColors,
        ...themeColorsProps,
    }
    if (!theme.paletteArray) {
        theme.paletteArray = [ theme.primaryContrastA, theme.secondaryContrastA, theme.neutral, theme.secondaryContrastB, theme.primaryContrastB, theme.highlight ]
    }
    return theme
}

export const defaultThemes = [
    {
        name: 'Default Theme 1',
        themeColors: includeAllProperties({
            primaryContrastA: "#2d3142",
            primaryContrastB: "#e9e9e9",
            secondaryContrastA: "#4f5d75",
            secondaryContrastB: "#bfc0c0",
            neutral: "#55828b",
            highlight: "#ef8354",
        }),
    },
    {
        name: 'Default Theme 2',
        themeColors: includeAllProperties({
            primaryContrastA: "#353535",
            primaryContrastB: "#e9e9e9",
            secondaryContrastA: "#284b63",
            secondaryContrastB: "#d9d9d9",
            neutral: "#3c6e71",
            highlight: "#ccdbfd",
        }),
    },
    {
        name: 'Default Theme 3',
        themeColors: includeAllProperties({
            primaryContrastA: "#293241",
            primaryContrastB: "#e0fbfc",
            secondaryContrastA: "#3d5a80",
            secondaryContrastB: "#98c1d9",
            neutral: "#2a6f97",
            highlight: "#ee6c4d",
        }),
    },
    {
        name: 'Default Theme 4',
        themeColors: includeAllProperties({
            primaryContrastA: "#1d3557",
            primaryContrastB: "#f1faee",
            secondaryContrastA: "#22577a",
            secondaryContrastB: "#a8dadc",
            neutral: "#457b9d",
            highlight: "#e63946",
        }),
    },
    {
        name: 'Default Theme 5',
        themeColors: includeAllProperties({
            primaryContrastA: "#2f3e46",
            primaryContrastB: "#cad2c5",
            secondaryContrastA: "#354f52",
            secondaryContrastB: "#84a98c",
            neutral: "#52796f",
            highlight: "#f4d35e",
        }),
    },
    {
        name: 'Default Theme 6',
        themeColors: includeAllProperties({
            primaryContrastA: "#212529",
            primaryContrastB: "#F8F9FA",
            secondaryContrastA: "#343A40",
            secondaryContrastB: "#E9ECEF",
            neutral: "#6C757D",
            highlight: "#2ca6a4",
        }),
    },
    {
        name: 'Default Theme 7',
        themeColors: includeAllProperties({
            primaryContrastA: "#202020",
            primaryContrastB: "#E8EDDF",
            secondaryContrastA: "#303030",
            secondaryContrastB: "#CFDBD5",
            neutral: "#5c5c5c",
            highlight: "#cfaa48",
        }),
    },
]
