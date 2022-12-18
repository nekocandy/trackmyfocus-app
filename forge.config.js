module.exports = {
	packagerConfig: {
		icon: './frontend/public/tmf.ico',
		"protocols": [
			{
				"name": "TrackMyFocus",
				"schemes": ["trackmyfocus"]
			}
		]
	},
	rebuildConfig: {},
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {
				iconUrl: "https://trackmyfocus.co/tmf.ico",
				setupIcon: "./frontend/public/tmf.ico",
			},
		},
		// {
		//   name: '@electron-forge/maker-zip',
		//   platforms: ['darwin'],
		// },
		// {
		//   name: '@electron-forge/maker-deb',
		//   config: {},
		// },
		// {
		//   name: '@electron-forge/maker-rpm',
		//   config: {},
		// },
	],
};
