'use client'
import { TSliderItem } from '@/components/Slider/types'
import { fetcher } from '@/helpers/imageFetcher'
import PageB from '@/screens/page-b'
import React, { useEffect, useState } from 'react'

const logos: TSliderItem[] = [
	{
		src: 'https://via.assets.so/game.jpg?w=1280&h=720',
		alt_description: 'Company 1',
	},
	{
		src: 'https://via.assets.so/game.jpg?w=1280&h=720',
		alt_description: 'Company 2',
	},
	{
		src: 'https://via.assets.so/game.jpg?w=1280&h=720',
		alt_description: 'Company 3',
	},
	{
		src: 'https://via.assets.so/game.jpg?w=1280&h=720',
		alt_description: 'Company 4',
	},
	{
		src: 'https://via.assets.so/game.jpg?w=1280&h=720',
		alt_description: 'Company 6',
	},
	{
		src: 'https://via.assets.so/game.jpg?w=1280&h=720',
		alt_description: 'Company 7',
	},
	{
		src: 'https://via.assets.so/game.jpg?w=1280&h=720',
		alt_description: 'Company 8',
	},
	{
		src: 'https://via.assets.so/game.jpg?w=1280&h=720',
		alt_description: 'Company 9',
	},
	{
		src: 'https://via.assets.so/game.jpg?w=1280&h=720',
		alt_description: 'Company 10',
	},
	{
		src: 'https://via.assets.so/game.jpg?w=1280&h=720',
		alt_description: 'Company 11',
	},
]

const LogoSliders: React.FC = () => {
	const [slides, setSlides] = useState([])

	const getData = async (): Promise<TSliderItem[]> => {
		try {
			const data = await fetcher({
				endpoint: 'photos/random',
			})
			return Array.isArray(data) ? (data as TSliderItem[]) : logos
		} catch (error) {
			console.error('Fetching error:', error)
			return logos
		}
	}

	useEffect(() => {
		const fetchSlides = async () => {
			const data = await getData()
			setSlides(data)
		}

		fetchSlides()
	}, [])

	if (!slides) return <div>Loading...</div>

	return <PageB slides={slides} />
}

export default LogoSliders
