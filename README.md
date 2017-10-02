# Rollex
[![Build Status](https://travis-ci.org/umbrellio/rollex.svg?branch=master)](https://travis-ci.org/umbrellio/rollex)

[![Build Status](https://saucelabs.com/browser-matrix/akxcv.svg)](https://saucelabs.com/beta/builds/df8e5b2fed574a62881a95bd89331d02)

Versatile counters in React

## Installation

Install with yarn:

```sh
yarn add rollex
# or npm:
npm i -S rollex
```

## Usage

1. Import `Counter` component:

```js
import { Counter } from 'rollex'
```

2. Use it:

```jsx
<Counter seconds={98} />
```

## API

### Setting time intervals

There are multiple ways of setting the time interval to count down (or up) to:

You can tell Rollex how many seconds to count:
```jsx
<Counter seconds={60} />
```

Or, you can specify timestamps to count to (and from):

```jsx
// from now to a given timestamp
<Counter to={1506951918155} />
// from `from` to `to`
<Counter from={1506951900123} to={1506951918155} />
```

### Update interval
By default, Rollex counters update every second. You can, however, set your own update period via
`interval` prop:

```jsx
// update every 2 seconds
<Counter seconds={60} interval={2000} />
```

### Countdown direction
By default, Rollex counters count "down" (from, say, 60 down to 0). You can make a counter go up:

```jsx
// from 0 to 60
<Counter seconds={60} direction="up" />
```

### Periods and segments
Rollex counters are split into *periods* (days, hours, minutes, seconds). Each period has its own
*segment*, which contains the digits which correspond to a given period.

By default, Rollex counters use four periods: "days", "hours", "minutes", "seconds" and each segment
is exactly 2 digits long.

You can control this behaviour:

```jsx
// show only hours and minutes
<Counter seconds={3600} minPeriod="minutes" maxPeriod="hours" />
// show 3 digits per segment
<Counter seconds={72 * 3600} digits={3} />
```

### Freezing the countdown

You can temporarily (or not) freeze the counter by passing it a `frozen` prop:

```jsx
<Counter seconds={60} frozen />
```

When `frozen` is truthy, the counter will not update at all.

### Synchronizing time with client

By default, Rollex counters do not try to synchronize time. That means that if a counter is frozen
at 59 seconds, and then unfrozen after an hour, it will continue counting down from 59 seconds.
If time sync is enabled, the counter will synchronize time and instantly go down to 0.

```jsx
<Counter seconds={59} syncTime />
```

### Animating the counter
By default, Rollex counters are not animated (they look like digital clocks). If you want to enable
animations (make the counters look analog), you should pass the `easingFunction` prop (any valid
CSS easing function):

```jsx
<Counter seconds={59} easingFunction='ease-in-out' />
```

You can also control animation duration (300 ms by default):

```jsx
<Counter seconds={59} easingFunction='ease-in-out' easingDuration={500} />
```

### Radix

You can even control the radix that Rollex counters use! By default it's 10, but if you want to
go [dozenal](http://dozenal.org), you can:

```jsx
<Counter seconds={3600} radix={12} />
```

### Transform and wrap digits

If you want to use different symbols for your digits, you can (let's say, you want a dozenal
counter with 'X' representing a 10 and 'E' representing an 11):

```jsx
<Counter seconds={3600} radix={12} digitMap={{
  'A': 'X',
  'B': 'E',
}} />
```

You can get even more control over your digits with a digit map:

```jsx
// use images instead of text for digits
<Counter
  seconds={3600}
  digitWrapper={digit => <img src={`/digits/${digit}.jpg`} />}
/>
```

### Labels and separators

All counter segments can be labelled.

```jsx
// map from periods to strings
<Counter seconds={141234} labels={{
  days: 'days',
  hours: 'hours'
}} />
// use a function (use case: pluralisation)
<Counter seconds={123123} labels={(period, number) => {
  return number % 10 === 1 ? period.slice(0, -1) : period
}}>
```

Segments can be separated by a separator symbol:

```jsx
// dd:hh:mm:ss
<Counter seconds={2312413} separator=':' />
```
