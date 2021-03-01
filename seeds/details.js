const Details = (num, campName, campLocal) => {
	const urlNums = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 ];
	// Durstenfeld shuffle
	const shuffleArray = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[ array[i], array[j] ] = [ array[j], array[i] ];
		}
		return array;
	};
	// Durstenfeld shuffle is an in place shuffle so we take a slice(0) to make a copy of urlNums
	const campFireNumber = shuffleArray(urlNums.slice(0));
	if (num <= 55) {
		return {
			title: `${campName}`,
			description: `${campName} is a serene environment located just outside of ${campLocal}.`,
			images: [
				{
					url: `https://res.cloudinary.com/dwaenqgi7/image/upload/v1614551030/CampCritic/GenericCampFire/GenCampFire_${campFireNumber[0]}.jpg`,
					filename: `CampCritic/GenericCampFire/GenCampFire_${campFireNumber[0]}.jpg`,
				},
				{
					url: `https://res.cloudinary.com/dwaenqgi7/image/upload/v1614551030/CampCritic/GenericCampFire/GenCampFire_${campFireNumber[1]}.jpg`,
					filename: `CampCritic/GenericCampFire/GenCampFire_${campFireNumber[1]}.jpg`,
				},
				{
					url: `https://res.cloudinary.com/dwaenqgi7/image/upload/v1614551030/CampCritic/GenericCampFire/GenCampFire_${campFireNumber[2]}.jpg`,
					filename: `CampCritic/GenericCampFire/GenCampFire_${campFireNumber[2]}.jpg`,
				},
			],
		};
	} else if (num > 55 && num <= 70) {
		return {
			title: `${campName}`,
			description: `${campName} is a dry mountain environment located within a short drive from ${campLocal}.`,
			images: [
				{
					url: `https://res.cloudinary.com/dwaenqgi7/image/upload/v1614550801/CampCritic/DryMountain/DryMountain_1.jpg`,
					filename: `CampCritic/DryMountain/DryMountain_1.jpg`,
				},
				{
					url: `https://res.cloudinary.com/dwaenqgi7/image/upload/v1614550802/CampCritic/DryMountain/DryMountain_2.jpg`,
					filename: `CampCritic/DryMountain/DryMountain_2.jpg`,
				},
				{
					url: `https://res.cloudinary.com/dwaenqgi7/image/upload/v1614550802/CampCritic/DryMountain/DryMountain_3.jpg`,
					filename: `CampCritic/DryMountain/DryMountain_3.jpg`,
				},
			],
		};
	} else if (num > 70 && num <= 85) {
		return {
			title: `${campName}`,
			description: `${campName} is a mountain environment with lush greens a quick trip from ${campLocal}.`,
			images: [
				{
					url: `https://res.cloudinary.com/dwaenqgi7/image/upload/v1614550898/CampCritic/GreenMountain/GreenMountain_1.jpg`,
					filename: `CampCritic/GreenMountain/GreenMountain_1.jpg`,
				},
				{
					url: `https://res.cloudinary.com/dwaenqgi7/image/upload/v1614550898/CampCritic/GreenMountain/GreenMountain_2.jpg`,
					filename: `CampCritic/GreenMountain/GreenMountain_2.jpg`,
				},
				{
					url: `https://res.cloudinary.com/dwaenqgi7/image/upload/v1614550898/CampCritic/GreenMountain/GreenMountain_3.jpg`,
					filename: `CampCritic/GreenMountain/GreenMountain_3.jpg`,
				},
			],
		};
	} else if (num > 85 && num <= 100) {
		return {
			title: `${campName}`,
			description: `${campName} is a magnificent wooded environment welcoming visitor all seasons near ${campLocal}.`,
			images: [
				{
					url: `https://res.cloudinary.com/dwaenqgi7/image/upload/v1614550905/CampCritic/Woods/Woods_1.jpg`,
					filename: `CampCritic/Woods/Woods_1.jpg`,
				},
				{
					url: `https://res.cloudinary.com/dwaenqgi7/image/upload/v1614550905/CampCritic/Woods/Woods_2.jpg`,
					filename: `CampCritic/Woods/Woods_2.jpg`,
				},
				{
					url: `https://res.cloudinary.com/dwaenqgi7/image/upload/v1614550905/CampCritic/Woods/Woods_3.jpg`,
					filename: `CampCritic/Woods/Woods_3.jpg`,
				},
			],
		};
	}
};

module.exports = Details;
