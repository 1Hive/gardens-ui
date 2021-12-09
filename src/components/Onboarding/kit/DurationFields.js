import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Field, GU, TextInput, useTheme, useViewport } from "@1hive/1hive-ui";
import {
  DAY_IN_SECONDS,
  HOUR_IN_SECONDS,
  MINUTE_IN_SECONDS,
} from "@utils/kit-utils";

import { css, jsx } from "@emotion/react";

const DurationFields = ({
  duration,
  onUpdate,
  label,
  direction = "row",
  required,
}) => {
  const theme = useTheme();
  const { above } = useViewport();
  const isRow = direction === "row";

  // Calculate the units based on the initial duration (in seconds).
  const [baseDays, baseHours, baseMinutes] = useMemo(() => {
    let remaining = duration;

    const days = Math.floor(remaining / DAY_IN_SECONDS);
    remaining -= days * DAY_IN_SECONDS;

    const hours = Math.floor(remaining / HOUR_IN_SECONDS);
    remaining -= hours * HOUR_IN_SECONDS;

    const minutes = Math.floor(remaining / MINUTE_IN_SECONDS);
    remaining -= minutes * MINUTE_IN_SECONDS;

    return [days, hours, minutes];
  }, [duration]);

  // Local units state − updated from the initial duration if needed.
  const [minutes, setMinutes] = useState(baseMinutes);
  const [hours, setHours] = useState(baseHours);
  const [days, setDays] = useState(baseDays);

  // If any of the units change, call onUpdate() with the updated duration,
  // so that it can get updated if the “next” button gets pressed.
  useEffect(() => {
    onUpdate(
      minutes * MINUTE_IN_SECONDS +
        hours * HOUR_IN_SECONDS +
        days * DAY_IN_SECONDS
    );
  }, [onUpdate, minutes, hours, days]);

  // Invoked by handleDaysChange etc. to update a local unit.
  const updateLocalUnit = useCallback((event, stateSetter) => {
    const value = Number(event.target.value);
    if (!isNaN(value)) {
      stateSetter(value);
    }
  }, []);

  const handleDaysChange = useCallback(
    (event) => updateLocalUnit(event, setDays),
    [updateLocalUnit]
  );
  const handleHoursChange = useCallback(
    (event) => updateLocalUnit(event, setHours),
    [updateLocalUnit]
  );
  const handleMinutesChange = useCallback(
    (event) => updateLocalUnit(event, setMinutes),
    [updateLocalUnit]
  );

  return (
    <Field label={label} required={required}>
      {({ id }) => (
        <div
          css={css`
            display: flex;
            padding-top: ${0.5 * GU}px;
            flex-direction: ${direction};
            width: 100%;
          `}
        >
          {[
            ["Days", handleDaysChange, days],
            ["Hours", handleHoursChange, hours],
            [
              above("medium") ? "Minutes" : "Min.",
              handleMinutesChange,
              minutes,
            ],
          ].map(([label, handler, value], index) => (
            <div
              key={label}
              css={css`
                flex-grow: 1;
                // max-width: ${17 * GU}px;
                & + & {
                  margin-${isRow ? "left" : "top"}: ${2 * GU}px;
                }
              `}
            >
              <TextInput
                id={index === 0 ? id : undefined}
                adornment={
                  <span
                    css={css`
                      padding: 0 ${1.5 * GU}px;
                      color: ${theme.contentSecondary.toString()};
                    `}
                  >
                    {label}
                  </span>
                }
                adornmentPosition="end"
                adornmentSettings={{
                  width: 8 * GU,
                  padding: 0,
                }}
                onChange={handler}
                value={value}
                wide
              />
            </div>
          ))}
        </div>
      )}
    </Field>
  );
};

DurationFields.propTypes = {
  duration: PropTypes.number,
  label: PropTypes.node,
  onUpdate: PropTypes.func.isRequired,
};

DurationFields.defaultProps = {
  duration: 0,
  label: "",
};

export default DurationFields;
