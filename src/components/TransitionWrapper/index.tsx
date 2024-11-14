import { gsap } from 'gsap'
import { useEffect } from 'react'

const TransitionWrapper = ({
	children,
	backgroundColor,
}: {
	children: React.ReactNode
	backgroundColor: string
}) => {
	useEffect(() => {
		const tl = gsap.timeline({ defaults: { duration: 1 } })

		tl.fromTo(
			'body',
			{ backgroundColor: 'initial' },
			{ backgroundColor: backgroundColor },
			'<'
		)

		return () => {
			const tlExit = gsap.timeline({ defaults: { duration: 1 } })
			tlExit.to('body', { backgroundColor: 'initial' }, '<')
		}
	}, [backgroundColor])

	return <div>{children}</div>
}

export default TransitionWrapper
