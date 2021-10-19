import React, { useMemo, useContext } from 'react'
import PropTypes from 'prop-types'
import { TEXT_STYLES, useTheme } from '@1hive/1hive-ui'

const ChartsContext = React.createContext()

const getAxisOffset = orient => {
  switch (orient) {
    case 'bottom':
      return 36
    case 'left':
      return -40
    default:
      return 0
  }
}

function ChartsProvider({ children }) {
  const theme = useTheme()

  const ChartOptions = useMemo(
    () => ({
      commonProps: {
        colors: ['#7CE0D6'],
        curve: 'basis',
        enablePoints: false,
        lineWidth: 3,
        margin: { right: 30, bottom: 50, left: 50, top: 30 },
        theme: {
          axis: {
            ticks: {
              text: {
                fill: theme.contentSecondary,
              },
            },
            legend: {
              text: {
                fill: theme.contentSecondary,
              },
            },
          },
          grid: {
            line: {
              stroke: theme.contentSecondary.alpha(0.1),
            },
          },
        },
        useMesh: true,
        xFormat: '.2f',
        yFormat: '.2f',
        xScale: { type: 'linear' },
        yScale: { type: 'linear' },
      },
      createAxis: (legend, orient) => ({
        legend,
        orient,
        legendOffset: getAxisOffset(orient),
        legendPosition: 'middle',
        tickSize: 5,
        tickPadding: 5,
      }),
      createMarker: (axis, value, legend) => ({
        axis,
        value,
        legend,
        legendOrientation: axis === 'x' ? 'vertical' : 'horizontal',
        lineStyle: { stroke: '#FF9B73', strokeWidth: 2 },
        textStyle: {
          fill: '#FF9B73',
          fontSize: `${TEXT_STYLES.body3.size}px`,
        },
      }),
    }),
    [theme]
  )

  return (
    <ChartsContext.Provider value={ChartOptions}>
      {children}
    </ChartsContext.Provider>
  )
}

ChartsProvider.propTypes = {
  children: PropTypes.node,
}

function useCharts() {
  return useContext(ChartsContext)
}

export { ChartsProvider, useCharts }
