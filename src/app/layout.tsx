import Navigation from '@/components/Navigation'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
	title: 'Animated test project',
	description:
		'Animated test project with using GSAP, Typescript, Tailwind and latest Next JS',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className='py-10 mx-auto transition linear'>
				<Navigation />
				{children}
			</body>
		</html>
	)
}
