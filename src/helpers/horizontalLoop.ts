import gsap from 'gsap'
import { isArray } from 'util'

interface Config {
	repeat?: number
	paused?: boolean
	speed?: number
	reversed?: boolean
	paddingRight?: number
	snap?: boolean | number | ((value: number) => number)
}

interface LoopTimeline extends gsap.core.Timeline {
	next: (vars?: gsap.TweenVars) => gsap.core.Tween
	previous: (vars?: gsap.TweenVars) => gsap.core.Tween
	current: () => number
	toIndex: (index: number, vars?: gsap.TweenVars) => gsap.core.Tween
	times: number[]
}

export default function horizontalLoop(
	items: gsap.DOMTarget,
	config: Config = {}
): LoopTimeline {
	const elements = gsap.utils.toArray(items) as HTMLElement[]
	const tl = gsap.timeline({
		repeat: config.repeat,
		paused: config.paused,
		defaults: { ease: 'none' },
		onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100),
	}) as LoopTimeline

	const length = elements.length
	const startX = elements[0].offsetLeft
	const times: number[] = []
	const widths: number[] = []
	const xPercents: number[] = []
	let curIndex = 0
	const pixelsPerSecond = (config.speed || 1) * 100
	const snap =
		typeof config.snap === 'number' || Array.isArray(config.snap)
			? gsap.utils.snap(config.snap)
			: typeof config.snap === 'function'
			? config.snap
			: gsap.utils.snap(1)

	let totalWidth = 0

	gsap.set(elements, {
		xPercent: (i, el) => {
			const width = (widths[i] = parseFloat(
				gsap.getProperty(el, 'width', 'px') as string
			))
			xPercents[i] = snap(
				(parseFloat(gsap.getProperty(el, 'x', 'px') as string) / width) * 100 +
					(gsap.getProperty(el, 'xPercent') as number)
			)
			return xPercents[i]
		},
	})

	gsap.set(elements, { x: 0 })

	totalWidth =
		elements[length - 1].offsetLeft +
		(xPercents[length - 1] / 100) * widths[length - 1] -
		startX +
		elements[length - 1].offsetWidth *
			((gsap.getProperty(elements[length - 1], 'scaleX') as number) || 1) +
		(config.paddingRight || 0)

	for (let i = 0; i < length; i++) {
		const item = elements[i]
		const curX = (xPercents[i] / 100) * widths[i]
		const distanceToStart = item.offsetLeft + curX - startX
		const distanceToLoop =
			distanceToStart + widths[i] * (gsap.getProperty(item, 'scaleX') as number)

		tl.to(
			item,
			{
				xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
				duration: distanceToLoop / pixelsPerSecond,
			},
			0
		)
			.fromTo(
				item,
				{
					xPercent: snap(
						((curX - distanceToLoop + totalWidth) / widths[i]) * 100
					),
				},
				{
					xPercent: xPercents[i],
					duration:
						(curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
					immediateRender: false,
				},
				distanceToLoop / pixelsPerSecond
			)
			.add(`label${i}`, distanceToStart / pixelsPerSecond)

		times[i] = distanceToStart / pixelsPerSecond
	}

	const toIndex = (index: number, vars: gsap.TweenVars = {}) => {
		if (Math.abs(index - curIndex) > length / 2) {
			index += index > curIndex ? -length : length
		}
		const newIndex = gsap.utils.wrap(0, length, index) as number
		let time = times[newIndex]

		if (time > tl.time() !== index > curIndex) {
			vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) }
			time += tl.duration() * (index > curIndex ? 1 : -1)
		}

		curIndex = newIndex
		vars.overwrite = true
		return tl.tweenTo(time, vars)
	}

	tl.next = (vars?: gsap.TweenVars) => toIndex(curIndex + 1, vars)
	tl.previous = (vars?: gsap.TweenVars) => toIndex(curIndex - 1, vars)
	tl.current = () => curIndex
	tl.toIndex = (index: number, vars?: gsap.TweenVars) => toIndex(index, vars)
	tl.times = times
	tl.progress(1, true).progress(0, true)

	if (config.reversed) {
		tl.vars.onReverseComplete()
		tl.reverse()
	}

	return tl
}
