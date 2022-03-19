import React, { useRef, useImperativeHandle } from 'react'
import { Button, IconArrowLeft, GU, useTheme } from '@1hive/1hive-ui'

type NavigationProps = {
  backEnabled: boolean
  backLabel?: string
  nextEnabled: boolean
  nextLabel?: string
  onBack: () => void
  onNext: () => void
}

const Navigation = React.forwardRef<
  any,
  React.PropsWithChildren<NavigationProps>
>(({ backEnabled, backLabel, nextEnabled, nextLabel, onBack, onNext }, ref) => {
  const theme = useTheme()
  const nextRef = useRef<any>()

  useImperativeHandle(
    ref,
    () => ({
      focusNext: () => {
        if (nextRef.current) {
          nextRef.current.focus()
        }
      },
    }),
    []
  )

  return (
    <div
      css={`
        display: flex;
        width: 100%;
        justify-content: space-between;
      `}
    >
      <Button
        disabled={!backEnabled}
        icon={<IconArrowLeft color={theme.accent} />}
        label={backLabel}
        onClick={onBack}
      />
      <Button
        ref={nextRef}
        disabled={!nextEnabled}
        label={nextLabel}
        mode="strong"
        onClick={onNext}
        type="submit"
        css={`
          margin-left: ${1.5 * GU}px;
        `}
      />
    </div>
  )
})

Navigation.defaultProps = {
  backEnabled: true,
  backLabel: 'Back',
  nextEnabled: true,
  nextLabel: 'Next',
}

export default Navigation
