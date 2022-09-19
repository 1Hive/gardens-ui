import { IndividualStepTypes } from '../stepper-statuses'
import Illustration from './Illustration'
import { GU, textStyle, IconCross, IconCheck, useTheme } from '@1hive/1hive-ui'
import { useAppTheme } from '@/providers/AppTheme'
import { springs } from '@/style/springs'
import { useDisableAnimation } from '@hooks/useDisableAnimation'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { Transition, animated } from 'react-spring/renderprops.cjs'
import { css, keyframes } from 'styled-components'

const STATUS_ICONS = {
  [IndividualStepTypes.Error]: IconCross,
  [IndividualStepTypes.Success]: IconCheck,
}

const AnimatedDiv = animated.div

const spinAnimation = css`
  mask-image: linear-gradient(35deg, rgba(0, 0, 0, 0.1) 10%, rgba(0, 0, 0, 1));
  animation: ${keyframes`
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  `} 1.25s linear infinite;
`

const pulseAnimation = css`
  animation: ${keyframes`
    from {
      opacity: 1;
    }

    to {
      opacity: 0.1;
    }
  `} 0.75s linear alternate infinite;
`

function StatusVisual({ status, color, number, withoutFirstStep, ...props }) {
  const theme = useTheme()
  const [animationDisabled, enableAnimation] = useDisableAnimation()

  const [statusIcon, illustration] = useMemo(() => {
    const Icon = STATUS_ICONS[status]

    return [
      Icon && <Icon />,
      <StepIllustration
        number={number}
        status={status}
        withoutFirstStep={withoutFirstStep}
      />,
    ]
  }, [status, number, withoutFirstStep])

  return (
    <div
      css={`
        display: flex;
        position: relative;
        width: ${15 * GU}px;
        height: ${15 * GU}px;
      `}
      {...props}
    >
      <div
        css={`
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
        `}
      >
        <div
          css={`
            position: relative;
            z-index: 1;
          `}
        >
          <div
            css={`
              position: absolute;
              bottom: ${0.5 * GU}px;
              right: 0;
            `}
          >
            <Transition
              config={(_, state) =>
                state === 'enter' ? springs.gentle : springs.instant
              }
              items={statusIcon}
              onStart={enableAnimation}
              immediate={animationDisabled}
              from={{
                transform: 'scale3d(1.3, 1.3, 1)',
              }}
              enter={{
                opacity: 1,
                transform: 'scale3d(1, 1, 1)',
              }}
              leave={{
                position: 'absolute',
                opacity: 0,
              }}
              native
            >
              {(currentStatusIcon) =>
                currentStatusIcon &&
                ((animProps) => (
                  <AnimatedDiv
                    css={`
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      border-radius: 100%;
                      padding: ${0.25 * GU}px;
                      background-color: ${theme.surface};
                      color: ${color};
                      border: 1px solid currentColor;
                      bottom: 0;
                      right: 0;
                    `}
                    style={animProps}
                  >
                    {currentStatusIcon}
                  </AnimatedDiv>
                ))
              }
            </Transition>
          </div>

          {illustration}
        </div>
        <div
          css={`
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

            border-radius: 100%;
            border: 2px solid
              ${status === IndividualStepTypes.Waiting ? 'transparent' : color};
            ${status === IndividualStepTypes.Prompting ? pulseAnimation : ''}
            ${status === IndividualStepTypes.Working ? spinAnimation : ''}
            ${status === IndividualStepTypes.Prompting
              ? `background-color: ${theme.contentSecondary};`
              : ''}
          `}
        />
      </div>
    </div>
  )
}

StatusVisual.propTypes = {
  status: PropTypes.oneOf([
    IndividualStepTypes.Waiting,
    IndividualStepTypes.Prompting,
    IndividualStepTypes.Working,
    IndividualStepTypes.Success,
    IndividualStepTypes.Error,
  ]).isRequired,
  color: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
}

/* eslint-disable react/prop-types */
function StepIllustration({ number, status, withoutFirstStep }) {
  const theme = useTheme()
  const { appearance } = useAppTheme()

  const renderIllustration =
    status === IndividualStepTypes.Working ||
    status === IndividualStepTypes.Error ||
    status === IndividualStepTypes.Success ||
    withoutFirstStep

  return (
    <div
      css={`
        display: flex;
        justify-content: center;
        align-items: center;
        width: ${12 * GU}px;
        height: ${12 * GU}px;
      `}
    >
      {renderIllustration ? (
        <Illustration status={status} index={number} />
      ) : (
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: ${appearance === 'light'
              ? theme.contentSecondary
              : theme.badge};
            height: 100%;
            width: 100%;
            border-radius: 100%;
            color: ${appearance === 'light'
              ? theme.positiveContent
              : theme.content};
            ${textStyle('title1')};
            font-weight: 600;
          `}
        >
          {number}
        </div>
      )}
    </div>
  )
}
/* eslint-enable react/prop-types */

export default StatusVisual
