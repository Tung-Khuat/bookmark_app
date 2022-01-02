export const screenWidth = {
  largest: 1200,
  larger: 1024,
  large: 925,
  medium: 768,
  small: 540,
  smallest: 400,
}

export const media = {
  desktop: {
    largest: `@media(max-width: ${screenWidth.largest}px)`,
    larger: `@media(max-width: ${screenWidth.larger}px)`,
    large: `@media(max-width: ${screenWidth.large}px)`,
    medium: `@media(max-width: ${screenWidth.medium}px)`,
    small: `@media(max-width: ${screenWidth.small}px)`,
    smallest: `@media(max-width: ${screenWidth.largest}px)`,
  },
  mobile: {
    portrait: '@media(max-width: 400px)',
    landscape: '@media(max-width: 812px)',
  }
}