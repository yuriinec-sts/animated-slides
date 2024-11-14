'use client'
import { TNavigationItem } from './types'
import Link from 'next/link'

const menuLinks: TNavigationItem[] = [
	{ path: '/page-a', name: 'Page A' },
	{ path: '/page-b', name: 'Page B' },
]

const Navigation = () => {
	return (
		<>
			<div className='flex align-center justify-center'>
				<ul className='flex align-center gap-3 p-4 bg-sky-500 rounded-lg '>
					{menuLinks.map((navigationEl: TNavigationItem) => (
						<li key={navigationEl.name} className=''>
							<Link href={navigationEl.path} className='hover:text-sky-200'>
								{navigationEl.name}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</>
	)
}

export default Navigation
