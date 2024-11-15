import SliderCard from '@/components/Slider/SliderCard'
import horizontalLoop from '@/helpers/horizontalLoop'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'
import ReactDOM from 'react-dom'

import { useRef, useState } from 'react'

gsap.registerPlugin(Observer, useGSAP)

const Modal = ({ isOpen, onClose, children }) => {
	if (!isOpen) return null

	return ReactDOM.createPortal(
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60'
			onClick={onClose}>
			<div
				className='relative bg-white p-4 w-[400px] h-[400px] rounded-lg shadow-lg'
				onClick={e => {
					e.stopPropagation()
					onClose()
				}}>
				<button className='absolute top-2 right-2 text-black' onClick={onClose}>
					&times;
				</button>
				{children}
			</div>
		</div>,
		document.body
	)
}

const HorizontalScroll = ({ reversed = false, slides }) => {
	const [flippedIndex, setFlippedIndex] = useState(null)

	const [isCardClicked, setIsCardClicked] = useState(false)
	const [originalTimeScale, setOriginalTimeScale] = useState(reversed ? 1 : -1)
	const wrapperRef = useRef(null)
	const itemsRef = useRef([])
	const overlayRef = useRef(null)
	const isCardClickedRef = useRef(false) // Заменяем useState на useRef

	const animateCardIn = card => {
		const bounds = card.getBoundingClientRect()
		card.classList.add('relative', 'z-20')
		gsap.set(overlayRef.current, { display: 'block', opacity: 0 })
		gsap.to(overlayRef.current, { opacity: 0.6, duration: 0.3 })
		gsap.to(card, {
			x: window.innerWidth / 2 - bounds.left - bounds.width / 2,
			y: window.innerHeight / 2 - bounds.top - bounds.height / 2,
			scale: 1.5,
			rotationY: 180,
			duration: 0.5,
			ease: 'power2.inOut',
		})
	}

	const animateCardOut = card => {
		card.classList.remove('relative', 'z-20')
		gsap.to(overlayRef.current, {
			opacity: 0,
			duration: 0.3,
			onComplete: () => {
				gsap.set(overlayRef.current, { display: 'none' })
			},
		})
		gsap.to(card, {
			x: 0,
			y: 0,
			scale: 1,
			rotationY: 0,
			duration: 0.5,
			ease: 'power2.inOut',
		})
	}
	const closeModal = () => {
		if (isCardClicked) {
			setIsCardClicked(false)
			setFlippedIndex(null)
			isCardClickedRef.current = false
			itemsRef.current.forEach(item => animateCardOut(item))
		}
	}

	useGSAP(
		() => {
			const loop = horizontalLoop('.box', {
				repeat: -1,
				speed: 1.5,
				paddingRight: 10,
				paused: false,
				reversed: !!reversed,
			})

			Observer.create({
				target: window,
				type: 'wheel,touch',
				onChangeY: self => {
					const factor = (self.deltaY > 0 ? 1 : -1) * (reversed ? -1 : 1)
					loop.timeScale(factor)
				},
			})

			Observer.create({
				target: wrapperRef.current,
				type: 'pointer,touch',
				capture: true,
				onHover: () => {
					loop.pause()
					setOriginalTimeScale(!originalTimeScale as unknown as number)
				},
				onHoverEnd: () => {
					if (!isCardClickedRef.current) {
						const direction = loop.timeScale()
						loop.play().timeScale(direction)
						itemsRef.current.forEach(item => {
							if (item.classList.contains('opacity-30')) {
								item.classList.remove('opacity-30')
							}
						})
					}
				},
			})

			itemsRef.current.forEach((item, index) => {
				Observer.create({
					target: item,
					type: 'pointer,touch',
					onClick: () => {
						setFlippedIndex(index)
						isCardClickedRef.current = true
						setIsCardClicked(prevIsClicked => {
							const newIsClicked = !prevIsClicked
							if (newIsClicked) {
								animateCardIn(item)
								loop.pause()
							} else {
								animateCardOut(item)
							}
							loop.pause()
							return newIsClicked
						})
					},
				})
			})
		},
		{ scope: wrapperRef }
	)

	return (
		<div>
			<div
				ref={wrapperRef}
				className='w-full h-[300px] overflow-hidden gap-4 relative flex items-center justify-center'>
				<div
					ref={overlayRef}
					className='fixed inset-0 bg-black opacity-60 z-10'
					style={{ display: 'none' }}
					onClick={closeModal}
				/>
				{slides.map((slide, index) => {
					return (
						<div
							key={index}
							ref={(el: HTMLDivElement | null) => {
								if (el) {
									itemsRef.current[index] = el
								}
							}}
							className='box w-1/5 h-[250px] min-w-[250px]'>
							<SliderCard
								isFlipped={flippedIndex === index}
								alt={slide?.alt_description}
								imageSrc={slide?.urls?.small || slide.src}
								imageHeight={slide?.height}
								imageWidth={slide?.width}
							/>
						</div>
					)
				})}
			</div>
			<Modal isOpen={isCardClicked} onClose={closeModal}>
				{flippedIndex !== null && (
					<SliderCard
						isFlipped={true}
						alt={slides[flippedIndex]?.alt_description}
						imageSrc={
							slides[flippedIndex]?.urls?.small || slides[flippedIndex]?.src
						}
						imageHeight={slides[flippedIndex]?.height}
						imageWidth={slides[flippedIndex]?.width}
					/>
				)}
			</Modal>
		</div>
	)
}

export default HorizontalScroll
