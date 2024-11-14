'use-client'
import TransitionWrapper from '@/components/TransitionWrapper'

import { TSliderItem } from '@/components/Slider/types'
import dynamic from 'next/dynamic'

const Slider = dynamic(() => import('@/components/Slider'))

interface PageAProps {
	slides: TSliderItem[]
}

const PageA: React.FC<PageAProps> = ({ slides }: { slides: TSliderItem[] }) => {
	return (
		<TransitionWrapper backgroundColor='#dfd98f'>
			<div className='pt-10'>
				{slides.length && (
					<div className='flex flex-col gap-4'>
						<Slider slides={slides} reversed={false} />
						<Slider slides={slides} reversed={true} />
					</div>
				)}
			</div>
		</TransitionWrapper>
	)
}

export default PageA
