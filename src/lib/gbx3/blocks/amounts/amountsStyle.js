export const amountInputHeights = {
	4 : {
		height: 80
	},
	3 : {
		height: 100
	},
	2 : {
		height: 110
	},
	1 : {
		height: 120
	},
	0 : {
		height: 120
	}
}

export const amountInputStyle = {
	4 : {
		fontSize: '50px'
	},
	3 : {
		fontSize: '60px'
	},
	2 : {
		fontSize: '70px'
	},
	1 : {
		fontSize: '80px'
	},
	0 : {
		height: 120
	}
};

export const amountInputMoneyStyle = {
	4 : {
		position: 'absolute',
		top: '15px',
		left: 0,
		fontSize: '30px'
	},
	3 : {
		position: 'absolute',
		top: '20px',
		left: 0,
		fontSize: '35px'
	},
	2 : {
		position: 'absolute',
		top: '25px',
		left: 0,
		fontSize: '40px'
	},
	1 : {
		position: 'absolute',
		top: '25px',
		left: 0,
		fontSize: '40px'
	},
	0 : {
		height: 120
	}
};

export function defaultAmountHeight(num) {
	let height = 0;
	switch (num) {
		case 1: {
			height = 22;
			break;
		}

		case 2: {
			height = 22;
			break;
		}

		case 3: {
			height = 26;
			break;
		}

		case 4: {
			height = 29;
			break;
		}

		case 5: {
			height = 33;
			break;
		}

		case 6: {
			height = 37;
			break;
		}

		case 7: {
			height = 40;
			break;
		}

		// no default
	}
	console.log('execute amountsSectionHeight', num, height);

	return height;
}
