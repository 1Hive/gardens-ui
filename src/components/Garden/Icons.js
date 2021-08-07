import React from 'react'

const DISABLED_COLOR = '#E9E9E9'

export function ThumbsUpIcon({ disabled = false }) {
  return (
    <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient
          id={`${disabled}paintUP_linear`}
          x1="0"
          y1="0"
          x2="33.79"
          y2="13.4"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={disabled ? DISABLED_COLOR : '#30DB9E'} />
          <stop offset="1" stopColor={disabled ? DISABLED_COLOR : '#2BB886'} />
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="14" fill={`url(#${disabled}paintUP_linear)`} />
      <path
        d="M17.086 11.188V8.094a1.547 1.547 0 00-1.547-1.547h-.93a.515.515 0 00-.483.338l-1.68 4.56a1.031 1.031 0 00-1.032 1.032v6.187a1.031 1.031 0 001.031 1.031h5.896a2.836 2.836 0 002.787-2.32l.774-4.104a1.546 1.546 0 00-1.524-1.826h-3.034a.258.258 0 01-.258-.258z"
        fill="#fff"
      />
      <path
        d="M7.547 11.059h2.062a.516.516 0 01.516.515v7.992a.515.515 0 01-.516.516H7.547a1.031 1.031 0 01-1.031-1.031V12.09a1.031 1.031 0 011.03-1.031z"
        fill="#fff"
      />
    </svg>
  )
}

export function ThumbsDownIcon({ disabled }) {
  return (
    <svg width="28" height="28" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient
          id={`${disabled}paintDOWN_linear`}
          x1="0"
          y1="0"
          x2="33.79"
          y2="13.4"
        >
          <stop stopColor={disabled ? DISABLED_COLOR : '#FF6F6F'} />
          <stop offset="1" stopColor={disabled ? DISABLED_COLOR : '#F36666'} />
        </linearGradient>
      </defs>
      <circle
        cx="14"
        cy="14"
        r="14"
        fill={`url(#${disabled}paintDOWN_linear)`}
      />
      <path
        d="M10.914 16.813v3.093a1.547 1.547 0 001.547 1.547h.93a.515.515 0 00.483-.338l1.68-4.56a1.031 1.031 0 001.032-1.032V9.336a1.031 1.031 0 00-1.031-1.031H9.659a2.836 2.836 0 00-2.787 2.32l-.774 4.104a1.546 1.546 0 001.524 1.826h3.034a.258.258 0 01.258.258z"
        fill="#fff"
      />
      <path
        d="M20.453 16.941h-2.062a.516.516 0 01-.516-.515V8.434a.516.516 0 01.516-.516h2.062a1.031 1.031 0 011.031 1.031v6.961a1.031 1.031 0 01-1.03 1.031z"
        fill="#fff"
      />
    </svg>
  )
}
