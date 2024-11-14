import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import Image from 'next/image'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP)

const SliderCard = ({ imageSrc, imageHeight, imageWidth, alt, isFlipped }) => {
	const cardRef = useRef(null)

	const handleMouseMove = e => {
		const card = cardRef.current

		const xPos = e.clientX / window.innerWidth - 0.5
		const yPos = e.clientY / window.innerHeight - 0.5

		if (!isFlipped) {
			gsap.to(card, {
				duration: 0.1,
				rotationY: 50 * xPos,
				rotationX: -50 * yPos,
				x: xPos,
				y: yPos,
				ease: 'power2.out',
				transformPerspective: 900,
			})
		}
	}

	const handleMouseLeave = () => {
		const card = cardRef.current
		gsap.to(card, {
			rotationX: 0,
			rotationY: 0,
			duration: 0.3,
			ease: 'power2.out',
		})
	}

	return (
		<div
			ref={cardRef}
			className='w-full h-full flex flex-col logo-card rounded-lg overflow-hidden shadow-lg bg-white transform transition-all'
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}>
			<div className='cursor-pointer w-full h-full p-4 flex justify-center items-center'>
				{isFlipped ? (
					<p className='text-center text-2xl text-black'>{alt}</p>
				) : (
					<Image
						className='max-w-full max-h-[200px] w-full h-full object-cover'
						width={imageWidth}
						height={imageHeight}
						priority
						src={imageSrc}
						alt={alt}
					/>
				)}
			</div>
		</div>
	)
}

export default SliderCard
