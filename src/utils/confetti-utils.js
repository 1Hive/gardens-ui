import confetti from 'canvas-confetti'

export const throwConfetti = origin => {
  origin = origin || {
    x: 0.5,
    y: 0.5,
  }
  confetti({
    particleCount: 200,
    spread: 160,
    origin,

    colors: [
      // garden brand theme, some repetitions of colors to get more often, more bright colors.
      '#8DE995',
      '#3DCB60',
      '#8DE995',
      '#3DCB60',
      '#164924',
      '#048333',
      '#D5F2E2',
      '#CCE7EE',
      '#EADCC2',
      '#FFF19F',
      '#FFDD0F',
      '#FFA07A',
      '#FFDD0F',
      '#FFA07A',
      '#FFDD0F',
      '#FFA07A',
      '#0D2622',
      '#464942',
      '#696D63',
    ],
  })
}
